import {drawElevator} from './elevator-art.mjs';
import {drawGear} from './gear-art.mjs';
import {drawCheckpoint} from './checkpoint-art.mjs';
import {drawSolidTatami} from './solid-tatami-art.mjs';
// Share the game's drawing functions so the guide matches the actual palette.
import {drawLetterBlock} from './letter-block-art.mjs';
import {drawPurify} from './purify-art.mjs?v=outline-b-40';
import {drawOrbitSpike} from './orbit-spike.mjs';
import {drawHiSkull} from './skull-hi-art.mjs';
import {drawColorBlock,drawColorSwitch} from './color-block-art.mjs';
import {drawKey,drawLockedBlock} from './key-art.mjs';
import {drawTool} from './tool-art.mjs';
import {drawWarp} from './warp-art.mjs';
import {drawTatami,drawPassage} from './traversal-art.mjs';
import {drawMoai} from './moai-art.mjs';
import {drawColoredSpring} from './colored-spring-art.mjs';
import {drawCrackedBlock} from './cracked-block-art.mjs';
import {drawGravityBlock} from './gravity-block-art.mjs';

let preparation;
export function prepareGuideIcons(){
 return preparation ||= (async()=>{
  const response=await fetch('/game/assets.json');
  if(!response.ok)throw Error('Could not load block images.');
  const manifest=await response.json(),images=new Map();
  await Promise.all(Object.values(manifest).map(async frames=>{
   const f=frames[0];if(images.has(f.url))return;
   const im=new Image();images.set(f.url,im);
   await new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=reject;im.src=new URL(f.url,location.origin+'/game/').href;});
  }));
  return (canvas,n)=>{
   const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(canvas.width/16,canvas.height/16);ctx.imageSmoothingEnabled=false;
   const image=key=>images.get(manifest[key][0].url),frame=key=>manifest[key][0];
   if(n===101||n===103)drawElevator(ctx,0,16,n===103);
   else if(n===102)drawPassage(ctx,0,16,true,true);
   else if(n===100)drawGear(ctx,0,16);
   else if(n===99)drawCheckpoint(ctx,0,16,true);
   else if(n===98)drawSolidTatami(ctx,0,16);
   else if(n>=48)drawLetterBlock(ctx,image('block15-1'),0,16,'A');
   else if(n===47)drawPurify(ctx,0,16);
   else if(n===46)drawOrbitSpike(ctx,image('block12-1'),0,16);
   else if([38,39,43].includes(n))drawColorBlock(ctx,0,16,n===43?'green':n===38,true);
   else if([40,44,45].includes(n))drawColorSwitch(ctx,image('block11-1'),image('block11-1'),0,16,'both',n===44?['blue','green']:n===45?['green','red']:['red','blue']);
   else if(n===36)drawKey(ctx,0,16);
   else if(n===37)drawLockedBlock(ctx,image('block1-1'),0,16);
   else if(n===34||n===35)drawTool(ctx,0,16,n);
   else if(n===32||n===33)drawWarp(ctx,0,16,n===33);
   else if(n===42)drawHiSkull(ctx,0,16,image('block15-1'));
   else if(n===30||n===41)drawTatami(ctx,0,16,1,n===41);
   else if(n===31)drawPassage(ctx,0,16,true);
   else if(n===28||n===29)drawMoai(ctx,0,16,n===29);
   else if(n===24)drawGravityBlock(ctx,image('block11-1'),0,16);
   else if(n===25)drawCrackedBlock(ctx,image('block1-1'),0,16);
   else if(n===26||n===27)drawColoredSpring(ctx,image('spring1'),frame('spring1'),n,0,16);
   else {const key=n===18?'spring1':n===14?'steered1':'block'+n+'-1',f=frame(key);ctx.drawImage(image(key),f.x,16+f.y,f.width,f.height);}
   ctx.restore();
  };
 })();
}
