import {GearBlock,updateGears} from './gear-block.mjs';
import {Hannya} from './hannya.mjs';
import {TOOL_BREAK_FRAMES} from './tool-break-art.mjs';
import {UNLOCK_FRAMES} from './key-art.mjs';
import {Exploration,playerCenter} from './exploration.mjs?v=timed-2s-45';
import {letterById} from './letter-block-types.mjs';
import {OrbitSpike} from './orbit-spike.mjs';
import {Ghost} from './ghost.mjs?v=enemy-ii-47';
import {Doppelganger} from './doppelganger.mjs?v=sync-48';
import {FallingTatami} from './falling-tatami.mjs';
import {TatamiBlock,PassageBlock,MetalPassageBlock,TATAMI_FRAMES,updatePassageBlock} from './traversal-blocks.mjs';
import * as classes from './original-classes.mjs';
import {Key,_root,Sprite} from './runtime.mjs';
import {GravityBlock} from './gravity-block.mjs?v=grounded-push-1';
export {Key,_root};
export const Player=classes.Player;
export const jellyColors={38:'red',39:'blue',43:'green'},switchPairs={40:['red','blue'],44:['blue','green'],45:['green','red']};
// Retain runtime type 15 so every original black-block collision rule is inherited.
const blockClasses=Array.from({length:24},(_,n)=>classes['Block'+n]);
for(const [id,letter] of Object.entries(letterById))blockClasses[id]=class extends classes.Block15 {init(){super.init();this.letterSymbol=letter;}};
blockClasses[100]=GearBlock;
for(const id of [101,103])blockClasses[id]=class extends classes.Block7 {init(){super.init();this.typeNo=id;this.wall=false;this.object_wall=false;this.stopper=false;this.call=false;}};
blockClasses[98]=class extends classes.Block1 {init(){super.init();this.typeNo=98;}};
blockClasses[99]=class extends classes.Block7 {init(){super.init();this.typeNo=99;this.stopper=false;this.activated=false;this.raiseFrame=0;}};
blockClasses[46]=OrbitSpike;blockClasses[24]=GravityBlock;blockClasses[41]=FallingTatami;
for(const [n,base] of [[38,classes.Block2],[39,classes.Block5],[43,classes.Block2]])blockClasses[n]=class extends base {
 init(){super.init();this.typeNo=n;this.speed=0;this.px=this._x;this.py=this._y;this.solid=false;this.object_wall=false;}
 callObject(...args){if(this.solid)super.callObject(...args);}
};
blockClasses[42]=class extends classes.Block1 {init(){super.init();this.typeNo=42;this.kickdisable=true;}};
for(const n of [40,44,45])blockClasses[n]=class extends classes.Block1 {init(){super.init();this.typeNo=n;}};
const originalHitMoveV=Player.prototype.hitMoveVBlock;
Player.prototype.hitMoveVBlock=function(x,y,d,b){const landed=originalHitMoveV.call(this,x,y,d,b);if((b?.typeNo===39||b?.typeNo===41)&&landed&&d===0)this.py+=this._parent.moveBlockSpeed*this.fg;return landed;};
blockClasses[36]=class extends classes.Block7 {init(){super.init();this.typeNo=36;this.stopper=false;this.collected=false;}};
blockClasses[37]=class extends classes.Block1 {init(){super.init();this.typeNo=37;this.unlocked=false;this.unlockFrame=0;}};
for(const n of [34,35,47])blockClasses[n]=class extends classes.Block7 {init(){super.init();this.typeNo=n;this.collected=false;}};
for(const n of [32,33])blockClasses[n]=class extends classes.Block7 {init(){super.init();this.typeNo=n;}};
blockClasses[30]=TatamiBlock;blockClasses[31]=PassageBlock;blockClasses[102]=MetalPassageBlock;
blockClasses[28]=class extends classes.Block15 {init(){super.init();this.typeNo=28;this.awake=false;this.vanished=false;this.shrinkFrame=0;}};
blockClasses[29]=class extends classes.Block1 {init(){super.init();this.typeNo=29;this.awake=false;}};
blockClasses[25]=class extends classes.Block1 {init(){super.init();this.typeNo=25;this.broken=false;}};
// Original spring compression is 8px. These scales give uncompressed-surface
// apex heights of exactly 48px / 112px with the original discrete physics.
for(const [n,scale] of [[26,38/99],[27,37/24]])blockClasses[n]=class extends classes.Block18 {
 init(){super.init();this.typeNo=n;}
 touchBlock(fg,player){return super.touchBlock(fg,player)*scale;}
};
for(let n=20;n<=23;n++)blockClasses[n]=class extends classes.Block15 {init(){super.init();this.typeNo=n;}};
const originals=[Player.prototype.upWall,Player.prototype.downWall,Player.prototype.rightWall,Player.prototype.leftWall];
const originalTouch=Player.prototype.touchWall;
const originalCheckKey=Player.prototype.checkKey;
const originalLanding=Player.prototype.landing;
const originalCommonWall=Player.prototype.commonWall;
Player.prototype.commonWall=function(tx,ty,dx,dy){
 this._parent.activateCheckpoint(this._parent.cell(tx,ty));
 originalCommonWall.call(this,tx,ty,dx,dy);
 const b=this._parent.cell(tx,ty);
 if(b?.typeNo===32&&!this._parent.pendingWarp)this._parent.pendingWarp=b;
};
Player.prototype.landing=function(object){
 originalLanding.call(this,object);
 if(object?.typeNo===41)object.arm(this.fg);
 if(object?.typeNo===30&&!object.vanished)object.fading=true;
 if(object?.typeNo===26||object?.typeNo===27)this.jump_charge=object.touchBlock(this.fg,this);
};
// Keep the curse through a jump launched from a skull, until another landing.
export function standingOnSkull(p,b){
 if(!p?.landed||b?.typeNo!==42)return false;
 const s=p._parent.square_size,foot=p.fg>0?p.py:p.py-p.ph;
 return p.px+1<b._x+s&&p.px+p.pw-1>b._x&&Math.abs(foot-(p.fg>0?b._y-s:b._y))<.01;
}
function skullUnderfoot(p){
 const s=p._parent.square_size,foot=p.fg>0?p.py:p.py-p.ph;
 const row=Math.floor((foot+(p.fg>0?0:-1))/s);
 for(let x=Math.floor((p.px+1)/s);x<=Math.floor((p.px+p.pw-1)/s);x++){
  const b=p._parent.cell(x,row);
  if(b?.typeNo===42&&Math.abs(foot-(p.fg>0?b._y-s:b._y))<.01)return true;
 }
 return false;
}
Player.prototype.checkKey=function(){
 if(this._parent.run&&this._parent.elevatorUnderPlayer(this)){
  this.landed=true;this.on_ice=false;this.slipped=false;
 }
 const standing=this.landed&&skullUnderfoot(this);
 if(this.landed)this.skullJump=false;
 this.skullCursed=standing||!!this.skullJump;
 if(this.skullCursed)this.kickableDir=0;
 const normalJump=this.jump_speed,canJump=this.jumpable;
 if(this.skullCursed){this.jump_speed=11.3;this.jump_charge=0;}
 const targets=this.crackedKickTargets||[],kickDir=this.kickableDir;
 const insideElevator=this._parent.run&&this._parent.elevatorUnderPlayer(this);
 if(insideElevator)this.jumpable=false;
 try{originalCheckKey.call(this);}finally{if(insideElevator)this.jumpable=canJump;}
 const elevator=this._parent.run?this._parent.elevatorUnderPlayer(this):null;
 if(elevator){
  this.elevatorRideBlock=elevator;this.pg=0;this.dy=0;this.vy=0;this.jumped=false;this.climbing=false;this.ladderTouch=0;
  if(this.dir_keyY!==0){
   if(this._parent.centerElevatorRider(elevator,this)){
    this.dx=this.vx=0;this.dir_keyX=0;
    this._parent.moveElevator(elevator,this,this.dir_keyY*this.fg*this._parent.elevatorSpeed);
   }
   this.dir_keyY=0;
  }
 }else this.elevatorRideBlock=null;
 this.jump_speed=normalJump;
 if(standing&&canJump&&this.ONCE_SPACE)this.skullJump=true;
 // The original sets FIX_TIME on an actual wall kick and decrements it otherwise.
 if(kickDir&&this.fix_timer===this.FIX_TIME)for(const target of targets)if(target.dir===kickDir)this._parent.breakBlock(target.block);
 this.crackedKickTargets=[];
};
const originalElevatorCharaAction=Player.prototype.setCharaAction;
Player.prototype.setCharaAction=function(Action){
 originalElevatorCharaAction.call(this,Action);
 // Riding is standing in a cabin; preserve normal ladder and death handling.
 if(this.elevatorRideBlock&&this.dx===0&&this._parent.status==='playing')Action.gotoAndStop(1);
};
const originalElevatorCheckMove=Player.prototype.checkMove;
Player.prototype.checkMove=function(){
 originalElevatorCheckMove.call(this);
 // Catch side entry before gravity and the original world collision checks.
 if(this._parent.run)this._parent.prepareElevatorEntry(this);
};
const originalElevatorWallCheck=Player.prototype.wallCheck;
Player.prototype.wallCheck=function(){
 originalElevatorWallCheck.call(this);
 if(this._parent.status==='playing')this._parent.collideElevatorVertical(this);
};
function halfTouch(p,tx,ty,kind){
 const s=p._parent.square_size,x=tx*s,y=ty*s;
 if(kind===20)return p.py+p.dy-1>=y&&p.py+p.dy-p.ph+1<y+s/2;
 if(kind===21)return p.py+p.dy-1>=y+s/2&&p.py+p.dy-p.ph+1<y+s;
 if(kind===22)return p.px+p.pw-1>=x+s/2&&p.px+1<x+s;
 return p.px+p.pw-1>=x&&p.px+1<x+s/2;
}
function halfWall(p,tx,ty,dir){
 const block=p._parent.cell(tx,ty),kind=block?.typeNo;
 if(switchPairs[kind]&&p._parent.run){
  if(dir===1&&p.dy>=0)p._parent.setColor(switchPairs[kind][0]);
  else if(dir===0&&p.dy<=0)p._parent.setColor(switchPairs[kind][1]);
 }
 // Consume before the original collision response can stop or land the player.
 if(p._parent.collectKey(block)||p._parent.useTool(block))return;
 if(kind===25){
  const head=(dir===0&&p.fg>0&&p.dy<0&&(!p.climbing||p.fg*p.dir_keyY<0))||(dir===1&&p.fg<0&&p.dy>0&&(!p.climbing||p.fg*p.dir_keyY>0));
  originals[dir].call(p,tx,ty);
  if(head){p.vy=0;p._parent.breakBlock(block);}
  else if(dir>=2)(p.crackedKickTargets??=[]).push({block,dir:dir===2?-1:1});
  return;
 }
 if(!(kind>=20&&kind<=23)){originals[dir].call(p,tx,ty);return;}
 const black=(kind===20&&dir===0)||(kind===21&&dir===1)||(kind===22&&dir===2)||(kind===23&&dir===3);
 const spike=(kind===20&&dir===1)||(kind===21&&dir===0)||(kind===22&&dir===3)||(kind===23&&dir===2);
 if(!black&&(spike||halfTouch(p,tx,ty,kind))){p._parent.dead(p.px,p.py);return;}
 originals[dir].call(p,tx,ty);
}
['upWall','downWall','rightWall','leftWall'].forEach((name,dir)=>Player.prototype[name]=function(tx,ty){halfWall(this,tx,ty,dir);});
Player.prototype.touchWall=function(tx,ty,dx,dy){const block=this._parent.cell(tx,ty),kind=block?.typeNo;if(kind===3)block.revealed=true;if(kind===29)this._parent.awakenMoai();if(!(kind>=20&&kind<=23))originalTouch.call(this,tx,ty,dx,dy);};
export class Stage {
 constructor(cells,options={}){
  this.mode=['normal','dark chamber','exploration','exploration2'].includes(options.mode)?options.mode:options.darkChamber?'dark chamber':'normal';this.darkChamber=this.mode==='dark chamber';this.hannyaIIEnabled=!!options.hannyaII;this.ghostIIEnabled=!!options.ghostII;this.hannyaEnabled=!!options.hannya;this.ghostEnabled=!!options.ghost;this.doppelEnabled=!!options.doppelganger;this.doppelVariantEnabled=!!options.doppelVariant;
  Object.assign(this,{gravity:8,square_size:16,resistX:1.5,resistY:9,ICE_RESIST:1.05,moveBlockSpeed:2,elevatorSpeed:2,xsize:30,ysize:28,scx:480,scy:448,run:false,status:'ready',objArr:[],blocks:[]});
  this.cells=[...cells];this.mapArr=Array.from({length:30},()=>Array(28).fill(-1));this.player=new Player();this.player._parent=this;this.player.action=new Sprite();
  for(let x=0;x<30;x++)for(let y=0;y<28;y++)if(cells[x*28+y]>0){
   const n=cells[x*28+y],b=new blockClasses[n]();b._parent=this;b.graphic=new Sprite();b.ox=x*16;b.oy=(y+1)*16;b.init();this.blocks.push(b);this.mapArr[x][y]=b;if(b.call)this.objArr.push(b);
  }
  this.reset();
 }
 cell(x,y){return this.mapArr[x]?.[y];}
 elevatorUnderPlayer(player){
  const b=player.elevatorRideBlock;
  if(!b||!this.blocks.includes(b))return null;
  const left=player.px+1,right=player.px+(player.pw||8)-1;
  return right>=b._x&&left<b._x+16&&player.py-1>b._y-16&&player.py-(player.ph||16)+1<b._y?b:null;
 }
 elevatorGroundContact(elevator,fg=1){
  const edge=fg>0?elevator._y:elevator._y-16;
  return this.blocks.some(b=>b!==elevator&&![101,103].includes(b.typeNo)&&!b.broken&&!b.collected&&!b.unlocked&&b.solid!==false&&(b.wall||b.call||b.typeNo===4)&&b._x<elevator._x+16&&b._x+16>elevator._x&&Math.abs(edge-(fg>0?b._y-16:b._y))<.000001);
 }
 releaseElevatorSupport(player){
  player.elevatorRideBlock=null;player.landed=false;player.jumpable=false;player.on_ice=false;player.slipped=false;
  const foot=player.fg>0?player.py:player.py-player.ph;
  for(const b of this.blocks){
   if([101,103].includes(b.typeNo)||b.broken||b.collected||b.unlocked||b.solid===false||player.px+player.pw-1<b._x||player.px+1>=b._x+16||Math.abs(foot-(player.fg>0?b._y-16:b._y))>.000001)continue;
   if(b.call){player.hitMoveVBlock(b._x,b._y,0,b);}
   else if(b.wall){const x=Math.floor(b._x/16),y=Math.floor((b._y-16)/16);if(player.fg>0)player.downWall(x,y);else player.upWall(x,y);}
  }
  player.jumpable=player.landed||player.climbing;
 }
 prepareElevatorEntry(player){
  if(this.elevatorUnderPlayer(player))return;
  const width=player.pw||8,height=player.ph||16;
  const left=player.px+1,right=player.px+width-1;
  const vertical=player.dy+player.fg*player.pg;
  // The elevator's own floor receives a descending side entrant before the
  // original static-block checks can sample the tile below. Never grab below.
  const floor=this.blocks.find(b=>[101,103].includes(b.typeNo)&&
   (player.fg>0?vertical>=0&&player.py>b._y-16&&player.py<=b._y&&player.py+vertical>=b._y:
    vertical<=0&&player.py-height>=b._y-16&&player.py-height<b._y&&player.py-height+vertical<=b._y-16)&&
   ((right>=b._x&&left<b._x+16)||
    (right+player.dx>=b._x&&left+player.dx<b._x+16)));
  const center=player.px+width/2,nextCenter=center+player.dx;
  const sideEntry=floor&&((center<=floor._x+1&&nextCenter>floor._x)||(center>=floor._x+15&&nextCenter<floor._x+16));
  // An airborne side entrant may reach the cabin floor during this step.
  // This is cabin support, not immunity from blocks below the cabin.
  if(floor&&(this.elevatorGroundContact(floor,player.fg)||sideEntry)){
   player.elevatorRideBlock=floor;player.dy=floor._y-player.py;
   player.pg=player.vy=0;player.climbing=false;player.ladderTouch=0;
   return;
  }
  if(!player.dx)return;
  const b=this.blocks.find(b=>[101,103].includes(b.typeNo)&&
   player.py-height+1>=b._y-16&&player.py-1<=b._y&&
   ((player.dx>0&&right<=b._x&&right+player.dx>=b._x)||
    (player.dx<0&&left>=b._x+16&&left+player.dx<b._x+16)));
  if(!b)return;
  player.elevatorRideBlock=b;player.py=b._y;
  player.pg=player.dy=player.vy=0;player.climbing=false;player.ladderTouch=0;
 }
 collideElevatorVertical(player){
  if(player.elevatorRideBlock){
   player.landing({typeNo:101,stopper:true});player.climbing=false;player.ladderTouch=0;
   return;
  }
  // Resolve contact in the same phase as normal walls, before animation and
  // position updates. This preserves native walking, dash and jump timing.
  const overlaps=b=>[101,103].includes(b.typeNo)&&player.px+player.pw-1>=b._x&&player.px+1<b._x+16;
  let b,landed=false;
  if(player.dy>=0){
   b=this.blocks.filter(b=>overlaps(b)&&player.py<=b._y-16&&player.py+player.dy>=b._y-16).sort((a,b)=>a._y-b._y)[0];
   if(b){player.py=b._y-16;if(player.fg>0)landed=true;}
  }else{
   b=this.blocks.filter(b=>overlaps(b)&&player.py-player.ph>=b._y&&player.py-player.ph+player.dy<=b._y).sort((a,b)=>b._y-a._y)[0];
   if(b){player.py=b._y+player.ph;if(player.fg<0)landed=true;}
  }
  if(!b)return;
  player.dy=0;
  if(landed){player.landing({typeNo:101,stopper:true});player.climbing=false;player.ladderTouch=0;}
  else player.vy=0;
 }
 boardElevator(from,player){
  if(this.elevatorUnderPlayer(player))return;
  const width=player.pw||8,height=player.ph||16,oldCenter=from.px+width/2,center=player.px+width/2;
  player.elevatorRideBlock=this.blocks.find(b=>[101,103].includes(b.typeNo)&&
   player.py-height+1>=b._y-16&&player.py-1<=b._y&&
   center>b._x+1&&center<b._x+15&&
   ((oldCenter<=b._x+1&&center>oldCenter)||(oldCenter>=b._x+15&&center<oldCenter)))??null;
  if(player.elevatorRideBlock){player.py=player.elevatorRideBlock._y;player._y=player.py-(player.fg<0?height:0);}
 }
 centerElevatorRider(block,player){
  if(player.fg!==(block.typeNo===103?-1:1))return false;
  const width=player.pw||8;
  // Control starts only after the whole body is inside the side opening.
  if(player.px<block._x||player.px+width>block._x+16)return false;
  player.px=player._x=block._x+(16-width)/2;
  return true;
 }
 moveElevator(block,player,delta){
  if(player.fg!==(block.typeNo===103?-1:1))return false;
  const top=block._y-16,nextTop=top+delta,nextBottom=nextTop+16;
  if(nextTop<0||nextBottom>this.scy)return false;
  // Elevators are the sole moving-block exception: use their live positions,
  // because the authored map cells stay at the original positions.
  const sweepTop=Math.min(top,nextTop),sweepBottom=Math.max(block._y,nextBottom);
  for(const other of this.blocks){
   if(other===block||![101,103].includes(other.typeNo))continue;
   if(block._x<other._x+16&&block._x+16>other._x&&sweepTop<other._y&&sweepBottom>other._y-16)return false;
  }
  const playerTop=player.py-player.ph+delta+1,playerBottom=player.py+delta-1;
  for(let x=Math.floor(block._x/16);x<=Math.floor((block._x+15)/16);x++)for(let y=0;y<this.ysize;y++){
   const other=this.cell(x,y);if(!other||other===block||(!other.wall&&![4,9].includes(other.typeNo)))continue;
   const ox=x*16,oy=y*16;
   if(block._x<ox+16&&block._x+16>ox&&nextTop<oy+16&&nextBottom>oy)return false;
   if(player.px+player.pw-1>ox&&player.px+1<ox+16&&playerTop<oy+16&&playerBottom>oy)return false;
  }
  block._y+=delta;block.py=block._y;player.py+=delta;
  return true;
 }
 get goalUnlocked(){return this.blocks.every(b=>b.typeNo!==99||b.activated);}
 activateCheckpoint(block){if(this.run&&block?.typeNo===99&&!block.activated){block.activated=true;block.raiseFrame=0;}}
 replaceCell(x,y,type){
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>=this.xsize||y<0||y>=this.ysize) return;
  if(type!==-1&&!blockClasses[type])return;
  // Authored cells identify blocks by origin, regardless of runtime movement/removal.
  const removed=this.blocks.filter(b=>b.ox===x*16&&b.oy===(y+1)*16);
  const obsolete=new Set(removed);
  this.blocks=this.blocks.filter(b=>!obsolete.has(b));
  this.objArr=this.objArr.filter(b=>!obsolete.has(b));
  this.player.crackedKickTargets=(this.player.crackedKickTargets||[]).filter(t=>!obsolete.has(t.block));
  if(obsolete.has(this.pendingWarp))this.pendingWarp=null;
  this.cells[x*this.ysize+y]=type;this.mapArr[x][y]=-1;
  if(type===-1)return;
  const b=new blockClasses[type]();b._parent=this;b.graphic=new Sprite();
  b.ox=x*16;b.oy=(y+1)*16;b._x=b.ox;b._y=b.oy;b.init();b.frame=2;
  if(jellyColors[type]){b.solid=jellyColors[type]===this.colorMode;b.object_wall=false;}
  this.blocks.push(b);this.mapArr[x][y]=b;
  if(b.call){this.objArr.push(b);this.objArr.sort((a,b)=>a.py<b.py?-1:a.py>b.py?1:0);}
 }
 setColor(color){
  if(this.colorMode===color)return;
  this.colorMode=color;this.colorAnimation=0;
  for(const b of this.blocks)if(jellyColors[b.typeNo]){b.solid=jellyColors[b.typeNo]===color;b.object_wall=false;}
 }
 collectKey(key){
  if(!this.run||key?.typeNo!==36||key.collected)return false;
  key.collected=true;
  for(const b of [key,...this.blocks.filter(b=>b.typeNo===37)]){
   if(b!==key){b.unlocked=true;b.unlockFrame=0;}
   b.wall=false;b.object_wall=false;
   const x=b.ox/16,y=b.oy/16-1;
   if(this.cell(x,y)===b)this.mapArr[x][y]=-1;
  }
  return true;
 }
 useTool(block){
  if(!this.run||!block||block.toolBroken||block.collected)return false;
  const kind=block.typeNo;
  if(kind===42&&this.stock.purify){this.stock.purify--;classes.Block15.prototype.init.call(block);block.typeNo=15;block.purified=true;this.player.skullJump=false;this.player.skullCursed=false;return false;}
  if(kind===34||kind===35||kind===47){
   this.stock[kind===47?'purify':kind===34?'ice':'pick']++;
   block.collected=true;
  }else{
   const tool=kind===8?'ice':kind===1||kind===25||kind===37?'pick':null;
   if(!tool||!this.stock[tool])return false;
   this.stock[tool]--;block.toolBroken=true;block.toolFade=0;block.toolGravity=this.player.fg;
  }
  block.wall=false;block.object_wall=false;
  if(this.cell(block.ox/16,block.oy/16-1)===block)this.mapArr[block.ox/16][block.oy/16-1]=-1;
  return true;
 }
 breakBlock(block){
  if(block?.typeNo!==25||block.broken)return;
  block.broken=true;block.wall=false;block.object_wall=false;
  const x=block.ox/16,y=block.oy/16-1;
  if(this.cell(x,y)===block)this.mapArr[x][y]=-1;
 }
 awakenMoai(){
  if(this.moaiAwake)return;
  this.moaiAwake=true;
  for(const b of this.blocks)if(b.typeNo===28||b.typeNo===29){
   b.awake=true;
   if(b.typeNo===28){
    b.vanished=true;b.shrinkFrame=0;b.wall=false;b.object_wall=false;
    const x=b.ox/16,y=b.oy/16-1;
    if(this.cell(x,y)===b)this.mapArr[x][y]=-1;
   }
  }
 }
 warpPlayer(source){
  let nearest=null,best=Infinity;
  // Original map order: x ascending, then y ascending. <= chooses last tie.
  for(let x=0;x<this.xsize;x++)for(let y=0;y<this.ysize;y++){
   const b=this.cell(x,y);if(b?.typeNo!==33)continue;
   const d=(x-source.ox/16)**2+(y-(source.oy/16-1))**2;
   if(d<=best){best=d;nearest=b;}
  }
  if(!nearest)return false;
  const p=this.player;p.px=nearest.ox+4;p.py=nearest.oy;p._x=p.px;p._y=p.fg<0?p.py-16:p.py;
  p.elevatorRideBlock=null;p.landed=false;p.jumpable=false;p.climbing=false;p.ladderTouch=0;p.kickableDir=0;p.crackedKickTargets=[];
  for(const b of this.blocks)if([31,102].includes(b.typeNo))b.entryFace=null;
  return true;
 }
 advanceEffects(){
  this.doppel?.tickDeath();this.doppelVariant?.tickDeath();
  for(const enemy of this.hannyas)enemy.tickDeath();
  for(const ghost of this.ghosts)ghost.tickDeath();
  for(const b of this.blocks){
   if(b.typeNo===99&&b.activated)b.raiseFrame=Math.min(10,b.raiseFrame+1);
   if(b.unlocked)b.unlockFrame=Math.min(UNLOCK_FRAMES,b.unlockFrame+1);
   if(b.toolBroken)b.toolFade=Math.min(TOOL_BREAK_FRAMES,b.toolFade+1);
   if(b.typeNo===28&&b.vanished)b.shrinkFrame=Math.min(8,b.shrinkFrame+1);
   if(b.typeNo===30&&b.fading&&!b.vanished){
    if(++b.fadeFrame>=TATAMI_FRAMES){
     b.vanished=true;b.wall=false;b.object_wall=false;
     if(this.cell(b.ox/16,b.oy/16-1)===b)this.mapArr[b.ox/16][b.oy/16-1]=-1;
    }
   }
  }
 }
 // Discovery lasts for this Stage instance; editor Show always controls its own view.
 blockFrame(block,editor=false,show=false){return editor?(show?2:1):block.typeNo===3&&block.revealed?1:2;}
 reset(){
  this.doppel=null;this.doppelVariant=null;this.ghosts=[];this.hannyas=[];this.enemyIISpawned=false;
  this.stock={ice:0,pick:0,purify:0};this.colorMode=null;this.colorAnimation=0;
  this.gearContacts=new Set();this.pendingWarp=null;this.moaiAwake=false;this.timer=0;_root.game.timer=0;_root.game.gameStage=this;this.gravity=Math.abs(this.gravity);this.status='ready';this.run=false;
  for(const b of this.blocks){if(b.broken||b.vanished||b.toolBroken||b.collected||b.unlocked)this.mapArr[b.ox/16][b.oy/16-1]=b;b.toolBroken=false;b.toolFade=0;b.toolGravity=1;b.collected=false;}
  const p=this.player;p.init();p.elevatorRideBlock=null;p.skullJump=false;p.skullCursed=false;p.crackedKickTargets=[];p.px=0;p.py=16;p._x=0;p._y=16;p._visible=true;p.frame=1;
  for(let x=0;x<30;x++)for(let y=0;y<28;y++){const b=this.mapArr[x][y];if(b===-1)continue;b.init();b.frame=2;if(b.typeNo===6){p.px=x*16;p.py=(y+1)*16;p._x=p.px;p._y=p.py;}}
  this.objArr.sort((a,b)=>a.py<b.py?-1:a.py>b.py?1:0);
  this.resetExploration();
 }
 resetExploration(){const {x,y}=playerCenter(this.player);this.exploration=new Exploration(x,y,this.mode==='exploration2');}
 setMode(mode){if(!['normal','dark chamber','exploration','exploration2'].includes(mode))return;this.mode=mode;this.darkChamber=mode==='dark chamber';this.resetExploration();}
 setEnemyII(kind,enabled){this[kind+'IIEnabled']=!!enabled;const list=kind==='ghost'?'ghosts':'hannyas';this[list]=this[list].filter(e=>!e.variant);if(this.run&&this.enemyIISpawned&&enabled)this.spawnEnemyII(kind);}
 spawnEnemyII(kind){for(const b of this.blocks.filter(b=>b.typeNo===6)){const e=kind==='ghost'?new Ghost(this,b):new Hannya(this,b);e.variant=true;this[kind==='ghost'?'ghosts':'hannyas'].push(e);}}
 checkEnemyII(){if(this.enemyIISpawned)return;const p=playerCenter(this.player);if(this.timer<100&&Math.hypot(p.x-this.enemyIIOrigin.x,p.y-this.enemyIIOrigin.y)<96)return;this.enemyIISpawned=true;if(this.ghostIIEnabled)this.spawnEnemyII('ghost');if(this.hannyaIIEnabled)this.spawnEnemyII('hannya');}
 setHannya(enabled){this.hannyaEnabled=!!enabled;this.hannyas=[...this.hannyas.filter(e=>e.variant),...(enabled&&this.run?this.blocks.filter(b=>b.typeNo===7).map(b=>new Hannya(this,b)):[])];}
 setGhost(enabled){this.ghostEnabled=!!enabled;this.ghosts=[...this.ghosts.filter(e=>e.variant),...(enabled&&this.run?this.blocks.filter(b=>b.typeNo===7).map(b=>new Ghost(this,b)):[])];}
 setDoppelganger(enabled,variant=false){if(variant){this.doppelVariantEnabled=!!enabled;this.doppelVariant=enabled?new Doppelganger(this,true):null;}else{this.doppelEnabled=!!enabled;this.doppel=enabled?new Doppelganger(this):null;}}
 start(){this.enemyIISpawned=false;this.enemyIIOrigin=playerCenter(this.player);this.hannyas=this.hannyaEnabled?this.blocks.filter(b=>b.typeNo===7).map(b=>new Hannya(this,b)):[];this.ghosts=this.ghostEnabled?this.blocks.filter(b=>b.typeNo===7).map(b=>new Ghost(this,b)):[];this.doppel=this.doppelEnabled?new Doppelganger(this):null;this.doppelVariant=this.doppelVariantEnabled?new Doppelganger(this,true):null;this.run=true;this.status='playing';}
 random(){const value=this.replayRandomSource?this.replayRandomSource.shift()??.5:Math.random();this.replayRandom.push(value);return value;}
 step(frame=null){
  const held=Key.held,p=this.player,checkKey=p.checkKey,checkMove=p.checkMove;
  this.replayInput=keyCodes.reduce((mask,key,i)=>mask|(held.has(key)?1<<i:0),0);this.replayRandom=[];
  this.replayRandomSource=frame?.[6]?[...frame[6]]:null;this.replaying=!!frame;
  if(frame){
   if(frame.length>=7)setMask(frame[5]);
   else {Key.held=new Set();p.checkKey=function(){this.dx=frame[0]-this.px;this.dy=frame[1]+(frame[4]<0?16:0)-this.py-this.fg*this.pg;};p.checkMove=function(){};}
  }
  try{this.stepWorld();if(frame){p.px=p._x=frame[0];p.fg=frame[4];p._y=frame[1];p.py=frame[1]+(p.fg<0?16:0);p.action.gotoAndStop(frame[2]);p.action.animation=frame[3];p._visible=true;}}
  finally{Key.held=held;p.checkKey=checkKey;p.checkMove=checkMove;this.replaying=false;this.replayRandomSource=null;}
 }
 stepWorld(){
  if(!this.run)return;
  const elevatorSupportBefore=this.elevatorUnderPlayer(this.player);
  const before={px:this.player.px,py:this.player.py},moversBefore=new Map(this.objArr.map(b=>[b,{x:b._x,y:b._y}]));
  _root.game.gameStage=this;_root.game.timer=this.timer;this.player.callObject(this.player.action);this.timer=_root.game.timer;
  if(this.status==='playing'&&elevatorSupportBefore&&!this.elevatorUnderPlayer(this.player))this.releaseElevatorSupport(this.player);
  if(this.status==='playing')this.boardElevator(before,this.player);
  const warp=this.pendingWarp;this.pendingWarp=null;
  const warped=warp&&this.status==='playing'&&this.warpPlayer(warp);
  if(this.status==='playing')updateGears(this,before,this.player,!!warped);
  if(this.mode==='exploration'||this.mode==='exploration2'){const {x,y}=playerCenter(this.player);this.exploration.move(x,y);}
  if(!warped)for(const b of this.blocks)if([31,102].includes(b.typeNo))updatePassageBlock(b,before,this.player);
  for(const b of this.blocks){if(b.graphic.playing)b.graphic.animation++;}
  this.player.action.animation++;this.colorAnimation++;this.advanceEffects();
  if(this.status==='playing'){this.checkEnemyII();this.doppel?.update(before,!!warped,moversBefore);if(this.status==='playing')this.doppelVariant?.update(before,!!warped,moversBefore);for(const ghost of this.ghosts)if(this.status==='playing')ghost.update();for(const enemy of this.hannyas)if(this.status==='playing')enemy.update();}
 }
 dead(x=this.player.px,y=this.player.py){if(this.replaying)return;this.run=false;this.status='dead';this.player._visible=false;this.deathAnimation=true;this.deathPosition={x,y};}
 gameOver(){this.dead();this.deathAnimation=false;}
 goal(){if(this.replaying)return;if(!this.goalUnlocked)return;this.run=false;this.status='clear';}
 snapshot(){const p=this.player;return [p.px,p.py,p.dx,p.dy,p.vx,p.vy,p.landed?1:0,p.jumped?1:0,p.jumpable?1:0,this.gravity,p.kickableDir,p.slipped?1:0,p.climbing?1:0,this.status==='dead'?1:this.status==='clear'?2:0,this.timer,...this.objArr.flatMap(b=>[b._x,b._y])];}
}
export const keyCodes=[37,39,32,17,38,40,9];
export function setMask(mask){Key.held=new Set(keyCodes.filter((_,i)=>mask&(1<<i)));}
