export {drawGear} from './gear-art.mjs';
import {Block7} from './original-classes.mjs';
const clockwise={20:22,22:21,21:23,23:20};
export class GearBlock extends Block7 {
 init(){super.init();this.typeNo=100;this.wall=false;this.object_wall=false;this.turnFrames=0;}
}
export function rotateHalfSpikes(stage){
 for(const b of stage.blocks)if(clockwise[b.typeNo])b.typeNo=clockwise[b.typeNo];
}
function overlap(b,p){return p.px<b._x+16&&p.px+(p.pw||8)>b._x&&p.py>b._y-16&&p.py-(p.ph||16)<b._y;}
function swept(b,from,to){
 let enter=0,leave=1;
 for(const [a,z,lo,hi] of [[from.px,to.px,b._x-(to.pw||8),b._x+16],[from.py,to.py,b._y-16,b._y+(to.ph||16)]]){
  const d=z-a;if(!d){if(a<=lo||a>=hi)return false;continue;}
  const x=(lo-a)/d,y=(hi-a)/d;enter=Math.max(enter,Math.min(x,y));leave=Math.min(leave,Math.max(x,y));
 }
 return enter<leave;
}
export function updateGears(stage,from,to,teleported=false){
 const next=new Set();
 for(const b of stage.blocks)if(b.typeNo===100){
  const touching=overlap(b,to);
  if(touching)next.add(b);
  if(!stage.gearContacts.has(b)&&(touching||(!teleported&&swept(b,from,to)))){rotateHalfSpikes(stage);b.turnFrames=8;}
  else if(b.turnFrames>0)b.turnFrames--;
 }
 stage.gearContacts=next;
}
