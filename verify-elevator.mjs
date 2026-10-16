import assert from 'node:assert/strict';
import { Stage, Key } from './public/game/engine.mjs';
import { hitUI } from './public/game/ui-hit.mjs';

function elevatorStage() {
  const cells = Array(840).fill(-1);
  for (let x = 0; x < 30; x++) cells[x * 28 + 27] = 1;
  cells[3 * 28 + 26] = 6;
  cells[4 * 28 + 26] = 101;
  const stage = new Stage(cells);
  stage.start();
  return stage;
}

const paletteLayout = { 101: { x: 85, y: 184 } };
assert.equal(hitUI({ x: 85, y: 184 }, { editor: true, palettePage: 1, paletteLayout }), 'palette');
assert.equal(hitUI({ x: 17, y: 72 }, { editor: true, palettePage: 4, paletteLayout: {} }), 'mode-normal');

const stage = elevatorStage();
const player = stage.player;
const elevator = stage.blocks.find((block) => block.typeNo === 101);
for (let i = 0; i < 6; i++) {
  Key.held = new Set([39]);
  stage.step();
}
assert.ok(stage.elevatorUnderPlayer(player), 'the player can enter from the side');
Key.held = new Set([38]);
for (let i = 0; i < 12; i++) stage.step();
assert.equal(elevator._y, 408, 'Up moves the elevator by two pixels per loop');
assert.equal(player.py, 408, 'the player rides together with the elevator');
assert.equal(player.action.frame,1,'riding uses the normal standing pose');

const topStage = elevatorStage();
const topPlayer = topStage.player;
const topElevator = topStage.blocks.find((block) => block.typeNo === 101);
topPlayer.px = 68;
topPlayer.py = 416;
assert.equal(topStage.elevatorUnderPlayer(topPlayer), null, 'standing on top is not inside');
Key.held = new Set([38]);
topStage.step();
assert.equal(topElevator._y, 432, 'Up does not activate the elevator from above');
for(let i=0;i<12;i++)topStage.step();
assert.equal(topPlayer.py,416,'the roof supports the player without boarding');
assert.equal(topPlayer.action.frame,1,'standing on the roof uses the normal pose');
const bottomStage = elevatorStage();
const bottomPlayer = bottomStage.player;
bottomPlayer.px = 68;bottomPlayer.py = 432;bottomPlayer.pw = 8;bottomPlayer.ph = 16;
bottomStage.boardElevator({px:68,py:444},bottomPlayer);
assert.equal(bottomPlayer.elevatorRideBlock,null,'rising from below never boards the basket');
const diagonalStage = elevatorStage();
diagonalStage.player.px=68;diagonalStage.player.py=440;diagonalStage.player.pw=8;diagonalStage.player.ph=16;
diagonalStage.boardElevator({px:60,py:448},diagonalStage.player);
assert.equal(diagonalStage.player.elevatorRideBlock,null,'partial contact from below is not side entry');
assert.equal(hitUI({x:100,y:40},{editor:true,paletteLayout:{}}),'palette-next');
stage.reset();assert.equal(stage.player.elevatorRideBlock,null,'reset clears the rider');
const jumpCells=Array(840).fill(-1);
for(let x=0;x<30;x++)jumpCells[x*28+27]=1;
jumpCells[4*28+26]=6;jumpCells[4*28+23]=101;
const jumpStage=new Stage(jumpCells);jumpStage.start();Key.held.clear();jumpStage.step();
Key.held=new Set([32]);let highest=432;
for(let i=0;i<30;i++){jumpStage.step();highest=Math.min(highest,jumpStage.player.py);}
assert.equal(highest,400,'jumping from below hits the bottom at y=384');
assert.equal(jumpStage.player.elevatorRideBlock,null,'head collision never boards the elevator');
assert.equal(jumpStage.blocks.find(b=>b.typeNo===101)._y,384,'head impact does not move the elevator');
// Reproduce side entry with a hazard directly below the elevator.
for(const type of [11,10])for(const direction of [-1,1])for(const withElevator of [false,true]){
 const cells=Array(840).fill(-1);
 const start=direction===1?4:6;
 cells[start*28+24]=6;cells[4*28+25]=1;cells[6*28+25]=1;cells[5*28+25]=type;
 if(withElevator)cells[5*28+24]=101;
 const s=new Stage(cells);s.start();
 Key.held=new Set([direction===1?39:37]);
 for(let i=0;i<12&&s.status==='playing';i++)s.step();
 if(withElevator){assert.equal(s.status,'playing','entering and crossing must not hit spikes');assert.equal(s.gravity,8,'crossing must not activate the reversal below');assert.equal(s.player.py,400,'the elevator floor catches the player before gravity');}
 else if(type===10)assert.equal(s.status,'dead','unshielded spikes retain their lethal behavior');
 else assert.equal(s.gravity,-8,'unshielded reversal block retains its behavior');
}
// Riding up and returning onto a hazard must also be supported by the elevator.
for(const type of [11,10]){
 const c=Array(840).fill(-1);c[4*28+24]=6;c[4*28+25]=1;c[5*28+24]=101;c[5*28+25]=type;
 const s=new Stage(c);s.start();Key.held=new Set([39]);for(let i=0;i<6;i++)s.step();
 assert.ok(s.elevatorUnderPlayer(s.player));
 Key.held=new Set([38]);for(let i=0;i<5;i++)s.step();
 Key.held=new Set([40]);for(let i=0;i<12;i++)s.step();
 assert.equal(s.player.py,400);assert.equal(s.gravity,8);assert.equal(s.status,'playing');
}
Key.held.clear();
const ladderStage=elevatorStage();ladderStage.player.climbing=true;ladderStage.player.dy=0;ladderStage.player.setCharaAction(ladderStage.player.action);assert.equal(ladderStage.player.action.frame,7,'the actual ladder resting pose is preserved');
ladderStage.player.dy=-2;ladderStage.player.setCharaAction(ladderStage.player.action);assert.equal(ladderStage.player.action.frame,6,'the actual climbing pose is preserved');

console.log('PASS: palette placement, side entry, paired vertical travel, and top-side input separation.');
