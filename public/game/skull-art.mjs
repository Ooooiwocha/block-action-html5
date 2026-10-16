// Pixel overlays on the original black block; each tile remains 16x16.
const designs=[
 ['...BBBBBB...','..BWWWWWWB..','.BWWWWWWWWB.','.BWRRWWRRWB.','.BWRRWWRRWB.','.BWWWWWWWWB.','..BWWDDWWB..','..BWWDDWWB..','...BWWWWB...','...BWDDWB...','...BWWWWB...','....BBBB....'],
 ['..BBBBBBBB..','..BWWWWWWB..','.BWWWWWWWWB.','.BWRRWWRRWB.','..BRRWWRRB..','..BWWDDWWB..','..BWWWDDWB..','...BWWWWB...','...BWDDWB...','...BWDDWB...','....BWWB....','....BBBB....'],
 ['....BBBB....','...BWWWWB...','..BWWWWWWB..','..BRRWWRRB..','..BRRWWRRB..','..BWWDDWWB..','...BWWWWB...','...BWDWDB...','....BBBB....','..BB....BB..','.B..BBBB..B.','..BB....BB..']
].map(rows=>[rows[0],rows[1],rows[1],...rows.slice(2,10),rows[10],rows[10],rows[11]]);
export function drawSkull(ctx,x,y,black,variant=0,t=0){
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(black,x,y-16,16,16);
 const glow=Math.floor(t/6)%4,colors={B:'#181319',W:variant===1?'#a9aca5':'#d6d2be',D:'#29232a',R:['#c21c32','#e02b3b','#ff4050','#e02b3b'][glow]};
 designs[variant].forEach((r,py)=>[...r].forEach((v,px)=>{if(colors[v]){ctx.fillStyle=colors[v];ctx.fillRect(x+2+px,y-15+py,1,1);}}));
 ctx.fillStyle=['#ff6671','#ff8a8c','#ffb0a4','#ff8a8c'][glow];
 for(const ex of [5,10])ctx.fillRect(x+ex,y-16+5,1,1);
 ctx.restore();
}
export function drawCurse(ctx,p,t){
 ctx.save();const x=Math.round(p.px),top=Math.round(p.py-p.ph),phase=Math.floor(t/3);
 // Original wandering purple wisps only; no translucent filter on the player.
 for(let i=0;i<8;i++){
  const rise=(phase+i*3)%19,side=i%2?-1:1,px=x+(side<0?-3-i%3:p.pw+1+i%3),py=top+18-rise;
  ctx.globalAlpha=.32+(19-rise)/38;ctx.fillStyle=i%3?'#52245f':'#a554a9';ctx.fillRect(px+(phase+i)%2,py,1,3);ctx.fillRect(px,py+2,2,1);
 }
 ctx.restore();
}
