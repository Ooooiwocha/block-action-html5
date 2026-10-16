import {drawHannyaHi} from './hannya-hi-art.mjs?v=balanced-eyes-2';
const directions=[[0,0],[0,-1],[0,1],[-1,0],[1,0]];
export const HANNYA_DEFEAT_FRAMES=12;
export const HANNYA_HURT_FRAMES=40; // 40 / 33 loops per second ≈ 1.2 seconds.
export class Hannya{
 constructor(stage,goal,random=()=>stage.random()){this.stage=stage;this.x=goal.ox;this.y=goal.oy-16;this.size=16;this.speed=3.2;this.random=random;this.remaining=0;this.wait=0;this.direction=[0,0];this.health=3;this.hurtFrame=0;}
 blocked(x,y){if(x<0||y<0||x+16>480||y+16>448)return true;return this.stage.blocks.some(b=>(b.object_wall||b.typeNo===19||([38,39,43].includes(b.typeNo)&&b.solid))&&!b.broken&&!b.vanished&&!b.collected&&!b.unlocked&&!b.toolBroken&&x<b._x+16&&x+16>b._x&&y<b._y&&y+16>b._y-16);}
 decide(){
  const p=this.stage.player,dx=p.px+p.pw/2-(this.x+8),dy=p.py-p.ph/2-(this.y+8),sum=Math.abs(dx)+Math.abs(dy)||1;
  const weights=directions.map(([x,y],i)=>i===0?1:this.blocked(this.x+x,this.y+y)?0:1+4*Math.max(0,(x*dx+y*dy)/sum));
  let ticket=this.random()*weights.reduce((a,b)=>a+b,0),chosen=0;for(let i=0;i<weights.length;i++){ticket-=weights[i];if(ticket<0){chosen=i;break;}}
  this.direction=directions[chosen];
  if(chosen===0){this.wait=10+Math.floor(this.random()*11);this.remaining=0;}
  else this.remaining=this.random()<.5?16:32;
 }
 update(){
  if(this.defeated||this.hurtFrame>0)return;
  if(this.touchPlayer())return;
  if(this.wait>0){this.wait--;return;}
  if(this.remaining<=0)this.decide();
  if(!this.remaining)return;
  let budget=Math.min(this.speed,this.remaining);while(budget>1e-8){const step=Math.min(1,budget),[dx,dy]=this.direction,x=this.x+dx*step,y=this.y+dy*step;if(this.blocked(x,y)){this.remaining=0;break;}this.x=x;this.y=y;this.remaining=Math.max(0,this.remaining-step);if(this.remaining<1e-8)this.remaining=0;budget-=step;}
  this.touchPlayer();
 }
 tickDeath(){if(this.hurtFrame>0)this.hurtFrame--;if(this.defeated)this.deathFrame=Math.min(HANNYA_DEFEAT_FRAMES,this.deathFrame+1);}
 touchPlayer(){if(this.defeated||this.hurtFrame>0)return false;const p=this.stage.player;const hit=this.x<p.px+p.pw&&this.x+16>p.px&&this.y<p.py&&this.y+16>p.py-p.ph;if(hit){if(this.stage.stock?.purify>0){this.stage.stock.purify--;this.health--;this.remaining=0;this.wait=0;if(this.health<=0){this.defeated=true;this.deathFrame=0;}else this.hurtFrame=HANNYA_HURT_FRAMES;}else this.stage.dead();}return hit;}
}
let sprite,redSprite;
export function drawHannyaEnemy(ctx,enemy){const progress=enemy.defeated?enemy.deathFrame/HANNYA_DEFEAT_FRAMES:0;if(progress>=1)return;if(!sprite){sprite=document.createElement('canvas');sprite.width=sprite.height=32;drawHannyaHi(sprite.getContext('2d'));}if(enemy.variant&&!redSprite){redSprite=document.createElement('canvas');redSprite.width=redSprite.height=32;const c=redSprite.getContext('2d');c.drawImage(sprite,0,0);c.globalCompositeOperation='source-atop';c.globalAlpha=.6;c.fillStyle='#ef3038';c.fillRect(0,0,32,32);}ctx.save();ctx.imageSmoothingEnabled=false;if(enemy.hurtFrame>0)ctx.globalAlpha=enemy.hurtFrame%2?.18:.85;ctx.translate(Math.round(enemy.x)+8,Math.round(enemy.y)+8);ctx.rotate(progress*Math.PI*2);ctx.scale(1-progress,1-progress);ctx.drawImage(enemy.variant?redSprite:sprite,-8,-8,16,16);ctx.restore();}
