// Rendering only: retain contiguous static sprite runs in their original order.
const STATIC_TYPES=new Set([1,3,4,8,9,10,11,15,20,21,22,23]);
export class StaticBlockCache {
 constructor(){this.stage=null;this.snapshots=[];this.heads=new Map();this.members=new Set();this.rebuilds=0;this.types=new Set();}
 eligible(b){return STATIC_TYPES.has(b.typeNo)&&!b.letterSymbol&&!b.broken&&!b.collected&&!b.unlocked&&!b.toolBroken;}
 prepare(stage,frame,ctx,manifest,images){
  const t=ctx.getTransform(),phaseX=t.e-Math.floor(t.e),phaseY=t.f-Math.floor(t.f);
  const key=[t.a,t.d,phaseX,phaseY,ctx.imageSmoothingEnabled].join(',');
  const descriptors=stage.blocks.map(b=>{if(!this.eligible(b))return null;const n=typeof frame==='function'?frame(b):frame,frames=manifest['block'+b.typeNo+'-'+n];if(!frames?.length)return null;const a=b.graphic?.animation||0,f=frames[((a%frames.length)+frames.length)%frames.length],im=images.get(f.url);return im?.complete?{f,im}:null;});
  let dirty=this.stage!==stage||this.key!==key||this.snapshots.length!==stage.blocks.length;
  if(!dirty)for(let i=0;i<stage.blocks.length;i++){const b=stage.blocks[i],v=this.snapshots[i];if(v.b!==b||v.x!==b._x||v.y!==b._y||v.f!==descriptors[i]?.f){dirty=true;break;}}
  if(!dirty)return;
  this.stage=stage;this.key=key;this.snapshots=stage.blocks.map((b,i)=>({b,x:b._x,y:b._y,f:descriptors[i]?.f}));this.heads.clear();this.members.clear();this.types.clear();this.rebuilds++;
  for(let i=0;i<stage.blocks.length;){if(!descriptors[i]){i++;continue;}
   const first=stage.blocks[i],run=[];do{run.push({b:stage.blocks[i],...descriptors[i++]});}while(i<stage.blocks.length&&descriptors[i]);
   if(run.length<8)continue;
   const left=Math.floor(Math.min(...run.map(({b,f})=>b._x+f.x))*t.a+phaseX),top=Math.floor(Math.min(...run.map(({b,f})=>b._y+f.y))*t.d+phaseY);
   const right=Math.ceil(Math.max(...run.map(({b,f})=>b._x+f.x+f.width))*t.a+phaseX),bottom=Math.ceil(Math.max(...run.map(({b,f})=>b._y+f.y+f.height))*t.d+phaseY);
   if(right<=left||bottom<=top)continue;
   const layer=document.createElement('canvas');layer.width=right-left;layer.height=bottom-top;
   const c=layer.getContext('2d');c.setTransform(t.a,0,0,t.d,phaseX-left,phaseY-top);c.imageSmoothingEnabled=ctx.imageSmoothingEnabled;
   for(const {b,f,im} of run){this.members.add(b);this.types.add(b.typeNo);c.save();c.translate(b._x,b._y);c.drawImage(im,f.x,f.y,f.width,f.height);c.restore();}
   this.heads.set(first,{layer,left,top});
  }
 }
 draw(ctx,b){const layer=this.heads.get(b);if(layer){const t=ctx.getTransform();ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(layer.layer,Math.floor(t.e)+layer.left,Math.floor(t.f)+layer.top);ctx.restore();}return this.members.has(b);}
}
