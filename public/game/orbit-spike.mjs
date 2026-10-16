import {Block} from './original-classes.mjs';
const key=(x,y)=>x+','+y;
// Stopper (4) and ladder (9) also form orbit contours.
const isOrbitSurface=b=>(b.wall||b.typeNo===4||b.typeNo===9)&&![30,41].includes(b.typeNo)&&!b.call&&!b.broken&&!b.vanished&&!b.toolBroken&&!b.unlocked;
export function hasOrbitNeighbor(stage,x,y){
 const cx=Math.floor(x/16),cy=Math.floor(y/16);
 for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){
  if(dx===0&&dy===0)continue;
  const b=stage.cell(cx+dx,cy+dy);if(b&&isOrbitSurface(b))return true;
 }
 return false;
}
export function buildOrbitPaths(stage){
 const solid=new Set(stage.blocks.filter(isOrbitSurface).map(b=>key(b.ox/16,b.oy/16-1)));
 const edges=[];
 for(const cell of solid){const [x,y]=cell.split(',').map(Number);
  if(!solid.has(key(x,y-1)))edges.push({a:[x*16,y*16],b:[(x+1)*16,y*16],dir:0});
  if(!solid.has(key(x+1,y)))edges.push({a:[(x+1)*16,y*16],b:[(x+1)*16,(y+1)*16],dir:1});
  if(!solid.has(key(x,y+1)))edges.push({a:[(x+1)*16,(y+1)*16],b:[x*16,(y+1)*16],dir:2});
  if(!solid.has(key(x-1,y)))edges.push({a:[x*16,(y+1)*16],b:[x*16,y*16],dir:3});
 }
 const starts=new Map();for(const e of edges){const k=key(...e.a);if(!starts.has(k))starts.set(k,[]);starts.get(k).push(e);}
 const used=new Set(),paths=[],normals=[[0,-1],[1,0],[0,1],[-1,0]];
 for(const first of edges){if(used.has(first))continue;const loop=[];let e=first;
  while(e&&!used.has(e)){used.add(e);loop.push(e);const choices=(starts.get(key(...e.b))||[]).filter(n=>!used.has(n)||n===first);choices.sort((a,b)=>[1,0,3,2].indexOf((a.dir-e.dir+4)%4)-[1,0,3,2].indexOf((b.dir-e.dir+4)%4));e=choices[0];if(e===first)break;}
  if(e!==first)continue;
  const area=loop.reduce((sum,e)=>sum+e.a[0]*e.b[1]-e.b[0]*e.a[1],0);if(area<=0)continue; // Outer contours only.
  const points=loop.map((edge,i)=>{const prev=loop[(i+loop.length-1)%loop.length],n=normals[edge.dir],p=normals[prev.dir];return [edge.a[0]+8*(n[0]===p[0]?n[0]:n[0]+p[0]),edge.a[1]+8*(n[1]===p[1]?n[1]:n[1]+p[1])];});
  const segments=points.map((a,i)=>{const b=points[(i+1)%points.length];return {a,b,length:Math.hypot(b[0]-a[0],b[1]-a[1])};}).filter(e=>e.length>0);
  paths.push({segments,length:segments.reduce((n,e)=>n+e.length,0)});
 }
 return paths;
}
function nearest(paths,x,y){let best=null,distance=Infinity;
 for(const path of paths){let offset=0;for(const e of path.segments){const dx=e.b[0]-e.a[0],dy=e.b[1]-e.a[1],t=Math.max(0,Math.min(1,((x-e.a[0])*dx+(y-e.a[1])*dy)/(e.length*e.length))),px=e.a[0]+dx*t,py=e.a[1]+dy*t,d=Math.hypot(px-x,py-y);if(d<distance){distance=d;best={path,offset:offset+t*e.length};}offset+=e.length;}}
 return best;
}
function at(path,d){for(const e of path.segments){if(d<=e.length){const t=d/e.length;return [e.a[0]+(e.b[0]-e.a[0])*t,e.a[1]+(e.b[1]-e.a[1])*t];}d-=e.length;}return path.segments[0].a;}
export class OrbitSpike extends Block {
 init(){this.superinit();Object.assign(this,{typeNo:46,wall:false,object_wall:false,stopper:false,damage:false,orbitSpike:true,call:true,route:null,speed:2});}
 callObject(px,py,dx,dy,pw,ph,player){
  if(this.called)return;this.called=true;const stage=this._parent;
  if(stage.run&&hasOrbitNeighbor(stage,this._x+8,this._y-8)){
   const signature=stage.blocks.filter(isOrbitSurface).map(b=>b.ox+','+b.oy).join(';');
   if(stage.orbitSignature!==signature){stage.orbitSignature=signature;stage.orbitPaths=buildOrbitPaths(stage);}
   if(this.signature!==signature||!this.route){const route=nearest(stage.orbitPaths,this._x+8,this._y-8);this.route=route;this.signature=signature;}
   if(this.route){this.route.offset=(this.route.offset+this.speed)%this.route.path.length;const [x,y]=at(this.route.path,this.route.offset);this._x=x-8;this._y=y+8;}
  }
  if(stage.run&&!hasOrbitNeighbor(stage,this._x+8,this._y-8))this.route=null;
  if(px+dx+pw>this._x&&px+dx<this._x+16&&py+dy>this._y-16&&py+dy-ph<this._y)player._parent.dead(px,py);
 }
}
const cache=new WeakMap();
export function drawOrbitSpike(ctx,image,x,y){
 let sprite=cache.get(image);
 if(!sprite){
  sprite=document.createElement('canvas');sprite.width=sprite.height=16;
  const c=sprite.getContext('2d');c.drawImage(image,0,0,16,16);
  const data=c.getImageData(0,0,16,16);
  // Original moving-spike frames: preserve metal and recolor only the red core.
  for(let i=0;i<data.data.length;i+=4){
   const r=data.data[i],g=data.data[i+1],b=data.data[i+2];
   if(r>g&&r>=b){data.data[i+1]=Math.max(g,Math.round(r*.9));data.data[i+2]=Math.min(g,b);}
  }
  c.putImageData(data,0,0);cache.set(image,sprite);
 }
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,x,y-16);ctx.restore();
}
