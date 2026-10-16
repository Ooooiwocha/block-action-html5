import assert from 'node:assert/strict';
import {Stage,Key} from './public/game/engine.mjs';
function make(type,mirror=false,elevator=true){
 const c=Array(840).fill(-1),x=n=>mirror?16-n:n;
 for(let i=0;i<30;i++)c[i*28+25]=1;
 for(let i=3;i<=8;i++)c[x(i)*28+21]=1;
 c[x(12)*28+23]=6;c[7*28+24]=1;c[9*28+24]=1;c[8*28+24]=type;
 if(elevator)c[8*28+23]=101;
 const s=new Stage(c);s.start();return s;
}
function tick(s,keys,n,safe=true){Key.held=new Set(keys);for(let i=0;i<n&&s.status==='playing';i++){s.step();if(safe){assert.equal(s.status,'playing','side-jump or reversal must not hit underlying spikes');assert.equal(s.gravity,8,'elevator cannot activate underlying reversal');}}}
for(const type of [10,11])for(const mirror of [false,true]){
 const s=make(type,mirror);let direction=mirror?39:37;
 for(let trip=0;trip<100;trip++){
  tick(s,[direction],20);
  tick(s,[direction,32],40);
  direction=direction===39?37:39;
 }
}
const bare=make(10,false,false);tick(bare,[37],20,false);tick(bare,[37,32],40,false);assert.equal(bare.status,'dead','removing the elevator leaves the original spike lethal');
// At the left boundary, the rightmost sampled pixel still belongs to this tile.
for(const type of [10,11])for(const keys of [[],[37],[39],[37,17],[39,17]]){
 const s=make(type),p=s.player,b=s.blocks.find(b=>b.typeNo===101);
 p.pw=8;p.ph=16;p.px=121;p.py=384;p.elevatorRideBlock=b;
 tick(s,keys,1);
}
Key.held.clear();console.log('PASS: 400 jumping traversals with a low ceiling, both directions, spikes/reversal, boundary stops and dash inputs; unprotected spikes remain lethal.');
