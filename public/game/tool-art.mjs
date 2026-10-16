// 16×16 integer-pixel tools, using the existing blocks' dark outlines and metal.
export function drawTool(ctx,x,y,type){
 ctx.save();ctx.translate(x,y-16);
 const pixel=(color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
 if(type===34){
  // Broad metal head, short wooden grip and a long downward steel needle.
  pixel('#242627',5,1,8,4);pixel('#242627',3,3,3,2);pixel('#242627',2,4,2,2);
  pixel('#e2e3d9',6,2,6,1);pixel('#999e9f',5,3,7,1);pixel('#b9bdb9',4,4,2,1);
  pixel('#30261c',6,5,5,5);pixel('#82502c',7,5,3,5);
  pixel('#be8b50',7,5,1,4);pixel('#a26d38',8,6,1,3);
  pixel('#242627',6,10,5,2);pixel('#d7ddd9',7,10,3,1);
  pixel('#242627',7,12,3,2);pixel('#c4d5d7',8,11,1,3);
  pixel('#242627',8,14,1,2);
 }else{
  pixel('#292a23',7,5,3,10);pixel('#885622',8,6,1,8);
  pixel('#c8994f',8,7,1,5);pixel('#d3b176',8,13,1,1);
  // Keep the highlight inside a continuous dark upper and lower silhouette.
  pixel('#202322',4,1,8,1);pixel('#202322',2,2,12,3);
  pixel('#202322',1,4,3,3);pixel('#202322',12,4,3,3);
  pixel('#d9dcd1',4,2,8,1);pixel('#929e9e',3,3,10,1);
  pixel('#9aabaa',2,4,2,1);pixel('#9aabaa',12,4,2,1);
  pixel('#727974',7,4,3,2);
 }
 ctx.restore();
}
