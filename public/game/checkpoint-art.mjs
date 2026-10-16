import {drawMagic} from './checkpoint-magic-art.mjs';
export function drawCheckpoint(ctx,x,y,activated=false,progress=1,frame=0){
 ctx.save();ctx.translate(Math.round(x),Math.round(y)-16);drawMagic(ctx,1,activated,frame);ctx.restore();
}
export function drawSealedGoal(ctx,x,y,frame=0){
 ctx.save();ctx.translate(Math.round(x),Math.round(y)-16);
 for(let arm=0;arm<3;arm++)for(let i=0;i<13;i++){
  const r=1+i*.43,a=frame/16+arm*Math.PI*2/3+i*.22;
  ctx.fillStyle=i%4===0?'#3b3740':i%3===0?'#222027':'#08080c';
  ctx.fillRect(Math.round(7.5+Math.cos(a)*r),Math.round(7.5+Math.sin(a)*r),i<6?2:1,i<6?2:1);
 }
 ctx.fillStyle='#08070c';ctx.fillRect(7,7,2,2);ctx.restore();
}
