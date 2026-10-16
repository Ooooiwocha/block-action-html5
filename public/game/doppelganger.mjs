import {Player} from './original-classes.mjs';
import {Sprite,Key} from './runtime.mjs';
export class Doppelganger {
 constructor(stage,continuous=false){
  Object.assign(this,{stage,continuous,distance:0,history:[],index:0,active:false,defeated:false,deathFrame:0});
  const p=this.player=new Player();p.init();p.action=new Sprite();p.pw=8;p.ph=16;
  p.px=stage.player.px;p.py=stage.player.py;p._x=p.px;p._y=p.py;
  const world=Object.create(stage);p._parent=world;world.player=p;world.objArr=[];
  world.dead=world.gameOver=()=>this.die();world.goal=()=>{};
  world.collectKey=world.useTool=()=>false;world.breakBlock=world.setColor=world.awakenMoai=()=>{};
  p.landing=()=>{p.landed=true;};p.commonWall=()=>{};
 }
 die(){if(this.defeated)return;this.defeated=true;this.player._visible=false;this.deathFrame=1;this.deathPosition={x:this.player.px,y:this.player.py};}
 tickDeath(){if(this.deathFrame>0&&this.deathFrame<30)this.deathFrame++;}
 update(before,warped=false,moversBefore=new Map()){
  if(this.defeated)return;
  const s=this.stage,real=s.player,dx=real.px-before.px,dy=real.py-before.py,moving=!warped&&Math.hypot(dx,dy)>1e-7;
  if(moving){this.distance+=Math.hypot(dx,dy);this.history.push({dx,dy,fg:real.fg,frame:real.action.frame,keys:[...Key.held].filter(k=>k!==9)});}
  if(!this.active){if(this.distance<(this.continuous?200:100))return;this.active=true;}
  const p=this.player,old={x:p.px,y:p.py};p.dx=p.dy=0;p.moved=false;
  if(this.continuous||moving){
   const frame=this.history[this.index];
   if(frame){this.index++;this.lastFrame=frame;p.fg=frame.fg;p.dx=frame.dx;p.dy=frame.dy;p.action.gotoAndStop(frame.frame);}
   else if(this.continuous){
    // Once the replay reaches the present, mirror current movement instead of
    // simulating stale controls. A new movement is consumed above in this tick.
    p.fg=real.fg;p.action.gotoAndStop(real.action.frame);
   }
   p.action.animation++;
  }
  // Blocks have already moved for the player. Resolve the enemy against their
  // swept positions without advancing the blocks a second time, even while idle.
  for(const b of s.objArr){
   if(b.vanished||b.broken||b.toolBroken||b.unlocked||b.collected||b.solid===false)continue;
   const w=b.sizex||16,h=b.sizey||16,x=b._x,y=b._y,prior=moversBefore.get(b)||{x,y},bx=x-prior.x,by=y-prior.y;
   const overlapX=p.px+p.dx+p.pw>x&&p.px+p.dx<x+w;
   if(overlapX&&Math.abs(old.y-(prior.y-h))<.01&&p.fg>0&&p.dy>=0){p.px+=bx;p.py=y-h;p.dy=0;p.landed=true;}
   else if(overlapX&&Math.abs(old.y-p.ph-prior.y)<.01&&p.fg<0&&p.dy<=0){p.px+=bx;p.py=y+p.ph;p.dy=0;p.landed=true;}
   if(p.px+p.dx+p.pw<=x||p.px+p.dx>=x+w||p.py+p.dy<=y-h||p.py+p.dy-p.ph>=y)continue;
   if(b.damage||b.orbitSpike){this.die();return;}
   if(bx>0&&old.x>=prior.x+w-.01){p.px=x+w+1;p.dx=Math.max(0,p.dx);}
   else if(bx<0&&old.x+p.pw<=prior.x+.01){p.px=x-p.pw-1;p.dx=Math.min(0,p.dx);}
   else if(by<0&&old.y<=prior.y-h+.01){p.py=y-h;p.dy=0;p.landed=true;}
   else if(by>0&&old.y-p.ph>=prior.y-.01){p.py=y+p.ph;p.dy=0;p.landed=true;}
   else p.hitJumpBlock(x,y,{...b,sizex:w,sizey:h});
  }
  p.wallCheck();if(this.defeated)return;
  p.px+=p.dx;p.py+=p.dy;p._x=p.px;p._y=p.fg<0?p.py-16:p.py;
  if(p.py<0||p.py>s.scy+16){this.die();return;}
  if(p.px<real.px+real.pw&&p.px+p.pw>real.px&&p.py-p.ph<real.py&&p.py>real.py-real.ph)s.dead();
 }
}
