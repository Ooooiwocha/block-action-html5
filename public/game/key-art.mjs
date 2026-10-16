// The same 16px grid as the original blocks; y is the bottom edge.
export function drawKey(ctx,x,y,frame=0){
 ctx.save();ctx.translate(x,y-16);
 const rows=['................','.....####.......','....#HHHH#......','...#HY..YY#.....','...#HY..YY#.....','...#HYYYYY#.....','....#YYYY#......','.....#HY#.......','.....#HY#.......','.....#HYY###....','.....#HYYYY#....','.....#HY####....','.....#HYYY#.....','......####......','................','................'];
 const colors={'#':'#493312',H:'#fff6be',Y:'#eebd35'};
 const t=((frame%60)+60)%60;
 rows.forEach((row,py)=>[...row].forEach((v,px)=>{if(colors[v]){
  // A narrow moving reflection across the gold, leaving the dark outline intact.
  ctx.fillStyle=v==='Y'?(px+py===Math.floor(t/3)?'#fffbe0':px>7?'#b58119':colors.Y):colors[v];ctx.fillRect(px,py,1,1);
 }}));
 // Small pixel crosses blink in sequence, like the ranking crown's sparkle.
 const sparks=[[10,2,0],[4,7,20],[10,12,40]];
 for(const [sx,sy,offset] of sparks){const phase=(t+offset)%60;if(phase>=10)continue;
  ctx.fillStyle='#fffce4';ctx.fillRect(sx,sy,1,1);
  if(phase>=3&&phase<7){ctx.fillStyle='#ffe482';ctx.fillRect(sx-1,sy,1,1);ctx.fillRect(sx+1,sy,1,1);ctx.fillRect(sx,sy-1,1,1);ctx.fillRect(sx,sy+1,1,1);}
 }
 ctx.restore();
}
export const UNLOCK_FRAMES=12;
export function drawLockedBlock(ctx,brown,x,y,unlockProgress=0){
 const progress=Math.max(0,Math.min(1,unlockProgress));
 if(progress>=1)return;
 ctx.save();
 if(progress>0){ctx.translate(x+8,y-8);ctx.rotate(progress*Math.PI*2);ctx.scale(1-progress,1-progress);ctx.translate(-x-8,-y+8);}
 ctx.imageSmoothingEnabled=false;ctx.drawImage(brown,x,y-16,16,16);ctx.translate(x,y-16);
 ctx.fillStyle='#bc9752';ctx.fillRect(5,3,6,6);ctx.fillRect(6,8,4,5);
 ctx.fillStyle='#22190e';ctx.fillRect(6,4,4,4);ctx.fillRect(7,8,2,2);ctx.fillRect(6,10,4,2);
 ctx.restore();
}
