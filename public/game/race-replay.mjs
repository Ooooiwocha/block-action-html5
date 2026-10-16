export const LIMIT=30000;
export class RaceRecording {constructor(){this.frames=[];this.tooLong=false;}capture(stage){if(this.tooLong)return;if(stage.timer>LIMIT||this.frames.length>=LIMIT){this.frames=[];this.tooLong=true;return;}const p=stage.player;this.frames.push([p._x,p._y,p.action.frame,p.action.animation,p.fg,stage.replayInput||0,stage.replayRandom||[]]);}payload(){return this.tooLong?null:this.frames;}}
export class SecretSequence {
 constructor(){this.index=0;this.ending=null;}
 key(code,ctrlHeld=false){
  const prefix=[38,38,40,40,37,39,37,39];
  if(this.index<8){
   if(code===prefix[this.index])this.index++;
   else this.index=code===38?1:0;
   this.ending=null;return false;
  }
  if(this.index===8&&code===9&&ctrlHeld){this.index=0;this.ending=null;return true;}
  if(this.index===8&&(code===66||code===17)){this.ending=code===66?65:9;this.index=9;return false;}
  if(this.index===9&&this.ending===9&&code===17)return false;
  const complete=this.index===9&&code===this.ending;
  this.index=!complete&&code===38?1:0;this.ending=null;
  return complete;
 }
}
