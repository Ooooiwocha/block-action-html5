const jellyCache=new Map();
function jellySprite(red){
 const green=red==='green';
 if(jellyCache.has(red))return jellyCache.get(red);
 const sprite=document.createElement('canvas');sprite.width=sprite.height=16;const c=sprite.getContext('2d');
 const colors=green?['#17472b','#287a40','#47be67','#83e79b','#c5f6cf','#f1fff3']:red?['#651725','#a82b40','#e64c67','#ff889f','#ffced7','#fff4f6']:['#14335d','#245e9e','#3c95d8','#7ac4ef','#c0e9ff','#f3fbff'];
 const box=(x,y,w,h,k)=>{c.fillStyle=colors[k];c.fillRect(x,y,w,h);};
 box(0,0,16,16,0);box(1,1,14,14,1);box(2,2,12,11,2);box(2,2,12,2,3);box(2,4,2,7,3);box(3,2,7,1,4);box(2,3,2,2,3);box(4,12,9,2,3);box(11,10,2,1,4);
 for(const [x,y] of [[0,0],[15,0],[0,15],[15,15]])c.clearRect(x,y,1,1);
 jellyCache.set(red,sprite);return sprite;
}
export function drawColorBlock(ctx,x,y,red,solid){
 ctx.save();ctx.translate(x,y-16);
 if(!solid){ctx.globalAlpha=.24;ctx.fillStyle=red==='green'?'#47be67':red?'#e95868':'#4399df';ctx.fillRect(1,1,14,14);ctx.globalAlpha=.55;ctx.strokeStyle=red==='green'?'#17472b':red?'#661f29':'#183866';ctx.lineWidth=1;ctx.strokeRect(.5,.5,15,15);}
 else{ctx.imageSmoothingEnabled=false;ctx.drawImage(jellySprite(red),0,0);}
 ctx.restore();
}
const cache=new WeakMap();
const switchColors={red:[240,57,65],blue:[43,150,242],green:[57,222,101]};
function tint(image,mode,pair){
 const key=mode+':'+pair.join(',');
 let variants=cache.get(image);if(!variants){variants=new Map();cache.set(image,variants);}
 if(variants.has(key))return variants.get(key);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=16;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,16,16);
 const pixels=ctx.getImageData(0,0,16,16),d=pixels.data;
 for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],y=Math.floor(i/4/16);
  if(Math.max(r,g,b)-Math.min(r,g,b)>24){const active=mode==='both'||mode===pair[y<8?0:1],light=Math.max(r,g,b)/255*(active?1:.32),color=switchColors[pair[y<8?0:1]];for(let k=0;k<3;k++)d[i+k]=Math.round(color[k]*light);}
 }
 ctx.putImageData(pixels,0,0);variants.set(key,canvas);return canvas;
}
export function drawColorSwitch(ctx,idle,animated,x,y,mode,pair=['red','blue']){
 ctx.save();ctx.imageSmoothingEnabled=false;
 ctx.drawImage(tint(mode===pair[0]?animated:idle,mode,pair),0,0,16,8,x,y-16,16,8);
 ctx.drawImage(tint(mode===pair[1]?animated:idle,mode,pair),0,8,16,8,x,y-8,16,8);ctx.restore();
}
