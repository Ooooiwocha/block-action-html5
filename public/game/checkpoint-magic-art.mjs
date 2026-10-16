const pixel=(c,color,x,y)=>{c.fillStyle=color;c.fillRect(x,y,1,1);};
const outer=[[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,2],[12,3],[13,4],[14,5],[14,6],[14,7],[14,8],[14,9],[14,10],[13,11],[12,12],[11,13],[10,14],[9,14],[8,14],[7,14],[6,14],[5,14],[4,13],[3,12],[2,11],[1,10],[1,9],[1,8],[1,7],[1,6],[1,5],[2,4],[3,3],[4,2]];
function line(c,color,x0,y0,x1,y1){const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(;;){pixel(c,color,x0,y0);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
export function drawMagic(c,variant,active,frame=0){
 const pulse=(Math.sin(frame*Math.PI/33)+1)/2;
 const ink=active?'#ee858c':'#85424e',accent=active?'#ffc0ae':'#ae6670',core=active?(pulse>.5?'#ffe0c4':'#ffaaa0'):'#633343';
 for(const [x,y] of outer)pixel(c,ink,x,y);
 if(variant===0){
  // Four-point star, with broad clear space between the star and circle.
  for(let y=3;y<=12;y++)for(let x=3;x<=12;x++){
   const dx=Math.abs(x-7.5),dy=Math.abs(y-7.5);
   if((dx<=.5&&dy<=4.5)||(dy<=.5&&dx<=4.5)||(dx+dy<=3&&dx<=1.5&&dy<=1.5))pixel(c,ink,x,y);
  }
  for(const [x,y] of [[4,4],[11,4],[4,11],[11,11]])pixel(c,accent,x,y);
 }else if(variant===1){
  // Interlaced triangles, with a deliberately open center.
  for(const [x0,y0,x1,y1] of [[7,3,3,10],[3,10,12,10],[12,10,7,3],[8,12,3,5],[3,5,12,5],[12,5,8,12]])line(c,ink,x0,y0,x1,y1);
  for(const [x,y] of [[7,1],[8,14],[1,8],[14,7]])pixel(c,accent,x,y);
 }else{
  // A central diamond and four compact runes, with no tiny lettering.
  for(const [x0,y0,x1,y1] of [[7,4,11,8],[11,8,8,11],[8,11,4,7],[4,7,7,4]])line(c,ink,x0,y0,x1,y1);
  for(const [x,y] of [[7,2],[8,2],[7,3],[8,12],[7,13],[8,13],[2,7],[2,8],[3,8],[12,7],[13,7],[13,8]])pixel(c,accent,x,y);
 }
 if(active){for(const [x,y] of [[7,7],[8,7],[7,8],[8,8]])pixel(c,core,x,y);}
 else{pixel(c,core,7,7);pixel(c,core,8,8);}
}
