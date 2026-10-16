import assert from 'node:assert/strict';
import {Stage,Key} from './public/game/engine.mjs';
for(const type of [101,103])for(const gravity of [8,-8]){
 const c=Array(840).fill(-1);c[3*28+14]=6;c[4*28+14]=type;
 for(const x of [3,4])c[x*28+(gravity>0?15:13)]=1;
 const s=new Stage(c);s.start();s.gravity=gravity;s.player.fg=Math.sign(gravity);
 Key.held=new Set([39]);for(let i=0;i<6;i++)s.step();
 assert.ok(s.elevatorUnderPlayer(s.player),'side entry works for both gravities');
 const b=s.blocks.find(b=>b.typeNo===type),before=b._y;
 Key.held=new Set([38]);for(let i=0;i<3;i++)s.step();
 const enabled=(type===103)===(gravity<0);
 assert.equal(b._y,before+(enabled?(gravity>0?-6:6):0),'only matching gravity can operate the elevator');
 assert.equal(s.player.action.frame,1);
 Key.held=new Set([40]);for(let i=0;i<3;i++)s.step();assert.equal(b._y,before,'Down returns toward the feet');
 s.gravity=-gravity;const changed=b._y;
 Key.held=new Set([40]);s.step();assert.equal(b._y,changed+(enabled?0:(gravity>0?-2:2)),'gravity switching updates control immediately');
}
// Vertically mirror the original low-ceiling jumping regression.
for(const hazard of [10,11])for(const mirror of [false,true]){
 const c=Array(840).fill(-1),x=n=>mirror?16-n:n,y=n=>27-n;
 for(let i=0;i<30;i++)c[i*28+y(25)]=1;
 for(let i=3;i<=8;i++)c[x(i)*28+y(21)]=1;
 c[x(12)*28+y(23)]=6;c[7*28+y(24)]=1;c[9*28+y(24)]=1;c[8*28+y(24)]=hazard;c[8*28+y(23)]=103;
 const s=new Stage(c);s.start();s.gravity=-8;s.player.fg=-1;
 let direction=mirror?39:37;
 for(let trip=0;trip<100;trip++){
  for(const [keys,n] of [[[direction],20],[[direction,32],40]]){Key.held=new Set(keys);for(let i=0;i<n;i++){s.step();assert.equal(s.status,'playing');assert.equal(s.gravity,-8);}}
  direction=direction===39?37:39;
 }
}
for(const obstacle of [4,9])for(const type of [101,103])for(const delta of [-2,2]){
 const c=Array(840).fill(-1);c[5*28+10]=type;c[5*28+(delta<0?9:11)]=obstacle;
 const s=new Stage(c);s.start();s.gravity=type===103?-8:8;
 const p=s.player,b=s.cell(5,10);p.fg=Math.sign(s.gravity);p.px=84;p.py=176;p.pw=8;p.ph=16;
 assert.equal(s.moveElevator(b,p,delta),false,'stopper or ladder blocks both travel directions');
 assert.equal(b._y,176);assert.equal(p.py,176);assert.equal(s.cell(5,delta<0?9:11).wall,false,'obstacle keeps its original player collision');
 const moving=Array(840).fill(-1);moving[5*28+10]=type;moving[5*28+(delta<0?9:11)]=2;
 const t=new Stage(moving);t.start();t.player.fg=type===103?-1:1;t.player.px=84;t.player.py=176;t.player.pw=8;t.player.ph=16;
 assert.equal(t.moveElevator(t.cell(5,10),t.player,delta),true,'other moving blocks remain passable');
}
for(const type of [101,103]){
 const c=Array(840).fill(-1);c[5*28+10]=type;const s=new Stage(c);s.start();s.gravity=type===103?-8:8;
 const p=s.player,b=s.cell(5,10);p.fg=Math.sign(s.gravity);p.pw=8;p.ph=16;p.py=176;p.px=79;p.elevatorRideBlock=b;
 Key.held=new Set([38]);s.step();assert.equal(b._y,176,'a partially boarded player cannot operate');assert.equal(p.px,79);
 p.px=81;Key.held=new Set([38,39]);s.step();assert.equal(p.px,84,'Up snaps a fully boarded player to the centre');assert.equal(p.dx,0,'horizontal input cannot drift while operating');assert.equal(b._y,176+(type===103?2:-2));
 Key.held=new Set([40]);s.step();assert.equal(b._y,176,'Down remains centred and returns to original height');assert.equal(p.px,84);
}
for(const type of [101,103])for(const gravity of [8,-8]){
 const c=Array(840).fill(-1);c[5*28+10]=type;const s=new Stage(c);s.start();s.gravity=gravity;
 const p=s.player;p.px=84;p.py=gravity>0?160:192;p.fg=Math.sign(gravity);
 Key.held.clear();s.step();assert.equal(p.action.frame,1,'standing on an exterior surface uses the normal pose');assert.equal(p.elevatorRideBlock,null);
 Key.held=new Set([32]);s.step();assert.notEqual(p.action.frame,1,'jumping off still uses the jump pose');
}
for(const type of [101,103])for(const otherType of [101,103])for(const delta of [-2,2]){
 const c=Array(840).fill(-1);c[5*28+10]=type;c[5*28+5]=otherType;
 const s=new Stage(c);s.start();const p=s.player,b=s.cell(5,10),other=s.cell(5,5);
 p.fg=type===103?-1:1;p.px=84;p.py=176;p.pw=8;p.ph=16;
 other._y=delta<0?160:192;
 assert.equal(s.moveElevator(b,p,delta),false,'all normal/inverse elevator pairs collide at their live positions');assert.equal(b._y,176);assert.equal(p.py,176);assert.equal(other._y,delta<0?160:192,'collision never pushes the other elevator');
 assert.equal(s.moveElevator(b,p,-delta),true,'moving away from contact is allowed');
 other._x=96;assert.equal(s.moveElevator(b,p,delta),true,'side-by-side elevators can move independently');
}
Key.held.clear();console.log('PASS: all four gravity/type combinations, gravity changes during riding, and 400 inverted jumping traversals above spikes/reversal.');
