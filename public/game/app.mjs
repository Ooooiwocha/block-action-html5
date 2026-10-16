import {parseBookmarkIds,mergeBookmarkIds,bookmarkTransferURL} from './bookmark-transfer.mjs';
import {StaticBlockCache} from './static-block-cache.mjs';
import {singleLine,installSingleLineFields} from './single-line.mjs';
import {installStageShare} from './stage-share.mjs';
import {drawElevator} from './elevator-art.mjs';
import {drawGear} from './gear-art.mjs';
import {enemyMenu,enemyMenuY} from './enemy-menu.mjs';
import {drawHannyaEnemy} from './hannya.mjs';
import {drawCheckpoint,drawSealedGoal} from './checkpoint-art.mjs';
import {drawSolidTatami} from './solid-tatami-art.mjs';
import {drawToolBreak} from './tool-break-art.mjs';
import {drawLetterBlock} from './letter-block-art.mjs';
import {letterById} from './letter-block-types.mjs';
import {drawPurify} from './purify-art.mjs?v=outline-b-40';
import {drawExploration} from './exploration.mjs?v=timed-2s-45';
import {ReplayPlayback} from './replay-player.mjs';
import {RaceRecording,SecretSequence} from './race-replay.mjs';
import {hashtagParts} from './hashtags.mjs';
import {makeNotifier,enableDialogDragging} from './dialog-ui.mjs';
import {readDraft,writeDraft,discardDraft} from './draft.mjs';
import {drawDarkChamber} from './dark-chamber.mjs?v=release-23';
import {drawOrbitSpike} from './orbit-spike.mjs?v=nearby-ladder-1';
import {drawGhost} from './ghost.mjs?v=enemy-ii-47';
import {drawHiSkull} from './skull-hi-art.mjs?v=skull-mouth-1';
import {drawCurse} from './skull-art.mjs?v=4';
import {drawColorBlock,drawColorSwitch} from './color-block-art.mjs?v=three-colors';
import {drawKey,drawLockedBlock,UNLOCK_FRAMES} from './key-art.mjs?v=release-23';
import {drawCommentArrowHover} from './comment-arrows.mjs';
import {drawTool} from './tool-art.mjs';
import {drawWarp} from './warp-art.mjs';
import {drawTatami,drawPassage} from './traversal-art.mjs?v=hollow-frame-1';
import {drawMoai} from './moai-art.mjs';
import {drawColoredSpring} from './colored-spring-art.mjs';
import {drawCrackedBlock} from './cracked-block-art.mjs';
import {drawGravityBlock} from './gravity-block-art.mjs';
import {Stage,Key,jellyColors,switchPairs,standingOnSkull} from './engine.mjs?v=elevator-entry-72';
import {Presentation} from './presentation.mjs';
import {hitUI,cursorFor} from './ui-hit.mjs?v=gear-57';
const canvas=document.querySelector('#canvaswrap canvas'),ctx=canvas.getContext('2d'),stateEl=document.getElementById('state'),timeEl=document.getElementById('time');
const manifest={...await (await fetch('./assets.json')).json(),...await (await fetch('./ui-assets.json?v=replay-50')).json()},images=new Map();
const layout=await (await fetch('./ui-layout.json')).json(),paletteLayout=await (await fetch('./palette-layout.json?v=gear-57')).json();
await Promise.all(Object.values(manifest).flat().map(async f=>{if(images.has(f.url))return;const im=new Image();images.set(f.url,im);await new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=reject;im.src=new URL(f.url,location.href);});}));
await Promise.all([document.fonts.load('44px \"BA Century\"'),document.fonts.load('bold 20px \"BA Century\"')]);
const api=async(endpoint,p={})=>{const r=await fetch('/'+endpoint+'.php',{method:'POST',body:new URLSearchParams(p)});const data=Object.fromEntries(new URLSearchParams(await r.text()));if(!r.ok)throw Error(data.message&&!/[ぁ-んァ-ヶ一-龠]/.test(data.message)?data.message:'Connection failed. Please try again.');return data;};
const notify=makeNotifier(message=>{document.getElementById('feedback').textContent=message;});
function requireOK(r){if(r.error==='true')throw Error(r.message&&!/[ぁ-んァ-ヶ一-龠]/.test(r.message)?r.message:'The operation could not be completed.');return r;}
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();
 window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 try{Promise.resolve(document.modelContext.registerTool({name:'list_stages',title:'ステージ一覧',description:'公開されたHTML5版の最新ステージIDを最大100件取得します。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},async execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw Error('空のオブジェクトを指定してください。');const r=requireOK(await api('loadActionList',{sortType:1,count:100,snum:0}));return {total:Number(r.total),stageIds:Array.from({length:Number(r.count)},(_,i)=>Number(r['id'+i]))};}},{signal:lifecycle.signal})).catch(e=>console.warn('Stage tool unavailable',e));}catch(e){console.warn('Stage tool unavailable',e);}
}
function publishSelection(){parent.postMessage({type:'stage-selected',id:stageId},location.origin);}
let savingStage=false;
let editingPassword='',commentTotal=0,commentPage=0,scoreAttempt=null,runSerial=0;
const commentsEl=document.getElementById('comments-overlay');
let editorShow=false,commentView=false,voted=false,flow=null,hover={x:-1,y:-1},stage=null,meta={},stageId=1,list=[],editor=false,editingRun=false,palette=1,palettePage=0,drawing=false,lastPaintCell=null,sidebarPage=0,lastTick=0,accumulator=0,paintFrame=0,listQuery={};
const colors={orange:'#ffa500',gold:'#e5a630',pale:'#ffdc8a',gray:'#666666'};
function rect(x,y,w,h,color,stroke='#252218'){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}}
function text(s,x,y,size=16,color='white',bold=false){ctx.fillStyle=color;ctx.font=(bold?'bold ':'')+size+'px "MS UI Gothic","MS PGothic",Arial,sans-serif';ctx.textBaseline='top';ctx.fillText(String(s),x,y);}
function button(label,x,y,w,h=24,font='Arial,sans-serif'){ctx.save();const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#fff');g.addColorStop(1,'#e4e9ed');ctx.fillStyle=g;ctx.strokeStyle='#8b969a';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(x+.5,y+.5,w-1,h-1,4);ctx.fill();ctx.stroke();ctx.strokeStyle='white';ctx.beginPath();ctx.roundRect(x+2,y+2,w-4,h-4,3);ctx.stroke();ctx.fillStyle='#25434d';ctx.font='13px '+font;ctx.textBaseline='middle';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h/2);ctx.restore();}
function featuredTab(selected){const key='ui-featured'+(selected?'-selected':hover.y<32&&hover.x>=239&&hover.x<=294?'-hover':'');const im=images.get(manifest[key][0].url);ctx.save();const x=239.3,y=3.4,w=55;for(const [sx,sw,dx,dw] of [[0,8,x,8],[8,23.3,x+8,w-16],[31.3,8,x+w-8,8]])ctx.drawImage(im,sx,0,sw,25,dx,y,dw,25);ctx.font='10px Century,"Times New Roman",serif';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillStyle='#333333';ctx.fillText('Bookmark',x+w/2,y+16.75);ctx.restore();}
function searchIcon(x,y){button('',x,y,26,22);ctx.save();ctx.strokeStyle='#25434d';ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(x+10,y+9,4.5,0,Math.PI*2);ctx.moveTo(x+13.5,y+12.5);ctx.lineTo(x+18,y+17);ctx.stroke();ctx.restore();}
function spacedLabel(label,x,y){const parts=label.split(' '),gap=Math.max(6,ctx.measureText(' ').width);const widths=parts.map(word=>ctx.measureText(word).width);let cursor=x-(widths.reduce((a,b)=>a+b,0)+gap*(parts.length-1))/2;ctx.textAlign='left';parts.forEach((word,i)=>{ctx.fillText(word,cursor,y);cursor+=widths[i]+gap;});}
function art(key,x,y,t=0,flip=false){const frames=manifest[key];if(!frames)return;const f=frames[((t%frames.length)+frames.length)%frames.length],im=images.get(f.url);if(!im?.complete)return;ctx.save();ctx.translate(x,y);if(flip)ctx.scale(1,-1);ctx.drawImage(im,f.x,f.y,f.width,f.height);ctx.restore();}
function animatedKey(kind,x,y,width,height){ctx.save();ctx.translate(x,y);ctx.scale(width/(kind==='tab'?30:64),height/(kind==='tab'?17:26));art('ui-'+kind+'-'+(paintFrame%40+1),0,0);ctx.restore();}
function stageTitleArt(){
 if(!raceEnabled){art('ui-stage',0,0);return;}
 // Cut out the original embedded GAME START without covering the stage beneath it.
 ctx.save();ctx.beginPath();ctx.rect(-20,-20,520,500);ctx.rect(73,340,124,24);ctx.clip('evenodd');art('ui-stage',0,0);ctx.restore();
 ctx.save();ctx.font='bold 16px "Century Gothic","BA Century"';ctx.fillStyle='white';ctx.textBaseline='alphabetic';ctx.textAlign='left';
 let x=86.9;for(const word of ['RACE','WITH','GHOST']){ctx.fillText(word,x,358.35);x+=ctx.measureText(word).width+8;}
 ctx.restore();
 animatedKey('tab',252,341.85,60,23);
 ctx.save();ctx.font='bold 16px "Century Gothic","BA Century"';ctx.fillStyle='white';ctx.textBaseline='alphabetic';ctx.fillText('1ST PLACE REPLAY',320,358.35);ctx.restore();
}
let listRequestSerial=0;
const bookmarkKey='block-action-bookmarks-v1';
function readBookmarks(){try{const ids=JSON.parse(localStorage.getItem(bookmarkKey)||'[]');return new Set(Array.isArray(ids)?ids.filter(id=>Number.isSafeInteger(id)&&id>0):[]);}catch{return new Set();}}
const bookmarkButton=document.getElementById('stage-bookmark');
function updateBookmark(){const visible=!editor&&flow?.phase==='title'&&!commentView&&stageId>0;bookmarkButton.hidden=!visible;const on=readBookmarks().has(stageId);bookmarkButton.setAttribute('aria-pressed',String(on));bookmarkButton.setAttribute('aria-label',on?'ブックマークを解除':'ステージをブックマーク');}
bookmarkButton.onclick=async()=>{const ids=readBookmarks();if(ids.has(stageId))ids.delete(stageId);else ids.add(stageId);try{localStorage.setItem(bookmarkKey,JSON.stringify([...ids]));}catch{notify('ブックマークを保存できません。ブラウザの保存設定をご確認ください。');return;}if(Number(listQuery.sortType)===10)await loadList(listQuery);paint();};
window.addEventListener('storage',async e=>{if(e.key===bookmarkKey){if(Number(listQuery.sortType)===10)await loadList(listQuery);paint();}});
const bookmarkTab=document.getElementById('bookmark-tab'),bookmarkHint=document.getElementById('bookmark-hint');
let bookmarkPress=null,suppressBookmarkClick=false,hintTimer=null;
function hideBookmarkHint(){clearTimeout(hintTimer);bookmarkHint.hidden=true;}
bookmarkTab.onmouseenter=()=>{hintTimer=setTimeout(()=>{bookmarkHint.hidden=false;},1000);};
bookmarkTab.onmouseleave=()=>{hideBookmarkHint();cancelBookmarkPress();};
bookmarkTab.onfocus=()=>{bookmarkHint.hidden=false;};bookmarkTab.onblur=hideBookmarkHint;
function cancelBookmarkPress(){if(bookmarkPress)clearTimeout(bookmarkPress.timer);bookmarkPress=null;}
bookmarkTab.onpointerdown=e=>{if(e.button!==0)return;suppressBookmarkClick=false;const press={id:e.pointerId,x:e.clientX,y:e.clientY,timer:null};bookmarkPress=press;bookmarkTab.setPointerCapture(e.pointerId);press.timer=setTimeout(async()=>{if(bookmarkPress!==press)return;suppressBookmarkClick=true;hideBookmarkHint();const ids=readBookmarks();if(!ids.size){notify('ブックマークがありません。');return;}try{await navigator.clipboard.writeText(bookmarkTransferURL(location.origin,ids));notify('引き継ぎリンクをコピーしました。');}catch{notify('コピーできませんでした。もう一度長押ししてください。');}},800);};
bookmarkTab.onpointermove=e=>{if(bookmarkPress&&Math.hypot(e.clientX-bookmarkPress.x,e.clientY-bookmarkPress.y)>8){suppressBookmarkClick=true;cancelBookmarkPress();}};
bookmarkTab.onpointerup=cancelBookmarkPress;bookmarkTab.onpointercancel=()=>{suppressBookmarkClick=true;cancelBookmarkPress();};window.addEventListener('blur',()=>{cancelBookmarkPress();hideBookmarkHint();});
bookmarkTab.onclick=async e=>{if(suppressBookmarkClick){suppressBookmarkClick=false;return;}try{await loadList({sortType:10});sidebarPage=0;paint();}catch(error){notify(error.message);}};
bookmarkTab.oncontextmenu=e=>e.preventDefault();
function importBookmarkLink(params){if(!params.has('bookmark_id'))return '';const merged=mergeBookmarkIds(readBookmarks(),parseBookmarkIds(params.get('bookmark_id')),new Set(list));try{localStorage.setItem(bookmarkKey,JSON.stringify(merged.ids));}catch{return 'ブックマークを保存できませんでした。リンクを再度開いてお試しください。';}const url=new URL(location.href);url.searchParams.delete('bookmark_id');history.replaceState(null,'',url.pathname+url.search+url.hash);parent.postMessage({type:'bookmark-imported'},location.origin);return 'ブックマークを'+merged.added+'件追加しました。';}
async function loadList(extra={}){
 const request=++listRequestSerial,query={...extra},next=[];let total=1,offset=0;
 listQuery=query;
 while(offset<total){
  let p;try{p=requireOK(await api('loadActionList',{count:100,snum:offset,...query,sortType:Number(query.sortType)===10?1:(query.sortType??1)}));}catch(error){if(request!==listRequestSerial)return false;throw error;}
  if(request!==listRequestSerial)return false;
  total=Number(p.total);
  const rows=Array.from({length:Number(p.count)},(_,i)=>Number(p['id'+i]));
  next.push(...rows);offset+=rows.length;if(!rows.length)break;
 }
 if(request!==listRequestSerial)return false;
 list=[...new Set(next)].filter(id=>Number(query.sortType)!==10||readBookmarks().has(id));
 sidebarPage=Math.max(0,Math.min(sidebarPage,Math.ceil(list.length/13)-1));
 parent.postMessage({type:'stage-list-changed'},location.origin);return true;
}
async function load(id){resetRace();
 const data=requireOK(await api('loadMapData',{action_id:id}));
 commentView=false;voted=false;editor=false;editingRun=false;Key.held.clear();stageId=id;meta=data;commentTotal=Number(data.comments||0);commentPage=0;scoreAttempt=null;runSerial++;editingPassword='';document.getElementById('edit-password').value='';
 stage=new Stage(Array.from({length:840},(_,i)=>Number(meta[i])),{mode:meta.mode,darkChamber:meta.darkChamber==='true',hannyaII:meta.hannyaII==='true',ghostII:meta.ghostII==='true',hannya:meta.hannya==='true',ghost:meta.ghost==='true',doppelganger:meta.doppelganger==='true',doppelVariant:meta.doppelVariant==='true'});flow=new Presentation(stage);accumulator=0;lastTick=performance.now();publishSelection();notify('');paint();
}
function start(retry=false,replay=false){playback=replay&&raceFrames?.length?new ReplayPlayback(raceFrames):null;recording=new RaceRecording();runRevision=meta.revision||'';if(!stage)return;notify('');runSerial++;scoreAttempt=null;flow.edit=editor;flow.start(retry);editingRun=editor;if(editor)editorShow=true;else if(stageId>0&&!playback){void api(retry?'addRetryCount':'addPlayCount',{action_id:stageId}).then(()=>parent.postMessage({type:'stage-list-changed'},location.origin)).catch(e=>notify(e.message));meta[retry?'retn':'pn']=Number(meta[retry?'retn':'pn']||0)+1;}canvas.focus();}
async function endEditor(){resetRace();
 persistDraft();
 editor=false;editingRun=false;editorShow=false;commentView=false;voted=false;
 stageId=-1;meta={};Key.held.clear();drawing=false;
 publishSelection();
 stage=new Stage(Array(840).fill(-1));flow=new Presentation(stage);flow.phase='browse';
 accumulator=0;lastTick=performance.now();paint();
 await loadList(listQuery);paint();
}
function stageOptions(){return {mode:stage.mode,darkChamber:stage.darkChamber,hannyaII:stage.hannyaIIEnabled,ghostII:stage.ghostIIEnabled,hannya:stage.hannyaEnabled,ghost:stage.ghostEnabled,doppelganger:stage.doppelEnabled,doppelVariant:stage.doppelVariantEnabled};}
function persistDraft(){if(!editor||stageId!==-1)return;try{if(!writeDraft(localStorage,{cells:[...stage.cells],options:stageOptions(),meta:{title:meta.title||'',name:meta.name||'',comment:meta.comment||''}}))notify('Could not save your draft in this browser.');}catch{notify('Could not save your draft in this browser.');}}
window.addEventListener('pagehide',persistDraft);
document.addEventListener('visibilitychange',()=>{if(document.hidden)persistDraft();});
function beginEditor(fresh){resetRace();if(fresh){editingPassword='';stageId=-1;meta={title:'',name:'',comment:''};let draft=null;try{draft=readDraft(localStorage);}catch{}if(draft){meta={...meta,...draft.meta};stage=new Stage(draft.cells,draft.options||{});}else stage=new Stage(Array(840).fill(-1));}else stage.reset();editor=true;editingRun=false;editorShow=false;flow=new Presentation(stage,true);Key.held.clear();stateEl.textContent='Select blocks to place. Press Play to test.';paint();}
function paletteText(s,x,y,size=16,color='black'){ctx.save();ctx.font=size+'px "Times New Roman",serif';ctx.fillStyle=color;ctx.textBaseline='top';ctx.fillText(String(s),x,y);ctx.restore();}
function paletteButton(label,x,y,w,h=24){button(label,x,y,w,h,'"Times New Roman",serif');}
function wrap(s,x,y,width,maxLines=6){ctx.font='16px "MS UI Gothic","MS PGothic",Arial,sans-serif';let line='',row=0;for(const ch of s||'No description'){if(ch==='\n'||ctx.measureText(line+ch).width>width){text(line,x,y+row*20);row++;line=ch==='\n'?'':ch;if(row>=maxLines)return;}else line+=ch;}text(line,x,y+row*20);}
function field(name,value,options={}){const f=layout['438'][name];if(!f)return;const x=f.x+f.margin,y=f.y+(options.offset||0),width=f.width-f.margin*2;ctx.save();ctx.beginPath();ctx.rect(f.x,f.y,f.width,f.height+4);ctx.clip();ctx.font=f.size+'px "MS UI Gothic","MS PGothic",Arial,sans-serif';let rows=String(value??'').split('\n');if(options.wrap){const result=[];for(const row of rows){let line='';for(const token of row.match(/[A-Za-z0-9'.,:;!?/−-]+[ \t]*|./gu)||[]){if(line&&ctx.measureText(line+token).width>width){result.push(line.trimEnd());line='';}if(ctx.measureText(token).width>width){for(const ch of token){if(ctx.measureText(line+ch).width>width){result.push(line);line='';}line+=ch;}}else line+=token;}result.push(line);}rows=result;}rows.forEach((row,i)=>{if(name==='stage_name'){ctx.font=f.size+'px \"Century Gothic\",\"BA Century\"';ctx.fillStyle='white';ctx.textBaseline='top';ctx.fillText(row,x,y+i*(f.size+f.leading));}else text(row,x,y+i*(f.size+f.leading),f.size);});ctx.restore();}
function gravityArt(x,y,dir=1,t=paintFrame){
 const frames=manifest['block19-1'],f=frames[((t%frames.length)+frames.length)%frames.length];
 const im=images.get(f.url);if(im?.complete)drawGravityBlock(ctx,im,x,y,dir);
}
function crackedArt(x,y){drawCrackedBlock(ctx,images.get(manifest['block1-1'][0].url),x,y);}
function coloredSpringArt(type,x,y,frame=1){const f=manifest['spring'+frame][0];drawColoredSpring(ctx,images.get(f.url),f,type,x,y);}
function visiblePalette(){
 if(palettePage>=3)return {};
 return Object.fromEntries(Object.entries(paletteLayout)
  .filter(([,pos])=>(pos.page??(pos.y>=268?1:0))===palettePage)
  .map(([n,pos])=>[n,{x:pos.x,y:pos.y-(palettePage===1?196:0)}]));
}
function orbitSpikeArt(x,y){const frames=manifest['block12-1'];drawOrbitSpike(ctx,images.get(frames[paintFrame%frames.length].url),x,y);}
const enemySprites=new Map();
function enemyArt(p){const f=manifest['player'+p.action.frame][0],im=images.get(f.url);let sprite=enemySprites.get(f.url);if(!sprite){sprite=document.createElement('canvas');sprite.width=sprite.height=32;const c=sprite.getContext('2d');c.drawImage(im,f.x+16,f.y+16,f.width,f.height);c.globalCompositeOperation='source-in';c.fillStyle='#080809';c.fillRect(0,0,32,32);enemySprites.set(f.url,sprite);}ctx.save();ctx.translate(p._x,p._y);if(p.fg<0)ctx.scale(1,-1);ctx.drawImage(sprite,-16,-16);ctx.restore();}
function skullArt(x,y,open=false){drawHiSkull(ctx,x,y,images.get(manifest['block15-1'][0].url),0,paintFrame,open);}
function colorSwitchArt(x,y,mode,t,pair=['red','blue']){
 const frames=manifest['block11-1'],frame=frames[t%frames.length],idle=frames[0];
 drawColorSwitch(ctx,images.get(idle.url),images.get(frame.url),x,y,mode,pair);
}
function paintPalette(){
 for(const [id,{x,y}] of Object.entries(visiblePalette())){
  const n=Number(id);
  if(n===0)rect(x-8,y-8,16,16,'#cccccc','#000');
  else if(jellyColors[n])drawColorBlock(ctx,x-8,y+8,n===43?'green':n===38,true);
  else if(switchPairs[n])colorSwitchArt(x-8,y+8,'both',0,switchPairs[n]);
  else if(n===36)drawKey(ctx,x-8,y+8,paintFrame);
  else if(n===37)drawLockedBlock(ctx,images.get(manifest['block1-1'][0].url),x-8,y+8);
  else if(letterById[n])drawLetterBlock(ctx,images.get(manifest['block15-1'][0].url),x-8,y+8,letterById[n]);else if(n===47)drawPurify(ctx,x-8,y+8);else if(n===34||n===35)drawTool(ctx,x-8,y+8,n);
  else if(n===24)gravityArt(x-8,y+8);
  else if(n===32||n===33)drawWarp(ctx,x-8,y+8,n===33,paintFrame);
  else if(n===46)orbitSpikeArt(x-8,y+8);
  else if(n===42)skullArt(x-8,y+8);
  else if(n===100)drawGear(ctx,x-8,y+8);
  else if(n===101||n===103)drawElevator(ctx,x-8,y+8,n===103);
  else if(n===99)drawCheckpoint(ctx,x-8,y+8,true,1,paintFrame);
  else if(n===98)drawSolidTatami(ctx,x-8,y+8);
  else if(n===41)drawTatami(ctx,x-8,y+8,1,true);
  else if(n===30)drawTatami(ctx,x-8,y+8);
  else if(n===31||n===102)drawPassage(ctx,x-8,y+8,Math.floor(paintFrame/33)%2===1,n===102);
  else if(n===28||n===29)drawMoai(ctx,x-8,y+8,n===29);
  else if(n===25)crackedArt(x-8,y+8);
  else if(n===26||n===27)coloredSpringArt(n,x-8,y+8);
  else art(n===18?'spring1':n===14?'steered1':'block'+n+'-1',x-8,y+8,paintFrame);
 }
}
function commentLabelWidth(){ctx.save();ctx.font='16px "MS UI Gothic","MS PGothic",Arial,sans-serif';const width=ctx.measureText('Comments ('+commentTotal+')').width*.9984131+4;ctx.restore();return width;}
function hit(p){return hitUI(p,{commentsWidth:commentLabelWidth(),commentsWidth:commentLabelWidth(),commentsWidth:commentLabelWidth(),editor,editingRun,paletteLayout:visiblePalette(),list,sidebarPage,stageId,palettePage,phase:flow?.phase,commentView,retryAvailable:flow?.retryAvailable,raceEnabled,voted});}
const updateStageShare=installStageShare(document.getElementById('stage-share'));
const selectableFields={stage_title:document.getElementById('select-title'),comment:document.getElementById('select-description'),url_box:document.getElementById('select-url'),creator_name:document.getElementById('display-creator'),create_date:document.getElementById('display-date')};
function updateSelectableFields(){bookmarkTab.hidden=editor;if(editor)hideBookmarkHint();updateBookmark();const visible=!editor&&flow?.phase==='title'&&!commentView;const scale=canvas.clientWidth/608;updateStageShare(visible,{id:stageId,title:meta.title,creator:meta.name,origin:location.origin},scale);document.getElementById('display-date').style.setProperty('--share-scale',String(scale));for(const [name,el] of Object.entries(selectableFields)){el.hidden=!visible;if(!visible)continue;const f=layout['438'][name];const content=name==='creator_name'?(meta.name||'Anonymous'):name==='create_date'?(meta.create||''):name==='url_box'?(stageId>0?location.origin+'/?stage='+stageId:''):name==='stage_title'?(meta.title||'Untitled'):(meta.comment||'No description');if(el.dataset.content!==content){el.replaceChildren();for(const part of (['creator_name','create_date'].includes(name)?[{text:content}]:hashtagParts(content))){if(part.tag){const a=document.createElement('a');a.textContent=part.text;a.href='#';a.onclick=async e=>{e.preventDefault();try{await loadList({sortType:9,tag:part.tag});sidebarPage=0;paint();}catch{notify('Could not search this tag.');}};el.append(a);}else el.append(document.createTextNode(part.text));}el.dataset.content=content;}Object.assign(el.style,{left:(127.75+(2.95+f.x+f.margin)*.9984131)*scale+'px',top:(31+9.1+f.y+(name==='url_box'?-1:name==='create_date'?0:0))*scale+'px',width:(f.width-2*f.margin)*.9984131*scale+'px',height:(f.height+4)*scale+'px',fontSize:(f.size+(name==='url_box'?1:0))*scale+'px',lineHeight:(f.size+f.leading+(name==='url_box'?1:0))*scale+'px'});}}
const fixedBlockCache=new StaticBlockCache();let cacheEnabled=false,renderSamples=[],lastRenderInfoFrame=-1;
const comparePanel=document.createElement('div');comparePanel.id='render-compare';const compareButton=document.createElement('button'),compareInfo=document.createElement('span');compareButton.type='button';compareButton.textContent='軽量描画 OFF';compareButton.setAttribute('aria-pressed','false');compareButton.onclick=()=>{cacheEnabled=!cacheEnabled;renderSamples=[];lastRenderInfoFrame=-1;compareButton.textContent=cacheEnabled?'軽量描画 ON':'軽量描画 OFF';compareButton.setAttribute('aria-pressed',String(cacheEnabled));canvas.focus({preventScroll:true});paint();};comparePanel.append(compareButton,compareInfo);canvas.parentElement.after(comparePanel);
function paint(){const renderStart=performance.now();
 ctx.imageSmoothingEnabled=true;ctx.clearRect(0,0,608,512);rect(0,0,608,512,colors.gray);art('ui-chrome',-2,32.95);rect(0,480,608,32,colors.orange);
 if(!editor){rect(128,0,480,32,colors.orange);const sortType=Number(listQuery.sortType??1);art(sortType===1?'ui-new-selected':'ui-new',136.55,3.95);art(sortType===6?'ui-pickup-selected':'ui-pickup',189.1,3.9);featuredTab(sortType===10);text('ID',303,10,16,'black',true);text('NAME',422,10,16,'black',true);text('Total '+list.length+' Stages',10,9,12,'black');searchIcon(384,5);searchIcon(575,5);text((sidebarPage+1)+'/'+Math.max(1,Math.ceil(list.length/13)),50,41,16,'black');list.slice(sidebarPage*13,sidebarPage*13+13).forEach((id,i)=>{const selected=id===stageId,y=64+i*32;rect(selected?0:19,y,selected?128:109,32,selected?'#ae8828':colors.gold);text('No '+id,selected?2:28,y+5,20,'white');});if(hover.y<32){if(sortType!==1&&hover.x>138&&hover.x<180)art('ui-new-hover',136.55,3.95);if(sortType!==6&&hover.x>188&&hover.x<232)art('ui-pickup-hover',189.1,3.9);}}
 if(stage){ctx.save();ctx.beginPath();ctx.rect(127.75,31,480*.9984131,448);ctx.clip();ctx.translate(127.75,31);ctx.scale(.9984131,1);rect(0,0,480,448,'#cccccc',null);
  if(cacheEnabled)fixedBlockCache.prepare(stage,b=>stage.blockFrame(b,editor,editorShow),ctx,manifest,images);
  for(const b of stage.blocks){if(cacheEnabled&&fixedBlockCache.draw(ctx,b))continue;if([101,103].includes(b.typeNo)||b.broken||b.collected||(b.unlocked&&b.unlockFrame>=UNLOCK_FRAMES))continue;if(b.toolBroken){drawToolBreak(ctx,images.get(manifest[b.typeNo===8?'block8-1':'block1-1'][0].url),b._x,b._y,b.toolFade,b.typeNo===8,b.toolGravity);continue;}ctx.save();const key=b.typeNo===18?'spring'+b.graphic.frame:b.typeNo===14?'steered'+b.graphic.frame:'block'+b.typeNo+'-'+stage.blockFrame(b,editor,editorShow);if(b.typeNo===100)drawGear(ctx,b._x,b._y,paintFrame,b.turnFrames);else if(b.typeNo===99)drawCheckpoint(ctx,b._x,b._y,b.activated,b.raiseFrame/10,paintFrame);else if(b.typeNo===7&&!stage.goalUnlocked)drawSealedGoal(ctx,b._x,b._y,paintFrame);else if(b.typeNo===98)drawSolidTatami(ctx,b._x,b._y);else if(b.letterSymbol)drawLetterBlock(ctx,images.get(manifest['block15-1'][0].url),b._x,b._y,b.letterSymbol);else if(b.typeNo===46)orbitSpikeArt(b._x,b._y);else if(jellyColors[b.typeNo])drawColorBlock(ctx,b._x,b._y,b.typeNo===43?'green':b.typeNo===38,b.solid);else if(switchPairs[b.typeNo])colorSwitchArt(b._x,b._y,(editor?flow.phase==='edit':['title','browse','starting'].includes(flow.phase))?'both':stage.colorMode,stage.colorAnimation,switchPairs[b.typeNo]);else if(b.typeNo===36)drawKey(ctx,b._x,b._y,paintFrame);else if(b.typeNo===37)drawLockedBlock(ctx,images.get(manifest['block1-1'][0].url),b._x,b._y,b.unlocked?b.unlockFrame/UNLOCK_FRAMES:0);else if(b.typeNo===47)drawPurify(ctx,b._x,b._y);else if(b.typeNo===34||b.typeNo===35)drawTool(ctx,b._x,b._y,b.typeNo);else if(b.typeNo===32||b.typeNo===33)drawWarp(ctx,b._x,b._y,b.typeNo===33,paintFrame);else if(b.typeNo===42)skullArt(b._x,b._y,stage.run&&standingOnSkull(stage.player,b));else if(b.typeNo===41)drawTatami(ctx,b._x,b._y,1,true);else if(b.typeNo===30)drawTatami(ctx,b._x,b._y,Math.max(0,1-b.fadeFrame/8));else if(b.typeNo===31||b.typeNo===102)drawPassage(ctx,b._x,b._y,b.solid,b.typeNo===102);else if(b.typeNo===28||b.typeNo===29)drawMoai(ctx,b._x,b._y,b.typeNo===29,b.awake,b.vanished?Math.max(0,16-b.shrinkFrame*2):16);else if(b.typeNo===24)gravityArt(b._x,b._y,b.dir,b.graphic.animation);else if(b.typeNo===25)crackedArt(b._x,b._y);else if(b.typeNo===26||b.typeNo===27)coloredSpringArt(b.typeNo,b._x,b._y,b.graphic.frame);else art(key,b._x,b._y,b.graphic.animation);ctx.restore();}
  if(flow.showPlayer&&!playback&&raceEnabled&&raceFrames?.length){const f=raceFrames[Math.min(stage.timer-1,raceFrames.length-1)];if(f){ctx.save();ctx.globalAlpha=.4;art('player'+f[2],f[0],f[1],f[3],f[4]<0);ctx.restore();}}
  if(flow.showPlayer){const p=stage.player;art('player'+p.action.frame,p._x,p._y,p.action.animation,p.fg<0);if(stage.run&&p.skullCursed)drawCurse(ctx,p,paintFrame);}
  for(const b of stage.blocks)if(b.typeNo===101||b.typeNo===103)drawElevator(ctx,b._x,b._y,b.typeNo===103);
  if(flow.showPlayer)for(const enemy of stage.hannyas)drawHannyaEnemy(ctx,enemy);
  if(flow.showPlayer)for(const ghost of stage.ghosts)drawGhost(ctx,ghost,paintFrame,3);
  for(const enemy of [stage.doppel,stage.doppelVariant])if(enemy?.active){if(!enemy.defeated&&flow.showPlayer){enemyArt(enemy.player);if(enemy.continuous)drawCurse(ctx,enemy.player,paintFrame);}if(enemy.deathFrame>0&&enemy.deathFrame<30)art('death'+enemy.deathFrame,enemy.deathPosition.x,enemy.deathPosition.y);}
  if(stage.darkChamber&&(['starting','playing','dying','over'].includes(flow.phase)||(!editor&&flow.phase==='title')))drawDarkChamber(ctx,stage);
  if(['exploration','exploration2'].includes(stage.mode)&&(['starting','playing','dying','over'].includes(flow.phase)||(!editor&&flow.phase==='title')))drawExploration(ctx,stage.exploration);
  // Checkpoint markers stay visible over the darkness, without lighting nearby blocks.
  if((stage.darkChamber||['exploration','exploration2'].includes(stage.mode))&&(['starting','playing','dying','over'].includes(flow.phase)||(!editor&&flow.phase==='title')))for(const b of stage.blocks)if(b.typeNo===99)drawCheckpoint(ctx,b._x,b._y,b.activated,b.raiseFrame/10,paintFrame);
  if(flow.phase==='title'&&!commentView){rect(0,0,480,448,'rgba(0,0,0,.5)',null);ctx.save();ctx.translate(2.95,9.1);ctx.save();ctx.beginPath();ctx.rect(-5,0,485,414);ctx.rect(130,414,350,40);ctx.clip();stageTitleArt();art('ui-space-'+(paintFrame%40+1),7.9,340.35);art('ui-crown-'+(paintFrame%30+1),243.95,123);ctx.restore();field('stage_name',stageId<0?'TEST':stageId,{offset:7.5});field('ranking',Array.from({length:10},(_,i)=>(i+1)+'  '+(meta['rt'+i]!==undefined?meta['rt'+i]+' loop ('+meta['rn'+i]+')':'-----------------')).join('\n'));field('play_count',Number(meta.pn||0)+Number(meta.retn||0));field('clear_num',meta.cn||0);field('dead_num',meta.dn||0);field('good',meta.good||0,{offset:-1});field('bad',meta.bad||0);field('432','← click to search');text('Comments ('+commentTotal+')',-1,417,16,'#dad5ed');text('Location: '+(meta.country||'--'),140,417,16,'white');ctx.restore();}
  if(flow.phase==='title'&&commentView){rect(0,0,480,448,'rgba(0,0,0,.5)',null);art('ui-comments',11,16.4);drawCommentArrowHover(ctx,hover);ctx.save();ctx.textAlign='center';text((commentPage+1)+' / '+Math.max(1,Math.ceil(commentTotal/7)),211.15,423.4,16,'white');ctx.restore();text(commentTotal+' Comments',258.15,423.4,16,'white');}
  if(flow.phase==='browse')rect(0,0,480,448,'rgba(0,0,0,.5)',null);
  if(flow.phase==='starting')rect(0,0,480,448,'rgba(0,0,0,'+flow.fadeAlpha+')',null);
  if(flow.phase==='dying')art('death'+flow.frame,stage.deathPosition.x,stage.deathPosition.y);
  if(flow.phase==='over'){art('over'+flow.frame+(voted&&flow.frame===11?'-voted':''),0,0);if(flow.frame===11){ctx.font='bold 20px \"Century Gothic\",\"BA Century\"';ctx.fillStyle='white';ctx.textBaseline='alphabetic';ctx.textAlign='center';animatedKey('space',131,165,64,26);animatedKey('tab',130.9,211,60,23);ctx.fillText('RETRY',238,185);spacedLabel('GO TO TITLE',262,228.25);ctx.textAlign='left';}}
  if(flow.phase==='clearing'||flow.phase==='clear'){ctx.save();ctx.scale(1,.93333435);art('clear'+flow.frame+(voted&&flow.frame===46?'-voted':''),0,0);if(flow.frame>=35){ctx.textAlign='center';text('TIME '+stage.timer+' loop',237.5,194,16);}if(flow.frame===46){ctx.font='bold 20px \"Century Gothic\",\"BA Century\"';ctx.fillStyle='white';ctx.textBaseline='alphabetic';ctx.textAlign='center';animatedKey('space',133,229,64,26);spacedLabel('GO TO TITLE',267,251);}ctx.restore();}
  ctx.restore();
 }
 if(editor){rect(128,0,480,32,colors.orange);ctx.strokeStyle='#252218';ctx.strokeRect(128.5,.5,478,30);ctx.save();ctx.font='13px Times New Roman,serif';ctx.fillStyle='black';ctx.textBaseline='top';ctx.fillText(String(stage.timer),510,8);ctx.fillText('loop',553,8);ctx.restore();rect(0,0,128,480,colors.orange);paletteText(palettePage===4?'Mode':palettePage===3?'Enemy (β)':'Blocks',38,6,16,'#252218');paletteButton('←',8,28,30);paletteText((palettePage+1)+'/5',49,33,16,'#252218');paletteButton('→',90,28,30);paintPalette();if(palettePage===3){for(const [i,[label,action,flag]] of enemyMenu.entries()){const y=enemyMenuY(i);rect(10,y,14,14,'white');if(stage[flag])paletteText('✓',10,y-3,17,'black');paletteText(label,29,y,13,'black');}}if(palettePage===4){for(const [i,mode] of ['normal','dark chamber','exploration','exploration2'].entries()){const y=83+i*40;ctx.beginPath();ctx.arc(17,y,7,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();ctx.strokeStyle='#252218';ctx.stroke();if(stage.mode===mode){ctx.beginPath();ctx.arc(17,y,3.5,0,Math.PI*2);ctx.fillStyle='#252218';ctx.fill();}paletteText(mode==='exploration'?'Exploration I':mode==='exploration2'?'Exploration II':mode,29,y-7,11,'black');}}const pos=visiblePalette()[palette];if(pos){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(pos.x-(palettePage===2?10:13),pos.y-(palettePage===2?10:13),palettePage===2?20:26,palettePage===2?20:26);}paletteButton(editingRun?'Stop':'Play',8,344,50);paletteButton('Show',63,344,50);paletteButton('SAVE',36,376,50);button('Back To Play',132,485,149);button('Clear All',289,485,149);}
 else{button('Create New Stage',132,485,149);button('Edit',388,485,51);button('Delete',444,485,51);button('Clear Ranking',500,485,100);}
 commentsEl.hidden=!(flow?.phase==='title'&&commentView&&!editor);
 for(const input of document.querySelectorAll('.game-input'))input.hidden=editor;
 if(stage)stateEl.textContent=editor?(editingRun?'Test play: blocks can be placed.':'Select blocks to place. Press Play to test.'):({browse:list.length?'Select a stage from the list.':'No stages yet. Choose Create New Stage.',title:'Press Space to start.',starting:'Starting...',playing:'Playing',dying:'You died.',over:flow.retryAvailable?'Space: retry / Tab: back to title':'Game over',clearing:'Stage clear',clear:'Press Space to return to title.'}[flow.phase]);
 document.getElementById('purify-stock').textContent=stage?.stock.purify||0;document.getElementById('ice-stock').textContent=stage?.stock.ice||0;document.getElementById('pick-stock').textContent=stage?.stock.pick||0;timeEl.textContent='TIME '+(stage?.timer||0)+' loop';canvas.style.cursor=cursorFor(hit(hover));updateSelectableFields();
 renderSamples.push(performance.now()-renderStart);if(renderSamples.length>120)renderSamples.shift();if(lastRenderInfoFrame<0||paintFrame-lastRenderInfoFrame>=10){lastRenderInfoFrame=paintFrame;compareInfo.textContent='描画平均 '+(renderSamples.reduce((a,b)=>a+b,0)/renderSamples.length).toFixed(2)+' ms';}
}
function point(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*608/r.width,y:(e.clientY-r.top)*512/r.height};}
function put(p){
 if(!editor||p.x<127.75||p.y<31||p.y>=479)return;
 const x=Math.floor((p.x-127.75)/.9984131/16),y=Math.floor((p.y-31)/16);
 if(x<0||x>=30)return;
 const cell=x+','+y+','+palette;if(lastPaintCell===cell)return;lastPaintCell=cell;
 if(editingRun)stage.replaceCell(x,y,palette||-1);
 else{const cells=[...stage.cells];cells[x*28+y]=palette||-1;stage=new Stage(cells,{mode:stage.mode,darkChamber:stage.darkChamber,hannyaII:stage.hannyaIIEnabled,ghostII:stage.ghostIIEnabled,hannya:stage.hannyaEnabled,ghost:stage.ghostEnabled,doppelganger:stage.doppelEnabled,doppelVariant:stage.doppelVariantEnabled});flow=new Presentation(stage,true);}
 persistDraft();paint();
}
canvas.addEventListener('pointerdown',async e=>{try{if(!stage||savingStage)return;canvas.focus();const p=point(e),action=hit(p);if(!action)return;if(editor){if(action==='palette-prev'||action==='palette-next'){palettePage=(palettePage+(action==='palette-next'?1:4))%5;if(palettePage<3&&!visiblePalette()[palette])palette=Number(Object.keys(visiblePalette())[0]);paint();return;}if(action.startsWith('mode-')){stage.setMode(action.slice(5));persistDraft();paint();return;}if(action==='ghost-ii-toggle'||action==='hannya-ii-toggle'){const kind=action.startsWith('ghost')?'ghost':'hannya';stage.setEnemyII(kind,!stage[kind+'IIEnabled']);persistDraft();paint();return;}if(action==='hannya-toggle'){stage.setHannya(!stage.hannyaEnabled);persistDraft();paint();return;}if(action==='ghost-toggle'){stage.setGhost(!stage.ghostEnabled);persistDraft();paint();return;}if(action==='enemy-toggle'||action==='enemy-variant-toggle'){const variant=action==='enemy-variant-toggle';stage.setDoppelganger(variant?!stage.doppelVariantEnabled:!stage.doppelEnabled,variant);persistDraft();paint();return;}if(p.x<128){for(const [id,{x,y}] of Object.entries(visiblePalette())){const n=Number(id);if(p.x>=x-(palettePage===2?10:13)&&p.x<=x+(palettePage===2?10:13)&&p.y>=y-(palettePage===2?10:13)&&p.y<=y+(palettePage===2?10:13)){palette=n;paint();return;}}if(action==='play'||action==='show'){if(action==='play'){if(editingRun){flow.back();editingRun=false;editorShow=false;}else start();}else{editorShow=!editorShow;}paint();return;}}if(action==='clear-all'){Key.held.clear();if(await confirmGame('Clear All','Remove all blocks from the canvas? This cannot be undone.')){stage=new Stage(Array(840).fill(-1),stageOptions());flow=new Presentation(stage,true);editingRun=false;editorShow=false;drawing=false;lastPaintCell=null;persistDraft();paint();}return;}if(action==='save'||action==='back'){if(action==='save'){flow.back();editingRun=false;editorShow=false;document.querySelector('#save [name=title]').value=meta.title||'';document.querySelector('#save [name=name]').value=meta.name||'';document.querySelector('#save [name=comment]').value=meta.comment||'';document.querySelector('#save [name=password]').value=editingPassword;document.getElementById('save-error').textContent='';openDialog('save');}else{await endEditor();}paint();return;}drawing=true;lastPaintCell=null;canvas.setPointerCapture(e.pointerId);put(p);return;}
 if(p.y>=480){
  if(p.x>=132&&p.x<281)beginEditor(true);
  else if(p.x>=388&&p.x<439){const password=document.getElementById('edit-password').value;const r=requireOK(await api('editMapLogin',{action_id:stageId,password}));if(r.pickup==='true'){notify(r.pickup_enabled==='true'?'Added to PickUp.':'Removed from PickUp.');await loadList(listQuery);}else if(r.login==='true'){editingPassword=password;beginEditor(false);}else notify('Incorrect password.');}
  else if(p.x>=444&&p.x<495){if(await confirmGame('Delete Stage','Delete this stage? This cannot be undone.')){const r=requireOK(await api('deleteMap',{action_id:stageId,password:document.getElementById('edit-password').value}));if(r.login!=='true')notify('Incorrect password.');else{await endEditor();if(list.length)await load(list[0]);}}}
  else if(p.x>=500&&p.x<600){if(await confirmGame('Clear Ranking','Clear all rankings for this stage? This cannot be undone.')){const r=requireOK(await api('clearRanking',{action_id:stageId,password:document.getElementById('edit-password').value}));if(r.login!=='true')notify('Incorrect password.');else{for(let i=0;i<10;i++){delete meta['rn'+i];delete meta['rt'+i];}notify('Ranking cleared.');}}}
  return;
 }
 if(p.x<128){if(p.y<64){sidebarPage=Math.max(0,Math.min(Math.ceil(list.length/13)-1,sidebarPage+(p.x<64?-1:1)));paint();}else{const id=list[sidebarPage*13+Math.floor((p.y-64)/32)];if(id)await load(id);}return;}
 if(p.y<32){if(p.x>=138&&p.x<180){await loadList({sortType:1});sidebarPage=0;paint();}else if(p.x>=188&&p.x<232){await loadList({sortType:6});sidebarPage=0;paint();}else if(p.x>=239&&p.x<=294){await loadList({sortType:10});sidebarPage=0;paint();}else if(p.x>=384&&p.x<=410)await searchId();else if(p.x>=575&&p.x<=601)await searchName();return;}
 if(flow.phase==='title'){if(commentView){if(action==='comment-prev'||action==='comment-next'){const next=commentPage+(action==='comment-prev'?-1:1);if(next>=0&&next<Math.ceil(commentTotal/7)){await loadComments(next);}}else if(p.y>448&&p.x<260)commentView=false;else if(p.y>448&&p.x>470)openDialog('comment-dialog');}else if(action==='comments'){commentView=true;await loadComments();}else if(action==='replay')start(false,true);else if(action==='start')start();else if(action==='author'){document.getElementById('search-name').value=meta.name||'';await searchName();}}
 else if(action==='vote'){requireOK(await api('evaluateConnection',{action_id:stageId,point:p.x<400?1:-1}));voted=true;meta[p.x<400?'good':'bad']=Number(meta[p.x<400?'good':'bad']||0)+1;}
 else if(flow.retryAvailable){if(p.y>=191&&p.y<=225)start(true);else if(p.y>=240&&p.y<=276){playback=null;flow.back();}}
 else if(flow.phase==='clear'&&p.y>=250&&p.y<=300){playback=null;flow.back();}
}catch(e){notify(e.message);}});
canvas.addEventListener('pointermove',e=>{hover=point(e);canvas.style.cursor=cursorFor(hit(hover));if(drawing)put(hover);});canvas.addEventListener('pointerleave',()=>{hover={x:-1,y:-1};canvas.style.cursor='default';});canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);
let playback=null,recording=new RaceRecording(),raceFrames=null,raceEnabled=false,runRevision='',raceEpoch=0;const secret=new SecretSequence();
function resetRace(){playback=null;raceEnabled=false;raceFrames=null;secret.index=0;raceEpoch++;}
document.addEventListener('keydown',e=>{if(e.target===canvas||e.keyCode!==9||e.repeat||!raceEnabled||flow?.phase!=='title'||commentView||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;e.preventDefault();start(false,true);});
const gameKeys=new Set([37,39,32,17,38,40,9]);
document.addEventListener('keydown',e=>{
 if(savingStage||editor||flow?.phase!=='title'||commentView||e.repeat||e.isComposing||(e.ctrlKey&&e.keyCode!==17&&e.keyCode!==9)||e.altKey||e.metaKey||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
 if(![38,40,37,39,66,65,17,9].includes(e.keyCode)){secret.index=0;return;}
 const ctrlHeld=e.ctrlKey||Key.held.has(17);
 const terminal=secret.index>=8&&(e.keyCode===17||(e.keyCode===9&&(secret.index===9||ctrlHeld)));
 if(terminal){e.preventDefault();if(e.keyCode===9)e.stopPropagation();}
 else if(e.keyCode!==17&&e.keyCode!==9)e.preventDefault();
 if(!secret.key(e.keyCode,ctrlHeld))return;
 const id=stageId,epoch=raceEpoch;
 api('loadReplay',{action_id:id}).then(r=>{
  if(epoch!==raceEpoch||id!==stageId||editor||flow?.phase!=='title')return;
  if(r.replay){raceFrames=JSON.parse(r.replay);raceEnabled=true;paint();}
  else notify('No first-place replay is available for this stage.');
 }).catch(()=>notify('Could not load the replay.'));
},{capture:true});
canvas.addEventListener('keydown',e=>{if(savingStage){e.preventDefault();return;}if(!stage||!gameKeys.has(e.keyCode))return;e.preventDefault();if(playback){if(e.keyCode===9||e.keyCode===32){playback=null;Key.held.clear();flow.back();paint();}return;}if(e.keyCode===9&&!e.repeat&&raceEnabled&&flow.phase==='title'&&!commentView){start(false,true);return;}if(e.keyCode===32&&!e.repeat){if((flow.phase==='title'&&!commentView)||flow.phase==='edit'){start();Key.held.add(32);return;}if(flow.retryAvailable){start(true);Key.held.add(32);return;}if(flow.phase==='clear'){flow.back();return;}}if(e.keyCode===9&&flow.titleAvailable){flow.back();paint();return;}Key.held.add(e.keyCode);});
canvas.addEventListener('keyup',e=>{Key.held.delete(e.keyCode);if(gameKeys.has(e.keyCode))e.preventDefault();});window.addEventListener('blur',()=>Key.held.clear());
async function searchId(){if(savingStage)return;const id=Number(document.getElementById('search-id').value);if(id>0){if(!await loadList({sortType:7,stage_id:id}))return;sidebarPage=0;await load(id);}}
async function searchName(){if(savingStage)return;if(!await loadList({sortType:5,name:document.getElementById('search-name').value}))return;sidebarPage=0;if(list.length)await load(list[0]);else paint();}
document.getElementById('search-id').onkeydown=e=>{if(e.key==='Enter')searchId();};document.getElementById('search-name').onkeydown=e=>{if(e.key==='Enter')searchName();};
function openDialog(id){const el=document.getElementById(id),r=canvas.getBoundingClientRect(),scale=r.width/608,save=id==='save';Object.assign(el.style,{position:'fixed',margin:'0',maxWidth:'none',width:(save?320:450)*scale+'px',left:r.left+(save?100:130)*scale+'px',top:r.top+(save?100:240)*scale+'px',fontSize:13*scale+'px'});el.querySelectorAll('input,textarea,button,label').forEach(f=>f.style.fontSize=13*scale+'px');el.showModal();}
async function loadComments(page=commentPage){
 const id=stageId,r=requireOK(await api('loadCommentList',{action_id:id,snum:page*7}));if(id!==stageId||!commentView)return;
 commentPage=page;commentTotal=Number(r.total);commentsEl.replaceChildren();
 const separator=()=>{const row=document.createElement('div');row.className='comment-separator';row.textContent='----------------------------------------------------------';commentsEl.append(row);};
 separator();
 if(!Number(r.count)){const row=document.createElement('div');row.className='comment-empty';row.textContent='no comment';commentsEl.append(row);separator();}
 for(let i=0;i<Number(r.count);i++){
  const item=document.createElement('article'),head=document.createElement('header'),identity=document.createElement('small'),body=document.createElement('p');
  head.textContent='name:'+r['name'+i]+'  '+r['create'+i]+'  ';identity.textContent=r['identity'+i]||'';head.append(identity);body.textContent=r['comment'+i]||' ';item.append(head,body);commentsEl.append(item);separator();
 }
 commentsEl.scrollTop=0;paint();
}
document.querySelector('#save form').addEventListener('input',e=>{if(['title','name','comment'].includes(e.target.name)){meta[e.target.name]=e.target.value;persistDraft();}});
for(const [button,id] of [['comment-close','comment-dialog'],['cancel','save'],['ranking-close','ranking-dialog']])document.getElementById(button).onclick=()=>document.getElementById(id).close();
installSingleLineFields();
async function submitForm(e,errorId,operation){e.preventDefault();const button=e.target.querySelector('[type=submit]');button.disabled=true;document.getElementById(errorId).textContent='';try{const values=Object.fromEntries(new FormData(e.target));for(const field of e.target.querySelectorAll('[data-single-line]')){field.value=singleLine(field.value);values[field.name]=field.value;}await operation(values);}catch(err){document.getElementById(errorId).textContent=err.message;}finally{button.disabled=false;}}
document.querySelector('#save form').onsubmit=e=>submitForm(e,'save-error',async values=>{
 Object.assign(meta,{title:values.title,name:values.name,comment:values.comment});persistDraft();
 const payload={...values,action_id:stageId,mapdata:stage.cells.join(','),mode:stage.mode,darkChamber:String(stage.darkChamber),hannyaII:String(stage.hannyaIIEnabled),ghostII:String(stage.ghostIIEnabled),hannya:String(stage.hannyaEnabled),ghost:String(stage.ghostEnabled),doppelganger:String(stage.doppelEnabled),doppelVariant:String(stage.doppelVariantEnabled),valid:'true'};
 savingStage=true;Key.held.clear();document.getElementById('save').close();notify('Saving...');
 let saved;
 try{saved=requireOK(await api('saveMapData',payload));}
 catch(error){notify('');openDialog('save');throw error;}
 finally{savingStage=false;}
 // Once saved, a failed refresh must not invite a duplicate submission.
 try{discardDraft(localStorage);}catch{}
 editingPassword=values.password;stageId=Number(saved.action_id);publishSelection();
 try{await loadList();await load(stageId);notify('Saved. Use the button below to copy the link.');}
 catch(error){notify('Stage No '+stageId+' has been saved. Reload the stage list.');}
});
document.querySelector('#comment-dialog form').onsubmit=e=>submitForm(e,'comment-error',async values=>{requireOK(await api('saveComment',{...values,action_id:stageId}));document.getElementById('comment-dialog').close();e.target.elements.comment.value='';commentPage=0;await loadComments();parent.postMessage({type:'stage-list-changed'},location.origin);});
document.querySelector('#ranking-dialog form').onsubmit=e=>submitForm(e,'ranking-error',async values=>{if(!scoreAttempt)return;const {id,time}=scoreAttempt;requireOK(await api('saveTimeAttack',{name:values.name,action_id:id,time,secure:(time*(id+24)+id)*3+32,revision:scoreAttempt.revision,replay:JSON.stringify(scoreAttempt.replay)}));document.getElementById('ranking-dialog').close();if(id===stageId){const r=requireOK(await api('loadMapData',{action_id:id}));for(let i=0;i<10;i++){delete meta['rn'+i];delete meta['rt'+i];if(r['rn'+i]!==undefined){meta['rn'+i]=r['rn'+i];meta['rt'+i]=r['rt'+i];}}}scoreAttempt=null;});
async function finishRun(){const id=stageId,time=stage.timer,serial=runSerial;try{const r=requireOK(await api('checkTimeAttack',{action_id:id,time}));if(id!==stageId||serial!==runSerial)return;meta.cn=Number(meta.cn||0)+1;scoreAttempt=Number(r.ranking)>0?{id,time,rank:Number(r.ranking),shown:false,revision:runRevision,replay:recording.payload()}:null;}catch(e){notify(e.message);}}
function resize(){const scale=Math.max(1,Math.min(3,(window.devicePixelRatio||1)*canvas.clientWidth/608));document.querySelectorAll('.game-input').forEach(input=>input.style.fontSize=(13*canvas.clientWidth/608)+'px');canvas.width=Math.round(608*scale);canvas.height=Math.round(512*scale);ctx.setTransform(canvas.width/608,0,0,canvas.height/512,0,0);commentsEl.style.fontSize=(16*canvas.clientWidth/608)+'px';paint();}window.addEventListener('resize',resize);resize();
const initialParams=new URLSearchParams(location.search);
try{await endEditor();const importNotice=importBookmarkLink(initialParams);const initialId=Number(initialParams.get('stage'));if(initialId>0)await load(initialId);else if(list.length)await load(list[0]);if(importNotice)notify(importNotice);}catch(e){notify(e.message);}
function tick(now){if(document.hidden){lastTick=now;accumulator=0;}else{accumulator+=Math.min(now-lastTick,250);lastTick=now;while(accumulator>=1000/33){paintFrame++;if(flow){const previousPhase=flow.phase;if(playback)playback.tick(flow);else flow.tick();if(!playback&&!editor&&previousPhase==='playing')recording.capture(stage);if(!playback&&!editor&&stageId>0&&previousPhase==='playing'&&flow.phase==='clearing')void finishRun();if(!playback&&!editor&&stageId>0&&previousPhase==='playing'&&['dying','over'].includes(flow.phase)){meta.dn=Number(meta.dn||0)+1;void api('addGameOverCount',{action_id:stageId}).catch(e=>notify(e.message));}if(!playback&&flow.phase==='clear'&&scoreAttempt&&!scoreAttempt.shown){scoreAttempt.shown=true;document.getElementById('ranking-message').textContent=scoreAttempt.rank+' / '+scoreAttempt.time+' loop';openDialog('ranking-dialog');}if(editor&&flow.phase==='edit'&&editingRun){editingRun=false;editorShow=false;}}accumulator-=1000/33;}paint();}requestAnimationFrame(tick);}requestAnimationFrame(tick);

window.addEventListener('ba-controller',e=>{
 const {code,down}=e.detail||{};if(!gameKeys.has(code))return;
 if(down&&document.activeElement!==canvas)canvas.focus({preventScroll:true});
 if(!down&&code===17&&secret.index===8&&!editor&&flow?.phase==='title'&&!commentView)canvas.dispatchEvent(new KeyboardEvent('keydown',{key:'Control',code:'ControlLeft',keyCode:17,which:17,bubbles:true,cancelable:true}));
 canvas.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{key:({9:'Tab',17:'Control',32:' ',37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown'})[code],code:({9:'Tab',17:'ControlLeft',32:'Space',37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown'})[code],keyCode:code,which:code,bubbles:true,cancelable:true}));
});
let resolveConfirmation=null;
function confirmGame(title,message){Key.held.clear();const dialog=document.getElementById('confirm-dialog');if(dialog.open)return Promise.resolve(false);document.getElementById('confirm-title').textContent=title;document.getElementById('confirm-message').textContent=message;return new Promise(resolve=>{resolveConfirmation=resolve;openDialog('confirm-dialog');});}
function endConfirmation(value){const resolve=resolveConfirmation;resolveConfirmation=null;document.getElementById('confirm-dialog').close();resolve?.(value);canvas.focus();}
document.getElementById('confirm-yes').onclick=()=>endConfirmation(true);
document.getElementById('confirm-no').onclick=()=>endConfirmation(false);
document.getElementById('confirm-dialog').addEventListener('cancel',e=>{e.preventDefault();endConfirmation(false);});
enableDialogDragging();
