const sprites=new WeakMap();
export function drawCrackedBlock(ctx,brownFrame,x,y){
 let sprite=sprites.get(brownFrame);
 if(!sprite){
  sprite=document.createElement('canvas');sprite.width=sprite.height=16;
  const c=sprite.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(brownFrame,0,0,16,16);
  // Dark, branching cracks with a bright broken edge; original rim stays intact.
  const crack=[[7,2],[7,3],[8,4],[7,5],[6,6],[7,7],[7,8],[8,9],[8,10],[7,11],[6,12],[6,13],[8,7],[9,7],[10,6],[11,6],[6,10],[5,10],[4,11]];
  c.fillStyle='#17120d';for(const [px,py] of crack)c.fillRect(px,py,2,1);
  for(const [px,py] of [[9,3],[10,2],[11,2],[4,5],[3,4],[3,3],[10,10],[11,11],[12,11]])c.fillRect(px,py,1,1);
  c.fillStyle='#c5a458';for(const [px,py] of [[6,3],[7,4],[6,5],[5,6],[6,8],[7,9],[7,10],[6,11],[5,12],[9,6],[10,5],[4,10]])c.fillRect(px,py,1,1);
  sprites.set(brownFrame,sprite);
 }
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,x,y-16);ctx.restore();
}
