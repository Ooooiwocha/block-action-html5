// Solid tatami is separate from the hollow green/red frame blocks.
export function drawSolidTatami(ctx,x,y){
 ctx.save();ctx.translate(x,y-16);ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#71603a';ctx.fillRect(0,0,16,16);
 ctx.fillStyle='#ad9956';ctx.fillRect(1,3,14,10);
 for(let row=3;row<13;row++)for(let col=1;col<15;col++){
  ctx.fillStyle=(col%4===0)?'#847442':(row+col)%3===0?'#c0aa66':'#a08d4f';ctx.fillRect(col,row,1,1);
 }
 for(const top of [0,13]){
  ctx.fillStyle='#286300';ctx.fillRect(0,top,16,3);
  ctx.fillStyle='#38751b';ctx.fillRect(1,top,14,1);
  ctx.fillStyle='#143400';ctx.fillRect(0,top+2,16,1);
 }
 ctx.restore();
}
