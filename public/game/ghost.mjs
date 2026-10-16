import {drawCurse} from './skull-art.mjs?v=4';
export const GHOST_DEFEAT_FRAMES=26;
export class Ghost {
 constructor(stage,goal){
  this.stage=stage;this.x=goal.ox;this.y=goal.oy-16;this.speed=.6;this.size=16;
  this.history=[this.position()];this.target={...this.history[0]};
 }
 position(){const p=this.stage.player;return {x:p.px+4,y:p.py-8};}
 update(){
  if(this.defeated)return;
  this.history.push(this.position());if(this.history.length>51)this.history.shift();
  this.target=this.history[0];const dx=this.target.x-(this.x+8),dy=this.target.y-(this.y+8),distance=Math.hypot(dx,dy);
  if(distance){const step=Math.min(this.speed,distance);this.x+=dx/distance*step;this.y+=dy/distance*step;}
  const p=this.stage.player;
  if(this.x<p.px+p.pw&&this.x+16>p.px&&this.y<p.py&&this.y+16>p.py-p.ph){
   if(this.stage.stock?.purify>0){this.stage.stock.purify--;this.defeated=true;this.deathFrame=0;}
   else this.stage.dead();
  }
 }
 tickDeath(){if(this.defeated)this.deathFrame=Math.min(GHOST_DEFEAT_FRAMES,this.deathFrame+1);}
}
export function drawGhost(ctx,ghost,t=0,design=0){
 if(!ghost.defeated&&!ghost.variant){drawGhostSprite(ctx,ghost,t,design);return;}
 const progress=ghost.defeated?ghost.deathFrame/GHOST_DEFEAT_FRAMES:0;if(progress>=1)return;
 if(!ghost.deathCanvas){ghost.deathCanvas=document.createElement('canvas');ghost.deathCanvas.width=ghost.deathCanvas.height=32;}
 const surface=ghost.deathCanvas,c=surface.getContext('2d');c.clearRect(0,0,32,32);c.save();c.translate(8,8);drawGhostSprite(c,{x:0,y:0},t,design);c.restore();
 c.save();c.globalCompositeOperation='source-atop';c.globalAlpha=ghost.defeated?.75:.6;c.fillStyle='#ef3038';c.fillRect(0,0,32,32);c.restore();
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha*=1-progress;ctx.drawImage(surface,Math.round(ghost.x)-8,Math.round(ghost.y)-8);ctx.restore();
}
function drawGhostSprite(ctx,ghost,t=0,design=0){
 ctx.save();ctx.translate(Math.round(ghost.x),Math.round(ghost.y));
 const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
 ctx.globalAlpha=.85;
 if(design>=3){
  const wave=Math.floor(t/7)%2;
  if(design===3){
   // A faceless shroud, shaded like the subdued original block graphics.
   rect(5,0,6,1,'#96999d');rect(3,1,10,2,'#96999d');rect(2,3,12,10,'#96999d');
   rect(4,2,8,1,'#d9dad6');rect(3,3,9,9,'#c0c2bf');rect(5,2,4,10,'#d9dad6');rect(11,4,2,8,'#a6a9a8');
   rect(4,7,1,5,'#a6a9a8');rect(9,8,1,4,'#a6a9a8');
   for(let i=0;i<4;i++)rect(2+i*3,12,2,2+(wave+i)%2,'#b5b9b7');
  }else if(design===4){
   // A tapered translucent spirit, with an uneven drifting tail.
   rect(6,0,4,1,'#858d91');rect(4,1,8,2,'#858d91');rect(3,3,10,6,'#858d91');rect(4,9,8,2,'#858d91');rect(6,11,5,2,'#858d91');
   rect(5,2,6,1,'#c3ccc7');rect(4,3,7,5,'#a7b5b0');rect(6,2,3,7,'#c3ccc7');rect(5,8,5,3,'#9faba9');rect(7,11,3,2,'#9faba9');
   rect(8,13,2,1,'#858d91');rect(8+wave,14,2,1,'#858d91');rect(9+wave,15,1,1,'#858d91');
  }else{
   // A dim silhouette; no face or colored accent competes with the stage.
   rect(5,0,6,1,'#2b2c30');rect(3,1,10,2,'#2b2c30');rect(2,3,12,9,'#2b2c30');
   rect(4,2,7,1,'#5d5e61');rect(3,3,9,8,'#414247');rect(5,3,5,7,'#525357');rect(3,8,1,3,'#33343a');rect(11,6,1,5,'#33343a');
   for(let i=0;i<3;i++)rect(2+i*5,12,3,2+(wave+i)%2,'#33343a');
  }
  ctx.restore();if(design===3)drawCurse(ctx,{px:ghost.x,py:ghost.y+16,pw:16,ph:16},t);return;
 }

 if(design===1){
  // A dark hood keeps a bright face readable against the stage background.
  rect(5,0,6,1,'#302b41');rect(3,1,10,2,'#302b41');rect(2,3,12,10,'#302b41');rect(1,6,14,6,'#302b41');
  rect(4,2,8,2,'#716a85');rect(3,4,10,8,'#716a85');rect(5,3,6,1,'#a09aaa');rect(4,5,8,6,'#d5d1d7');
  rect(5,5,2,3,'#471d31');rect(9,5,2,3,'#471d31');rect(5,6,2,1,'#fa6579');rect(9,6,2,1,'#fa6579');rect(7,9,2,2,'#4f435c');
  for(let i=0;i<3;i++){const x=2+i*5,drop=(Math.floor(t/6)+i)%2;rect(x,12,3,2+drop,'#514860');}
  ctx.restore();return;
 }
 if(design===2){
  // Narrow tapering tail, with a soft cyan outline and an ivory face.
  rect(5,0,6,1,'#79a9b4');rect(3,1,10,2,'#79a9b4');rect(2,3,12,7,'#79a9b4');rect(3,10,10,2,'#79a9b4');rect(5,12,6,1,'#79a9b4');
  rect(4,2,8,1,'#f0f3db');rect(3,3,9,6,'#e4ecdf');rect(4,9,7,2,'#c7dcda');rect(6,11,4,2,'#b1d1d3');
  const tail=Math.floor(t/7)%2;rect(7,13,3,1,'#99c2cb');rect(8+tail,14,2,1,'#79a9b4');rect(9+tail,15,1,1,'#79a9b4');
  rect(4,4,3,4,'#244451');rect(9,4,3,4,'#244451');rect(5,4,1,1,'#dae8e2');rect(10,4,1,1,'#dae8e2');rect(7,9,2,2,'#47747e');
  ctx.restore();return;
 }
 rect(4,0,8,1,'#b7bed2');rect(2,1,12,2,'#b7bed2');rect(1,3,14,11,'#b7bed2');rect(2,2,11,11,'#e2e6ed');rect(4,1,7,12,'#f3f5f5');
 for(let i=0;i<4;i++){const x=1+i*4,drop=(Math.floor(t/6)+i)%2;rect(x,13,3,2+drop,'#cdd4e1');}
 rect(4,5,3,4,'#252533');rect(10,5,3,4,'#252533');rect(5,5,1,1,'#b0bcdd');rect(11,5,1,1,'#b0bcdd');rect(7,10,3,2,'#55536b');ctx.restore();
}
