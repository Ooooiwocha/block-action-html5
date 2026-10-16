const pixels=Array.from({length:16},()=>Array(16).fill(null));
for(let j=0;j<16;j++)for(let i=0;i<16;i++)if(Math.hypot(i-7.5,j-7.5)<5.4)pixels[j][i]='#bbc1c4';
for(const [x,y,w,h] of [[6,1,4,3],[12,6,3,4],[6,12,4,3],[1,6,3,4],[2,2,3,3],[11,2,3,3],[2,11,3,3],[11,11,3,3]])for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)pixels[j][i]='#bbc1c4';
for(let j=0;j<16;j++)for(let i=0;i<16;i++)if(Math.hypot(i-7.5,j-7.5)<2.7)pixels[j][i]=null;
const colors=pixels.map((row,j)=>row.map((color,i)=>color&&(!pixels[j-1]?.[i]||!pixels[j+1]?.[i]||!row[i-1]||!row[i+1])?'#33383b':color));
export function drawGear(ctx,x,y,frame=0,turnFrames=0){
 const angle=turnFrames>0?(8-turnFrames)/8*Math.PI/2:0,c=Math.cos(angle),s=Math.sin(angle);
 for(let j=0;j<16;j++)for(let i=0;i<16;i++){
  const dx=i-7.5,dy=j-7.5,px=Math.round(c*dx+s*dy+7.5),py=Math.round(-s*dx+c*dy+7.5),color=colors[py]?.[px];
  if(color){ctx.fillStyle=color;ctx.fillRect(x+i,y-16+j,1,1);}
 }
}
