import {Block1} from './original-classes.mjs';
export const TATAMI_FRAMES=8; // (16px tile + 8px player) / 3px normal walking.
export class TatamiBlock extends Block1 {
 init(){super.init();this.typeNo=30;this.object_wall=false;this.fadeFrame=0;this.fading=false;this.vanished=false;}
}
export class PassageBlock extends Block1 {
 init(){super.init();this.typeNo=31;this.solid=false;this.entryFace=null;this.wall=false;this.object_wall=false;}
}
export class MetalPassageBlock extends PassageBlock {
 init(){super.init();this.typeNo=102;this.kickdisable=true;}
}
// Sweep the player's body, not just its centre, against the open tile rectangle.
// A boundary touch or a corner graze is not entry. Solids appear only after the
// whole body has left, so activation never traps the player in the new wall.
export function updatePassageBlock(b,from,to){
 if(b.solid)return;
 const w=to.pw||8,h=to.ph||16;
 const bounds=[b.ox-w,b.ox+16,b.oy-16,b.oy+h];
 const inside=p=>p.px>bounds[0]&&p.px<bounds[1]&&p.py>bounds[2]&&p.py<bounds[3];
 let enter=-Infinity,leave=Infinity,entry=null,exit=null;
 for(const [start,end,low,high,lowFace,highFace] of [
  [from.px,to.px,bounds[0],bounds[1],'left','right'],
  [from.py,to.py,bounds[2],bounds[3],'top','bottom']
 ]){
  const d=end-start;
  if(d===0){if(start<=low||start>=high)return;continue;}
  const a=(low-start)/d,z=(high-start)/d;
  const first=Math.min(a,z),last=Math.max(a,z);
  if(first>enter){enter=first;entry=d>0?lowFace:highFace;}
  if(last<leave){leave=last;exit=d>0?highFace:lowFace;}
 }
 if(enter>=leave||leave<=0||enter>=1)return;
 if(!inside(from)&&enter>=0)b.entryFace=entry;
 if(!inside(to)&&leave<=1){
  if(b.entryFace&&b.entryFace!==exit){b.solid=true;b.wall=true;b.object_wall=true;}
  b.entryFace=null;
 }
}
