export const EXPLORATION_RADIUS=56;
export function playerCenter(p){return {x:p.px+(p.pw||8)/2,y:p.py-(p.ph||16)/2};}
export class Exploration {
 constructor(x,y,timed=false){this.timed=timed;this.elapsed=0;this.width=480;this.height=448;this.distance=0;this.last={x,y};this.seen=new Float64Array(this.width*this.height);this.seen.fill(-Infinity);this.reveal(x,y);}
 reveal(x,y){
  const r=EXPLORATION_RADIUS;
  for(let py=Math.max(0,Math.ceil(y-r));py<Math.min(this.height,Math.floor(y+r)+1);py++){
   const span=Math.sqrt(Math.max(0,r*r-(py-y)**2));
   for(let px=Math.max(0,Math.ceil(x-span));px<Math.min(this.width,Math.floor(x+span)+1);px++)this.seen[py*this.width+px]=this.timed?this.elapsed:this.distance;
  }
 }
 move(x,y,deltaMs=1000/33){this.elapsed+=deltaMs;this.distance+=Math.hypot(x-this.last.x,y-this.last.y);this.last={x,y};this.reveal(x,y);}
 opacity(index){const age=(this.timed?this.elapsed:this.distance)-this.seen[index];return Math.max(0,Math.min(1,this.timed?(age-1000)/1000:(age-200)/200));}
}
let canvas,context,data;
export function drawExploration(ctx,exploration){
 // Black padding keeps the blur from leaking light along the stage edges.
 if(!canvas){canvas=document.createElement('canvas');canvas.width=496;canvas.height=464;context=canvas.getContext('2d');data=context.createImageData(480,448);}
 for(let i=0;i<exploration.seen.length;i++)data.data[i*4+3]=Math.round(exploration.opacity(i)*255);
 context.fillStyle='#000';context.fillRect(0,0,496,464);context.putImageData(data,8,8);
 ctx.save();ctx.beginPath();ctx.rect(0,0,480,448);ctx.clip();ctx.filter='blur(0.5px)';ctx.drawImage(canvas,-8,-8);ctx.restore();
}
