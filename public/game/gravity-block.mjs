import {Block19} from './original-classes.mjs';

// Uses the original falling platform's speed and player/platform collision response.
export class GravityBlock extends Block19 {
 init(){
  super.init();this.typeNo=24;this.dir=1;this.touch=false;
  this.px=this._x;this.py=this._y;
 }
 move(axis,delta,{x=this._x,y=this._y-this._parent.square_size,apply=true}={}){
  const s=this._parent,size=s.square_size;
  let moved=delta,contact=null;
  const obstacles=[];
  for(let cx=0;cx<s.xsize;cx++)for(let cy=0;cy<s.ysize;cy++){
   const b=s.cell(cx,cy);
   if(b!==this&&b?.object_wall)obstacles.push({x:cx*size,y:cy*size,b});
  }
  for(const b of s.blocks)if(b!==this&&b.typeNo===24)obstacles.push({x:b._x,y:b._y-size,b});
  const extent=axis==='x'?s.scx:s.scy,pos=axis==='x'?x:y;
  moved=delta>0?Math.min(delta,extent-size-pos):Math.max(delta,-pos);
  for(const o of obstacles){
   const overlap=axis==='x'?y<o.y+size-1e-7&&y+size>o.y+1e-7:x<o.x+size-1e-7&&x+size>o.x+1e-7;
   if(!overlap)continue;
   const edge=axis==='x'?o.x:o.y;
   const gap=delta>0?edge-(pos+size):edge+size-pos;
   if(delta>0&&gap>=-1e-7&&gap<=moved){moved=Math.max(0,gap);contact=o.b;}
   if(delta<0&&gap<=1e-7&&gap>=moved){moved=Math.min(0,gap);contact=o.b;}
  }
  if(apply){
   if(axis==='x')this._x+=moved;else this._y+=moved;
   this.px=this._x;this.py=this._y;
  }
  return {moved,contact};
 }
 callObject(tx,ty,tdx,tdy,tw,th,object){
  const size=this._parent.square_size;
  const delta=this.dir*this.fall_speed;
  const vertical=this.move('y',delta);
  // A tile-wide passage otherwise requires pixel-perfect positioning after a push.
  // Align only near its entrance, when both the sideways correction and travel are clear.
  const aligned=Math.round(this._x/size)*size,correction=aligned-this._x;
  const remaining=delta-vertical.moved;
  if(Math.abs(remaining)>1e-7&&Math.abs(correction)>1e-7&&Math.abs(correction)<=this.fall_speed){
   const sideways=this.move('x',correction,{apply:false});
   const onward=this.move('y',remaining,{x:aligned,apply:false});
   if(Math.abs(sideways.moved-correction)<1e-7&&Math.abs(onward.moved-remaining)<1e-7){
    this.move('x',correction);
    const rest=this.move('y',remaining);vertical.moved+=rest.moved;vertical.contact=rest.contact;
   }
  }
  this.d=vertical.moved;
  if(vertical.contact?.reverseGravity)this.dir*=-1;
  const left=tx+tdx,right=left+tw,top=ty+tdy-th,bottom=ty+tdy;
  // Allow side pushes only while supported in the current gravity direction.
  // Probe after landing or gravity reversal without changing the block's position.
  const supported=Math.abs(this.move('y',this.dir*this.fall_speed,{apply:false}).moved)<1e-7;
  if(supported&&top<this._y&&bottom>this._y-size){
   if(tdx>0&&tx+tw<=this._x+1&&right>=this._x)this.move('x',right+1-this._x);
   else if(tdx<0&&tx>=this._x+size-1&&left<=this._x+size)this.move('x',left-1-(this._x+size));
  }
  if(right>=this._x&&left<=this._x+size&&top<=this._y&&bottom>=this._y-size){
   object?.hitMoveVBlock(this._x,this._y,vertical.moved,this);
  }
 }
}
