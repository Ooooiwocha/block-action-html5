// A 16px sprite: pale wooden handle and folded white shide, viewed diagonally.
export function drawReferencePurify(ctx,x,y,variant=0,darkHandle=false,outline=0){
 ctx.save();ctx.translate(x,y-16);ctx.imageSmoothingEnabled=false;
 const pixel=(x,y,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,1,1);};
 for(let row=5;row<=14;row++){
  const col=15-row;
  pixel(col-1,row,darkHandle?'#282018':'#5e4a2c');pixel(col,row,darkHandle?'#ae7937':'#b29457');pixel(col+1,row,darkHandle?'#282018':'#dbc087');
 }
 // Three overlapping strips; the shaded edge keeps the folds legible on grey.
 const ribbons=variant===0?[
  [[9,0,4],[7,1,5],[6,2,4],[4,3,5],[3,4,4],[2,5,4]],
  [[12,1,2],[11,2,3],[11,3,2],[9,4,4],[8,5,3],[7,6,4],[6,7,3]],
  [[14,2,1],[13,3,2],[13,4,2],[12,5,3],[12,6,2],[10,7,4],[10,8,3],[11,9,2],[11,10,2]]
 ]:[
  [[9,0,4],[8,1,4],[6,2,5],[5,3,4],[3,4,5],[2,5,4]],
  [[12,1,2],[11,2,3],[11,3,3],[10,4,3],[8,5,4],[7,6,4],[6,7,3],[6,8,3]],
  [[14,2,1],[13,3,2],[13,4,2],[12,5,3],[12,6,3],[11,7,3],[10,8,4],[11,9,3],[11,10,3],[12,11,2]]
 ];
 if(outline){
  const mask=new Set();for(const ribbon of ribbons)for(const [col,row,width] of ribbon)for(let k=0;k<width;k++){mask.add((col+k)+','+row);mask.add((col+k)+','+(row+1));}
  for(const point of mask){const [col,row]=point.split(',').map(Number);for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const a=col+dx,b=row+dy;if(a>=0&&a<16&&b>=0&&b<16&&!mask.has(a+','+b))pixel(a,b,outline===1?'#737366':'#494b43');}}
 }
 for(const ribbon of ribbons){for(const [col,row,width] of ribbon){for(let k=0;k<width;k++)pixel(col+k,row+1,outline?'#8e8f80':'#a4a497');}for(const [col,row,width] of ribbon){for(let k=0;k<width;k++)pixel(col+k,row,k===0?'#d0d0bf':'#f5f4e9');}}
 for(const [col,row] of [[9,1],[6,3],[10,5],[13,6],[11,8]])pixel(col,row,'#dddecf');
 ctx.restore();
}
