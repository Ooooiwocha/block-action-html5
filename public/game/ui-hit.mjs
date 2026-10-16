import {enemyMenu,enemyMenuY} from './enemy-menu.mjs';
import {hitCommentArrow} from './comment-arrows.mjs';
const inside=(p,x,y,w,h)=>p.x>=x&&p.x<x+w&&p.y>=y&&p.y<y+h;
// Canvas coordinates, shared by clicks and the mouse cursor.
export function hitUI(p,{editor,editingRun,paletteLayout,palettePage=0,list,sidebarPage,stageId,phase,commentView,retryAvailable,voted,raceEnabled=false,commentsWidth=104}){
 if(editor){
  if(palettePage===3)for(const [i,[label,action]] of enemyMenu.entries())if(inside(p,10,enemyMenuY(i)-4,112,24))return action;
  if(palettePage===4)for(const [i,mode] of ['normal','dark chamber','exploration','exploration2'].entries())if(inside(p,10,72+i*40,112,24))return 'mode-'+mode;
  if(inside(p,8,28,30,24))return 'palette-prev';
  if(inside(p,90,28,30,24))return 'palette-next';
  if(inside(p,127.75,31,480*.9984131,448))return 'draw';
  for(const [n,{x,y}] of Object.entries(paletteLayout))if(inside(p,x-(palettePage===2?10:13),y-(palettePage===2?10:13),palettePage===2?20:26,palettePage===2?20:26))return 'palette';
  if(inside(p,8,344,50,24))return 'play';
  if(inside(p,63,344,50,24))return 'show';
  if(inside(p,36,376,50,24))return 'save';
  if(inside(p,132,485,149,24))return 'back';
  if(inside(p,289,485,149,24))return 'clear-all';
  return null;
 }
 for(const [action,x,w] of [['create',132,149],['edit',388,51],['delete',444,51],['ranking',500,100]])if(inside(p,x,485,w,24)&&(phase!=='browse'||action==='create'))return action;
 if(inside(p,0,32,16,32)||inside(p,112,32,16,32))return 'page';
 const row=Math.floor((p.y-64)/32),id=list[sidebarPage*13+row];
 if(row>=0&&row<13&&id&&inside(p,id===stageId?0:19,64+row*32,id===stageId?128:109,32))return 'stage';
 if(inside(p,138,4,42,24)||inside(p,188,4,44,24)||inside(p,239,4,55,24))return 'list';
 if(inside(p,384,5,26,22)||inside(p,575,5,26,22))return 'search';
 if(phase==='title'){
  if(commentView){
   const arrow=hitCommentArrow(p);if(arrow)return arrow;
   if(inside(p,130,448,130,30))return 'game-title';
   if(inside(p,470,448,132,30))return 'send-comment';
  }else{
   if(inside(p,129,454,commentsWidth,24))return 'comments';
   if(raceEnabled&&inside(p,380,376,216,28))return 'replay';
   if(inside(p,135,376,240,28))return 'start';
   if(inside(p,133,167,75,19))return 'author';
  }
 }
 const voteY=phase==='clear'?327:349;
 if((retryAvailable||phase==='clear')&&!voted&&(inside(p,224,voteY,151,38)||inside(p,422,voteY,151,38)))return 'vote';
 if(retryAvailable){
  if(inside(p,250,191,170,34))return 'retry';
  if(inside(p,250,240,210,36))return 'title';
 }
 if(phase==='clear'&&inside(p,250,250,230,50))return 'title';
 return null;
}
export function cursorFor(hit){return hit==='draw'?'crosshair':hit?'pointer':'default';}
