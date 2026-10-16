import assert from 'node:assert/strict';
import {Stage} from './public/game/engine.mjs';
import {updatePassageBlock} from './public/game/traversal-blocks.mjs';
const pos=(px,py)=>({px,py,pw:8,ph:16});
const outside={left:pos(70,176),right:pos(98,176),top:pos(84,158),bottom:pos(84,194)},middle=pos(84,176);
for(const type of [31,102])for(const [entry,a] of Object.entries(outside))for(const [exit,z] of Object.entries(outside)){
 const cells=Array(840).fill(-1);cells[5*28+10]=type;
 const s=new Stage(cells),b=s.cell(5,10);
 updatePassageBlock(b,a,middle);assert.equal(b.solid,false,'occupant cannot be trapped');
 updatePassageBlock(b,middle,z);assert.equal(b.solid,entry!==exit);
 assert.equal(b.wall,b.solid);assert.equal(b.object_wall,b.solid);
 if(b.solid){const p=s.player;p.pw=8;p.ph=16;p.px=70;p.py=176;p.dy=0;p.dx=3;p.rightWall(5,10);assert.equal(p.kickableDir,type===102?0:-1,'metal shutter disables wall kicks');}
 s.reset();assert.equal(b.solid,false);assert.equal(b.wall,false);
}
console.log('PASS: both shutter types preserve all entry/exit cases, reset, and correct wall-kick rules.');
