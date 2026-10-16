export const DARK_RADIUS=56;
export const DARK_PERIOD=1000;
export const DARK_FEATHER=2;
export function darkRadius(timeMs){return DARK_RADIUS+2*Math.sin(2*Math.PI*timeMs/DARK_PERIOD);}
export function darkLights(stage){
 const lights=stage.blocks.filter(b=>b.typeNo===6||b.typeNo===7).map(b=>({x:b.ox+8,y:b.oy-8}));
 const p=stage.player;lights.push({x:p.px+(p.pw||8)/2,y:p.py-(p.ph||16)/2});return lights;
}
let mask,maskCtx;
export function drawDarkChamber(ctx,stage,timeMs=performance.now()){
 if(!mask){mask=document.createElement('canvas');mask.width=480;mask.height=448;maskCtx=mask.getContext('2d');}
 maskCtx.globalCompositeOperation='source-over';maskCtx.clearRect(0,0,480,448);maskCtx.fillStyle='#000';maskCtx.fillRect(0,0,480,448);
 maskCtx.globalCompositeOperation='destination-out';
 const radius=darkRadius(timeMs);
 for(const {x,y} of darkLights(stage)){
  const gradient=maskCtx.createRadialGradient(x,y,radius-DARK_FEATHER,x,y,radius);
  gradient.addColorStop(0,'rgba(0,0,0,1)');gradient.addColorStop(1,'rgba(0,0,0,0)');
  maskCtx.fillStyle=gradient;maskCtx.beginPath();maskCtx.arc(x,y,radius,0,Math.PI*2);maskCtx.fill();
 }
 maskCtx.globalCompositeOperation='source-over';ctx.drawImage(mask,0,0);
}
