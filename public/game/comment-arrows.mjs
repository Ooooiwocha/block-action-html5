// Original SWF buttons 376/380, at half scale inside the comment sprite.
// Coordinates include the sprite's (11,16.4) placement in the stage area.
const arrows=[{action:'comment-prev',x:172.1,y:431.5,left:true},{action:'comment-next',x:242.15,y:431.4,left:false}];
export function hitCommentArrow(point){
 const x=(point.x-127.75)/.9984131,y=point.y-31;
 for(const a of arrows){
  const u=x-a.x,v=Math.abs(y-a.y);
  if(u>=0&&u<=8&&v<=2*(a.left?u:8-u))return a.action;
 }
 return null;
}
export function drawCommentArrowHover(ctx,point){
 const action=hitCommentArrow(point),a=arrows.find(a=>a.action===action);
 if(!a)return;
 ctx.save();ctx.beginPath();
 ctx.moveTo(a.x+(a.left?0:8),a.y);
 ctx.lineTo(a.x+(a.left?8:0),a.y-8);
 ctx.lineTo(a.x+(a.left?8:0),a.y+8);ctx.closePath();
 // Original over-state fill (140,99,248) and 1px outline at half scale.
 ctx.fillStyle='#8c63f8';ctx.fill();ctx.strokeStyle='#000';ctx.lineWidth=.5;ctx.lineJoin='round';ctx.stroke();ctx.restore();
}
