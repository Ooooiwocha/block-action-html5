const sprites=new WeakMap();
export function drawColoredSpring(ctx,image,frame,type,x,y){
 let variants=sprites.get(image);if(!variants){variants=new Map();sprites.set(image,variants);}
 let sprite=variants.get(type);
 if(!sprite){
  sprite=document.createElement('canvas');sprite.width=frame.width;sprite.height=frame.height;
  const c=sprite.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,0,0);
  const pixels=c.getImageData(0,0,sprite.width,sprite.height),data=pixels.data;
  const face=type===26?[224,38,32]:[24,174,224];
  for(let i=0;i<data.length;i+=4){
   let color;
   // Green pixels belong to the faces; keep the yellow extending mechanism intact.
   if(data[i]===40&&data[i+1]===99&&data[i+2]===0)color=face;
   if(color){data[i]=color[0];data[i+1]=color[1];data[i+2]=color[2];}
  }
  c.putImageData(pixels,0,0);variants.set(type,sprite);
 }
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite,x+frame.x,y+frame.y);ctx.restore();
}
