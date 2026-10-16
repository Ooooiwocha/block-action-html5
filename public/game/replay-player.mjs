export class ReplayPlayback {
 constructor(frames){this.frames=frames;this.index=0;}
 tick(flow){
  if(flow.phase!=='playing'){flow.tick();return;}
  const frame=this.frames[this.index++];
  if(frame)flow.stage.step(frame);
  if(this.index>=this.frames.length){flow.stage.run=false;flow.stage.status='clear';flow.phase='clearing';flow.frame=1;}
 }
}
