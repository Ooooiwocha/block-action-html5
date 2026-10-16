const frames=new Map();
export function drawWarp(ctx,x,y,exit=false,t=0,thickness=2){
 const tick=((Math.floor(t)%60)+60)%60,frame=exit?59-tick:tick;
 const cacheKey=frame+':'+thickness;
 let image=frames.get(cacheKey);
 if(!image){
  image=document.createElement('canvas');image.width=image.height=16;
  const c=image.getContext('2d'),colors=['#ffdf00','#00cedf'];
  // Two staggered circular waves contract into the centre. The outlet uses
  // these exact pixel frames in reverse, so its waves expand from the centre.
  for(let wave=0;wave<2;wave++){
   const phase=(frame+wave*15)%30,r=7.5*(1-phase/30);
   c.fillStyle=colors[wave];
   for(let py=0;py<16;py++)for(let px=0;px<16;px++){
    const distance=Math.hypot(px-7.5,py-7.5);
    if(distance<=r&&distance>r-thickness)c.fillRect(px,py,1,1);
   }
  }
  c.fillStyle=colors[Math.floor(frame/15)%2];c.fillRect(7,7,2,2);
  frames.set(cacheKey,image);
 }
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x,y-16);ctx.restore();
}
