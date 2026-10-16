import assert from 'node:assert/strict';
import {Stage,Key} from './public/game/engine.mjs';
function platform(type,gravity){
 const c=Array(840).fill(-1);for(let x=1;x<29;x++)c[x*28+13]=type;
 c[4*28+(gravity>0?12:14)]=6;
 const s=new Stage(c);s.start();s.gravity=gravity;s.player.fg=Math.sign(gravity);return s;
}
const inputs=[[],[],[39],[39],[37],[37],[39,17],[39,17],[39],[37,17],[37,17],[],[32],[32],[],[],[39],[39],[39]];
for(const type of [101,103])for(const gravity of [8,-8]){
 const ordinary=platform(1,gravity),elevators=platform(type,gravity);
 for(const keys of inputs){Key.held=new Set(keys);ordinary.step();elevators.step();const a=ordinary.player,b=elevators.player;
  assert.deepEqual([b.px,b.py,b.dx,b.dy,b.landed,b.jumpable,b.runMode,b.action.frame,b.action.animation],[a.px,a.py,a.dx,a.dy,a.landed,a.jumpable,a.runMode,a.action.frame,a.action.animation],'exterior walking, running, jumping and animation match ordinary blocks');
 }
}
for(const type of [101,103])for(const gravity of [8,-8]){
 const c=Array(840).fill(-1);c[5*28+10]=type;const s=new Stage(c);s.start();s.gravity=gravity;
 const p=s.player;p.px=81;p.prev_dir_keyX=1;p.py=176;p.pw=8;p.ph=16;p.fg=Math.sign(gravity);p.elevatorRideBlock=s.cell(5,10);
 for(const [keys,dx] of [[[39,17],6],[[39],3],[[39,17],6]]){
  Key.held=new Set(keys);s.step();assert.equal(p.dx,dx,'dash can be switched off and on again inside');assert.equal(p.landed,true);assert.equal(p.py,176);
 }
}
Key.held.clear();console.log('PASS: surface walking/dash/jump positions and animation match ordinary blocks in both gravities; interior dash can repeatedly toggle.');
