// The block is 16px; only the skull is drawn on a 32px grid (0.5px per dot).
const cache=new Map();
function sprite(variant,t,open){
 const phase=Math.floor(t/7)%4,key=variant+':'+phase+':'+Number(open);if(cache.has(key))return cache.get(key);
 const image=document.createElement('canvas');image.width=image.height=32;const c=image.getContext('2d');
 const ink='#17131a',bone=variant===1?'#b6b8b0':'#d8d2bb',shade='#8e8d84',light='#f0e9d4';
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const ellipse=(cx,cy,rx,ry,color)=>{c.fillStyle=color;for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)c.fillRect(x,y,1,1);};
 const polygon=(pts,color)=>{c.fillStyle=color;for(let y=0;y<32;y++)for(let x=0;x<32;x++){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const [xi,yi]=pts[i],[xj,yj]=pts[j];if((yi>y+.5)!==(yj>y+.5)&&x+.5<(xj-xi)*(y+.5-yi)/(yj-yi)+xi)inside=!inside;}if(inside)c.fillRect(x,y,1,1);}};
 if(variant===2){
  // Crossed bones sit behind the cheekbones, within the original dark rim.
  for(const [a,b] of [[[7,20],[25,27]],[[25,20],[7,27]]]){
   const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len*1.5,ny=dx/len*1.5;
   polygon([[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],bone);
   for(const q of [a,b]){ellipse(q[0]-1,q[1],2,2,bone);ellipse(q[0]+1,q[1],2,2,bone);}
  }
 }
 const cy=variant===2?12:13,rx=variant===1?9:10,ry=variant===2?9:10;
 ellipse(16,cy,rx+1,ry+1,ink);ellipse(16,cy,rx,ry,bone);
 const jawY=variant===2?19:22,jawBottom=variant===2?25:29;
 polygon([[9,jawY-4],[23,jawY-4],[22,jawY+1],[21,jawBottom],[11,jawBottom],[10,jawY+1]],ink);
 polygon([[10,jawY-4],[22,jawY-4],[21,jawY+1],[20,jawBottom-1],[12,jawBottom-1],[11,jawY+1]],bone);
 rect(9,cy-5,2,5,light);rect(11,cy-7,8,1,light);rect(23,cy-2,2,6,shade);
 // Large dark eye sockets establish a skull; small luminous pupils stay red.
 for(const ex of [11,21]){
  if(variant===1){polygon([[ex-4,cy-2],[ex+3,cy],[ex+2,cy+4],[ex-3,cy+3]],ink);}else ellipse(ex,cy+1,3.5,3.5,ink);
  const red=['#bf1630','#df2139','#fa3650','#df2139'][phase];ellipse(ex,cy+1,2,2,'#6c1428');rect(ex-1,cy,2,2,red);rect(ex,cy,1,1,['#ff7380','#ffa19f','#ffe0bd','#ffa19f'][phase]);
 }
 polygon([[16,cy+4],[13,cy+8],[15,cy+9],[16,cy+7],[17,cy+9],[19,cy+8]],ink);
 // Hollow cheeks, separate upper teeth, mouth gap and lower jaw.
 polygon([[7,cy+5],[11,cy+6],[12,cy+9],[8,cy+8]],ink);polygon([[25,cy+5],[21,cy+6],[20,cy+9],[24,cy+8]],ink);
 rect(12,jawBottom-5,8,1,ink);rect(12,jawBottom-2,8,1,shade);
 for(const x of [13,16,19])rect(x,jawBottom-7,1,4,ink);
 if(variant===1){polygon([[16,4],[15,7],[17,8],[16,10]],shade);}
 if(open){
  // Two high-resolution dots equal one original game pixel. Move only the lower jaw.
  const cut=jawBottom-4,lower=document.createElement('canvas');lower.width=32;lower.height=32;
  lower.getContext('2d').drawImage(image,0,cut,32,32-cut,0,cut,32,32-cut);
  c.clearRect(0,cut,32,32-cut);rect(12,cut,8,2,ink);
  c.drawImage(lower,0,2);
 }
 cache.set(key,image);return image;
}
export function drawHiSkull(ctx,x,y,black,variant=0,t=0,open=false){
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(black,x,y-16,16,16);ctx.drawImage(sprite(variant,t,open),x,y-16,16,16);ctx.restore();
}
