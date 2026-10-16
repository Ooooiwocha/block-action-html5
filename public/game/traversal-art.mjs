const sprites=new Map();
function tile(kind){
 if(sprites.has(kind))return sprites.get(kind);
 const image=document.createElement('canvas');image.width=image.height=16;
 const c=image.getContext('2d');
 const r=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 if(kind==='tatami'||kind==='falling-tatami'){
  // Keep the original 3-pixel woven edging on all four sides; hollow center.
  const base=kind==='falling-tatami'?'#9d2630':'#286300';
  const light=kind==='falling-tatami'?'#c44448':'#38751b';
  const dark=kind==='falling-tatami'?'#57151c':'#143400';
  for(const y of [0,13]){r(base,0,y,16,3);r(light,1,y,14,1);r(dark,0,y+2,16,1);}
  for(const x of [0,13]){r(base,x,3,3,10);r(light,x,3,1,10);r(dark,x+2,3,1,10);}
 }else if(kind==='wood-shutter'){
  r('#352317',0,0,16,16);r('#865431',1,1,14,14);
  // Vertical planks, framed by the horizontal rails of a wooden amado.
  for(let x=2;x<15;x+=3){r('#ba8350',x,2,1,12);r('#57341f',x+1,2,1,12);}
  for(const y of [1,7,13]){r('#a97543',1,y,14,1);r('#51331f',1,y+1,14,1);}
  r('#d6a16b',1,1,1,13);r('#563822',14,1,1,14);
  r('#30251c',12,9,1,3);r('#d9b780',11,10,1,1);
 }else if(kind==='metal-shutter'){
  r('#343a40',0,0,16,16);r('#858f96',1,1,14,14);
  // Horizontal metal slats with narrow highlights and recessed seams.
  for(let y=1;y<14;y+=3){r('#c6ced3',2,y,12,1);r('#939ea6',2,y+1,12,1);r('#56616a',2,y+2,12,1);}
  r('#cbd3d7',1,1,1,13);r('#515b64',14,1,1,14);
  r('#67727a',2,13,12,2);r('#d5dce0',6,13,4,1);r('#3b454d',6,14,4,1);
 }else{
  // Flat woven side of a kori: no lid seam, latch or trunk straps.
  r('#392c1c',0,0,16,16);r('#a78a50',1,1,14,14);
  for(let y=2;y<15;y+=2){r('#71592f',1,y,14,1);for(let x=1;x<15;x++)if((x+y/2)%3===0)r('#d4b578',x,y-1,1,1);}
  for(let y=1;y<15;y+=4)for(let x=1;x<15;x+=4){
   r('#cfb174',x,y,3,1);r('#806335',x+2,y+1,1,3);
   r('#bc9b60',x,y+2,2,1);r('#594328',x,y+3,3,1);
  }
  r('#d5b977',1,1,14,1);r('#584126',1,14,14,1);
 }
 sprites.set(kind,image);return image;
}
export function drawTatami(ctx,x,y,alpha=1,falling=false){
 if(alpha<=0)return;ctx.save();ctx.globalAlpha*=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(tile(falling?'falling-tatami':'tatami'),x,y-16);ctx.restore();
}
export function drawPassage(ctx,x,y,solid=false,metal=false){
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(solid)ctx.drawImage(tile(metal?'metal-shutter':'wood-shutter'),x,y-16);
 else{
  // Pixel dashes, no anti-aliased canvas stroke.
  for(let i=0;i<16;i+=4){ctx.fillStyle=metal?'#48545e':'#3d3021';ctx.fillRect(x+i,y-16,2,1);ctx.fillRect(x+i,y-1,2,1);ctx.fillRect(x,y-16+i,1,2);ctx.fillRect(x+15,y-16+i,1,2);}
 }
 ctx.restore();
}
