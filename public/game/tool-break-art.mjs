export const TOOL_BREAK_FRAMES=12;
// Four pieces of the original sprite: short, deterministic, pixel-sized burst.
export function drawToolBreak(ctx,image,x,y,age,ice=false,gravity=1){
 if(age>=TOOL_BREAK_FRAMES)return;
 ctx.save();ctx.imageSmoothingEnabled=false;
 // Mirror the entire burst around the block center using gravity at impact.
 if(gravity<0){ctx.translate(0,2*(y-8));ctx.scale(1,-1);}
 const fade=Math.max(0,1-Math.max(0,age-4)/8),size=8*Math.max(.35,1-age/20);
 ctx.globalAlpha*=fade;
 for(let row=0;row<2;row++)for(let col=0;col<2;col++){
  const dx=(col?1:-1)*age*.8,dy=-age*(row?.45:1.05)+age*age*.09;
  ctx.drawImage(image,col*8,row*8,8,8,x+col*8+dx+(8-size)/2,y-16+row*8+dy+(8-size)/2,size,size);
 }
 // Brief flecks add impact without a full-screen flash or smoke.
 ctx.fillStyle=ice?'#d9f6ff':'#d5ae65';
 for(let i=0;i<4;i++){const dx=(i<2?-1:1)*(4+age*1.15),dy=(i%2?-1:1)*(3+age*.55);ctx.fillRect(Math.round(x+8+dx),Math.round(y-8+dy),1,1);}
 if(age<2){ctx.fillStyle=ice?'#ffffff':'#ffe3a1';ctx.fillRect(x+7,y-10,2,4);ctx.fillRect(x+6,y-9,4,2);}
 ctx.restore();
}
