import {Block1} from './original-classes.mjs';
// Normal walking clears a 16px tile with an 8px player in eight frames.
export const FALLING_TATAMI_DELAY=10;
// Block19.fall_speed: the original descending block while ridden.
export const FALLING_TATAMI_SPEED=4;
export class FallingTatami extends Block1 {
 init(){super.init();this.typeNo=41;this.object_wall=false;this.call=true;this.px=this._x;this.py=this._y;this.wait=null;this.dir=1;this.falling=false;this.stopped=false;this.riderContact=false;}
 arm(fg){
  if(this.riderContact)return;
  this.riderContact=true;
  if(this.wait!==null||this.falling)return;
  this.wait=FALLING_TATAMI_DELAY;this.dir=fg;
 }
 callObject(tx,ty,tdx,tdy,tw,th,player){
  // Staying aboard after a stop is not a new landing. Leaving releases the latch.
  const foot=player?.fg<0?ty-th:ty,surface=player?.fg<0?this._y:this._y-16;
  if(tx+tw<=this._x||tx>=this._x+16||Math.abs(foot-surface)>3)this.riderContact=false;
  if(this.wait!==null&&!this.falling){
   if(this.wait>0){this.wait--;if(!this.stopped)return;}
   else {this.wait=null;this.stopped=false;this.falling=true;this.wall=false;this.object_wall=false;}
  }
  if(!this.falling&&!this.stopped)return;
  const s=this._parent,size=s.square_size,top=this._y-size;
  const delta=this.stopped?0:this.dir*FALLING_TATAMI_SPEED;
  let moved=delta,blocked=false;
  if(delta>0&&this._y+delta>=s.scy){moved=s.scy-this._y;blocked=true;}
  if(delta<0&&top+delta<=0){moved=-top;blocked=true;}
  for(const b of s.blocks){
   if(b===this||b.broken||b.vanished||b.toolBroken||b.collected||b.unlocked)continue;
   // Match Block19: only object_wall stops the falling block.
   if(!b.object_wall)continue;
   if(this._x>=b._x+size-1e-7||this._x+size<=b._x+1e-7)continue;
   const gap=delta>0?b._y-size-this._y:b._y-top;
   if(delta>0&&gap>=-1e-7&&gap<=moved){moved=Math.max(0,gap);blocked=true;}
   if(delta<0&&gap<=1e-7&&gap>=moved){moved=Math.min(0,gap);blocked=true;}
  }
  this._y+=moved;this.px=this._x;this.py=this._y;
  if(blocked){this.falling=false;this.stopped=true;}
  const left=tx+tdx,right=left+tw,pTop=ty+tdy-th,bottom=ty+tdy;
  if(right>=this._x&&left<=this._x+size&&pTop<=this._y&&bottom>=this._y-size)player?.hitMoveVBlock(this._x,this._y,moved,this);
 }
}
