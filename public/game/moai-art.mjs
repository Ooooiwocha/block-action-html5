// A native 16 x 16 pixel sprite: heavy brow, long nose and square jaw.
// Same pixel count as the original blocks; no smoothing or vector gradients.
const sprites=new Map();
function sprite(gold,awake){
 const key=gold+':'+awake;if(sprites.has(key))return sprites.get(key);
 const image=document.createElement('canvas');image.width=image.height=16;
 const c=image.getContext('2d');
 const p=gold?['#3d3017','#715321','#a27d32','#c6a44d','#e3cb78','#f8e5a5']:['#292d30','#4a5156','#70787b','#979fa0','#b7bebc','#d4d9d4'];
 const r=(i,x,y,w,h)=>{c.fillStyle=p[i];c.fillRect(x,y,w,h);};
 // Fill the whole tile with a square stone/metal face and a bevelled rim.
 r(0,0,0,16,16);r(2,1,1,14,14);
 r(4,1,1,14,1);r(3,1,2,1,12);r(1,14,2,1,13);r(1,2,14,12,1);
 r(3,2,2,12,2);r(4,3,2,9,1);
 r(1,2,4,4,5);r(1,10,4,4,5);
 r(4,2,3,4,1);r(4,10,3,4,1);
 r(3,7,5,3,7);r(4,7,5,1,5);r(1,10,8,1,4);
 r(4,6,10,3,2);r(2,9,10,1,2);r(0,6,12,5,1);
 r(3,2,13,12,1);r(4,3,13,8,1);
 if(awake){
  // Literal white sclera and black pupils, shared by both material variants.
  for(const x of [2,10]){
   c.fillStyle='#000000';c.fillRect(x-1,4,6,6);
   c.fillStyle='#ffffff';c.fillRect(x,5,4,4);
   c.fillStyle='#000000';c.fillRect(x+1,6,2,2);
  }
  r(0,7,12,3,2);r(1,8,13,1,1);
 }else{
  // Bright eyelids frame the one-pixel closed-eye line.
  for(const x of [2,10]){r(3,x,5,4,1);r(3,x,7,4,1);c.fillStyle=gold?'#241b0d':'#141719';c.fillRect(x,6,4,1);}
 }
 sprites.set(key,image);return image;
}
export function drawMoai(ctx,x,y,gold=false,awake=false,size=16){
 if(size<=0)return;
 ctx.save();ctx.imageSmoothingEnabled=false;
 const offset=Math.round((16-size)/2);
 ctx.drawImage(sprite(gold,awake),Math.round(x)+offset,Math.round(y)-16+offset,size,size);
 ctx.restore();
}
