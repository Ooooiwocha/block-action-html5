// A box-shaped wooden elevator with a flat, walkable roof and woven front.
export function drawElevator(ctx,x,y,inverted=false){
 ctx.save();ctx.translate(x,inverted?y:y-16);if(inverted)ctx.scale(1,-1);ctx.imageSmoothingEnabled=false;
 const p=(color,px,py,w=1,h=1)=>{ctx.fillStyle=color;ctx.fillRect(px,py,w,h);};
 // A one-pixel roof leaves the two rows below transparent for headroom.
 p('#79582f',0,0,16,1);p('#a77c45',1,0,14,1);
 // Square corner posts leave an open window through which the rider is visible.
 p('#382f24',0,1,2,14);p('#d8bd82',1,1,1,8);
 p('#382f24',14,1,2,14);p('#b58e54',14,1,1,8);
 // Horizontal front rail, retaining the wicker palette of the basket prototype.
 p('#382f24',1,8,14,2);p('#e1c586',2,8,12,1);p('#79582f',2,9,12,1);
 p('#bd9658',2,10,12,5);p('#d0aa67',2,10,12,1);
 p('#987142',2,11,12,1);p('#d6b474',2,12,12,1);p('#9b7446',2,13,12,1);
 p('#c5a069',2,14,12,1);
 for(const px of [3,6,9,12]){p('#8b673e',px,10,1,1);p('#f0d99b',px,11,1,1);p('#8b673e',px,12,1,1);p('#e1c586',px,13,1,1);}
 p('#382f24',0,15,16,1);p('#80603b',1,14,1,1);p('#80603b',14,14,1,1);
 ctx.restore();
}
