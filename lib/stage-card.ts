import {stagePreview,previewBlockVisible} from './stage-preview';
export function stageCardSVG(cells:number[],mode="normal"){
 const colors=(n:number)=>[20,21,22,23].includes(n)?'#343637':n===100?'#bbc1c4':n===6?'#ffd338':n===7?'#42c9e3':n===8?'#c1d7f5':n===1||n===25||n===37?'#987039':n===15||n>=48&&n<=97||n===42?'#292b2b':n===30?'#668036':n===41?'#9d2630':n===38?'#e64c67':n===39?'#3c95d8':n===43?'#47be67':n===36?'#efc34a':n===98?'#bba670':'#8d969b';
 let svg='<svg xmlns="http://www.w3.org/2000/svg" width="480" height="448" viewBox="0 0 480 448"><rect width="480" height="448" fill="#666"/>';
 for(let i=0;i<840;i++){const n=cells[i];if(!previewBlockVisible(n))continue;const x=Math.floor(i/28)*16,y=i%28*16;
  if([30,41,31].includes(n))svg+=`<rect x="${x+1}" y="${y+1}" width="14" height="14" fill="none" stroke="${colors(n)}" stroke-width="3" ${n===31?'stroke-dasharray="3 2"':''}/>`;
  else if([6,7,32,33].includes(n))svg+=`<circle cx="${x+8}" cy="${y+8}" r="6" fill="${colors(n)}"/>`;
  else if(n===15||n>=48&&n<=97)svg+=`<rect x="${x}" y="${y}" width="16" height="16" fill="${colors(n)}" stroke="#53585a" stroke-width="0.7"/>`;
  else svg+=`<rect x="${x+1}" y="${y+1}" width="14" height="14" fill="${colors(n)}" fill-opacity="${[38,39,43].includes(n)?0.24:1}" stroke="#303334" stroke-opacity="${[38,39,43].includes(n)?0.55:1}" stroke-width="1"/>`;
 }
 const p=stagePreview(cells,mode);
 if(p.obscured){svg+='<defs><mask id="dark" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="448"><rect width="480" height="448" fill="white"/>'+p.lights.map(l=>`<circle cx="${l.x}" cy="${l.y}" r="${p.radius}" fill="black"/>`).join('')+'</mask></defs><rect width="480" height="448" fill="black" mask="url(#dark)"/>';
  for(const c of p.checkpoints)svg+=`<rect x="${c.x-6}" y="${c.y-6}" width="12" height="12" fill="#ae6670"/>`;
 }
 return svg+'</svg>';
}
