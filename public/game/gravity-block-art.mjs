// Pixel sprites use the same 16x16 grid as the original block bitmaps.
const sprites=new WeakMap();
function sprite(lightFrame,dir){
 let variants=sprites.get(lightFrame);if(!variants){variants=new Map();sprites.set(lightFrame,variants);}
 const facing=dir<0?-1:1;if(variants.has(facing))return variants.get(facing);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=16;
 const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const dot=(color,x,y,w=1,h=1)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 dot('#3c3c3c',0,1,16,14);dot('#3c3c3c',1,0,14,16);
 // Discrete vertical bands suggest a cylinder viewed directly from its side.
 for(const [x,w,color] of [[1,1,'#555555'],[2,1,'#777777'],[3,2,'#aaaaaa'],[5,2,'#cccccc'],[7,2,'#dddddd'],[9,2,'#bbbbbb'],[11,2,'#999999'],[13,1,'#777777'],[14,1,'#555555']])dot(color,x,1,w,14);
 dot('#aaaaaa',2,1,12);dot('#656565',1,3,14);dot('#656565',1,12,14);dot('#cccccc',2,14,12);
 // The insert is a stepped triangle; its light is sampled from the original animation.
 const row=y=>facing<0?15-y:y;
 for(const [x,y,w] of [[3,5,10],[3,6,10],[4,7,8],[5,8,6],[6,9,4],[7,10,2]])dot('#3c3c3c',x,row(y),w);
 for(const [x,y,w] of [[4,6,8],[5,7,6],[6,8,4],[7,9,2]])c.drawImage(lightFrame,5,6,1,1,x,row(y),w,1);
 variants.set(facing,canvas);return canvas;
}
export function drawGravityBlock(ctx,lightFrame,x,y,dir=1){
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite(lightFrame,dir),x,y-16);ctx.restore();
}
