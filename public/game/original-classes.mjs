// Generated from the original AS2 class bodies; arithmetic and execution order preserved.
import {Sprite,Key,_root} from "./runtime.mjs";
export class Chara extends Sprite {
constructor(){super();this.vx = 0;this.vy = 0;this.dx = 0;this.dy = 0;this.px = 0;this.py = 0;this.pw = 0;this.ph = 0;this.pg = 0;this.fg = 0;
      
   }

loopInit(gravity){
      this.dx = 0;
      this.dy = 0;
      this.pw = 8;
      this.ph = 16;
      this.pg = gravity;
      if(this.pg < 0)
      {
         this.fg = -1;
         this.pg *= -1;
         this._yscale = -100;
      }
      else
      {
         this.fg = 1;
         this._yscale = 100;
      }
   }

}

export class Block extends Sprite {
constructor(){super();this.ox = 0;this.oy = 0;this.wall = false;this.damage = false;this.object_wall = false;this.stopper = true;this.call = false;this.called = false;this.kickdisable = false;this.flowDir = 0;this.reverseGravity = false;
      
   }

superinit(){
      this._x = this.ox;
      this._y = this.oy;
   }

}

export class Block1 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 1;
      this.wall = true;
      this.object_wall = true;
      this.superinit();
   }

}

export class Block2 extends Block {
constructor(){super();this.speed = 2;this.dir = 1;this.c = false;this.px = 0;this.py = 0;
      
   }

init(){
      this.dir = 1;
      this.px = this._x;
      this.py = this._y;
      this.typeNo = 2;
      this.speed = this._parent.moveBlockSpeed;
      this.wall = false;
      this.object_wall = false;
      this.call = true;
      this.superinit();
   }

callObject(tx, ty, tdx, tdy, tw, th, object){
      this.px = this._x;
      this.py = this._y;
      this.d = this.dir * this.speed;
      this.px += this.d;
      this.tttx1 = this.px + this._parent.square_size;
      this.ttty1 = this.py - this._parent.square_size;
      this.tttx2 = tx + tdx;
      this.ttty2 = ty + tdy;
      this.tty = Math.floor(this.ttty1 / this._parent.square_size);
      if(this.d > 0)
      {
         this.ttx = Math.floor(this.tttx1 / this._parent.square_size);
      }
      else
      {
         this.ttx = Math.floor(this.px / this._parent.square_size);
      }
      if(this._parent.cell(this.ttx,this.tty) == undefined || this._parent.cell(this.ttx,this.tty)?.object_wall)
      {
         this.dir *= -1;
         this.px = this._x;
      }
      this.tttx1 = this.px + this._parent.square_size;
      this.ttty1 = this.py - this._parent.square_size;
      if(this.tttx2 + tw >= this.px && this.tttx2 <= this.tttx1 && this.ttty2 - th <= this.py && this.ttty2 >= this.ttty1)
      {
         this.t = this.d;
         if(this._x == this.px)
         {
            this.t = 0;
         }
         object?.hitMoveHBlock(this.px,this.py,this.t,this);
      }
      this._x = this.px;
      this._y = this.py;
   }

}

export class Block3 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 3;
      this.call = false;
      this.wall = true;
      this.object_wall = true;
      this.superinit();
   }

}

export class Block4 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 4;
      this.call = false;
      this.wall = false;
      this.object_wall = true;
      this.superinit();
   }

}

export class Block5 extends Block {
constructor(){super();this.speed = 2;this.dir = 1;this.c = false;this.px = 0;this.py = 0;
      
   }

init(){
      this.dir = 1;
      this.px = this._x;
      this.py = this._y;
      this.typeNo = 5;
      this.speed = this._parent.moveBlockSpeed;
      this.wall = false;
      this.object_wall = false;
      this.call = true;
      this.superinit();
   }

callObject(tx, ty, tdx, tdy, tw, th, object){
      var _loc4_;
      var _loc8_;
      var _loc3_;
      var _loc7_;
      var _loc2_;
      var _loc6_;
      var _loc5_;
      this.px = this._x;
      this.py = this._y;
      this.d = this.dir * this.speed;
      this.py += this.d;
      _loc7_ = this.px + this._parent.square_size;
      _loc2_ = this.py - this._parent.square_size;
      _loc6_ = tx + tdx;
      _loc5_ = ty + tdy;
      _loc8_ = Math.floor(this.px / this._parent.square_size);
      if(this.d > 0)
      {
         _loc3_ = Math.floor(this.py / this._parent.square_size);
      }
      else
      {
         _loc3_ = Math.floor(_loc2_ / this._parent.square_size);
      }
      if(this._parent.cell(_loc8_,_loc3_) == undefined || this._parent.cell(_loc8_,_loc3_)?.object_wall)
      {
         this.dir *= -1;
         this.py = this._y;
      }
      _loc7_ = this.px + this._parent.square_size;
      _loc2_ = this.py - this._parent.square_size;
      if(_loc6_ + tw >= this.px && _loc6_ <= _loc7_ && _loc5_ - th <= this.py && _loc5_ >= _loc2_)
      {
         _loc4_ = this.d;
         if(this._y == this.py)
         {
            _loc4_ = 0;
         }
         object?.hitMoveVBlock(this.px,this.py,_loc4_,this);
      }
      this._x = this.px;
      this._y = this.py;
   }

}

export class Block6 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 6;
      this.wall = false;
      this.object_wall = false;
      this.call = false;
      this.superinit();
   }

}

export class Block7 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 7;
      this.wall = false;
      this.object_wall = false;
      this.call = false;
      this.superinit();
   }

}

export class Block8 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 8;
      this.wall = true;
      this.object_wall = true;
      this.stopper = false;
      this.superinit();
   }

}

export class Block9 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 9;
      this.wall = false;
      this.object_wall = true;
      this.superinit();
   }

}

export class Block10 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 10;
      this.wall = true;
      this.object_wall = true;
      this.damage = true;
      this.superinit();
   }

}

export class Block11 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 11;
      this.wall = true;
      this.object_wall = true;
      this.superinit();
      this.reverseGravity = true;
   }

}

export class Block12 extends Block {
constructor(){super();this.speed = 2;this.dir = 1;this.c = false;this.px = 0;this.py = 0;
      
   }

init(){
      this.dir = 1;
      this.px = this._x;
      this.py = this._y;
      this.typeNo = 12;
      this.speed = this._parent.moveBlockSpeed;
      this.wall = false;
      this.object_wall = false;
      this.call = true;
      this.superinit();
   }

callObject(tx, ty, tdx, tdy, tw, th, object){
      tdx = 0;
      tdy = 0;
      var _loc13_;
      var _loc5_;
      var _loc8_;
      var _loc4_;
      var _loc3_;
      var _loc7_;
      var _loc6_;
      this.px = this._x;
      this.py = this._y;
      this.d = this.dir * this.speed;
      this.px += this.d;
      _loc4_ = this.px + this._parent.square_size;
      _loc3_ = this.py - this._parent.square_size;
      _loc7_ = tx + tdx;
      _loc6_ = ty + tdy;
      _loc8_ = Math.floor(_loc3_ / this._parent.square_size);
      if(this.d > 0)
      {
         _loc5_ = Math.floor(_loc4_ / this._parent.square_size);
      }
      else
      {
         _loc5_ = Math.floor(this.px / this._parent.square_size);
      }
      if(this._parent.cell(_loc5_,_loc8_) == undefined || this._parent.cell(_loc5_,_loc8_)?.object_wall)
      {
         this.dir *= -1;
         this.px = this._x;
      }
      _loc4_ = this.px + this._parent.square_size;
      _loc3_ = this.py - this._parent.square_size + 1;
      if(_loc7_ + tw >= this.px && _loc7_ <= _loc4_ && _loc6_ - th <= this.py - 1 && _loc6_ >= _loc3_)
      {
         _root.addGameOver();
         _root.game.gameStage.dead(tx,ty);
      }
      this._x = this.px;
      this._y = this.py;
   }

}

export class Block13 extends Block {
constructor(){super();this.speed = 2;this.dir = 1;this.c = false;this.px = 0;this.py = 0;
      
   }

init(){
      this.dir = 1;
      this.px = this._x;
      this.py = this._y;
      this.typeNo = 13;
      this.speed = this._parent.moveBlockSpeed;
      this.wall = false;
      this.object_wall = false;
      this.call = true;
      this.superinit();
   }

callObject(tx, ty, tdx, tdy, tw, th, object){
      var _loc11_;
      var _loc8_;
      var _loc4_;
      var _loc7_;
      var _loc3_;
      var _loc6_;
      var _loc5_;
      this.px = this._x;
      this.py = this._y;
      this.d = this.dir * this.speed;
      this.py += this.d;
      _loc7_ = this.px + this._parent.square_size;
      _loc3_ = this.py - this._parent.square_size;
      _loc6_ = tx + tdx;
      _loc5_ = ty + tdy;
      _loc8_ = Math.floor(this.px / this._parent.square_size);
      if(this.d > 0)
      {
         _loc4_ = Math.floor(this.py / this._parent.square_size);
      }
      else
      {
         _loc4_ = Math.floor(_loc3_ / this._parent.square_size);
      }
      if(this._parent.cell(_loc8_,_loc4_) == undefined || this._parent.cell(_loc8_,_loc4_)?.object_wall)
      {
         this.dir *= -1;
         this.py = this._y;
      }
      _loc7_ = this.px + this._parent.square_size;
      _loc3_ = this.py - this._parent.square_size;
      if(_loc6_ + tw >= this.px && _loc6_ <= _loc7_ && _loc5_ - th <= this.py && _loc5_ >= _loc3_)
      {
         _root.addGameOver();
         _root.game.gameStage.dead(tx,ty);
      }
      this._x = this.px;
      this._y = this.py;
   }

}

export class Block14 extends Block {
constructor(){super();this.speed = 2;this.dir = 1;this.c = false;this.px = 0;this.py = 0;this.mode = 0;this.dmode = 0;this.next_mode = 0;
      
   }

init(){
      this.graphic.gotoAndPlay(1);
      this.mode = 1;
      this.dir = 1;
      this.px = this._x;
      this.py = this._y;
      this.typeNo = 14;
      this.speed = this._parent.moveBlockSpeed;
      this.wall = false;
      this.object_wall = false;
      this.call = true;
      this.superinit();
   }

callObject(tx, ty, tdx, tdy, tw, th, object){
      var _loc2_ = false;
      this.px = this._x;
      this.py = this._y;
      switch(this.mode)
      {
         case 1:
            this.t = - this.speed;
            this.py -= this.speed;
            this.graphic.gotoAndStop(1);
            break;
         case 3:
            this.t = this.speed;
            this.py += this.speed;
            this.graphic.gotoAndStop(3);
            break;
         case 4:
            this.t = - this.speed;
            this.px -= this.speed;
            this.graphic.gotoAndStop(4);
            break;
         case 2:
            this.t = this.speed;
            this.px += this.speed;
            this.graphic.gotoAndStop(2);
      }
      this.tttx1 = this.px + this._parent.square_size;
      this.ttty1 = this.py - this._parent.square_size;
      this.tttx2 = tx + tdx;
      this.ttty2 = ty + tdy;
      switch(this.mode)
      {
         case 1:
            this.ttx = Math.floor(this.px / this._parent.square_size);
            this.tty = Math.floor(this.ttty1 / this._parent.square_size);
            break;
         case 3:
            this.ttx = Math.floor(this.px / this._parent.square_size);
            this.tty = Math.floor(this.py / this._parent.square_size);
            break;
         case 4:
            this.ttx = Math.floor(this.px / this._parent.square_size);
            this.tty = Math.floor(this.ttty1 / this._parent.square_size);
            break;
         case 2:
            this.ttx = Math.floor(this.tttx1 / this._parent.square_size);
            this.tty = Math.floor(this.ttty1 / this._parent.square_size);
      }
      this.dmode = 0;
      if(this._parent.cell(this.ttx,this.tty) == undefined || (this._parent.cell(this.ttx,this.tty)?.wall && ![30,41].includes(this._parent.cell(this.ttx,this.tty)?.typeNo)))
      {
         this.dmode = 0;
         switch(this.mode)
         {
            case 1:
               this.dmode = 3;
               this.py = (this.tty + 2) * this._parent.square_size;
               break;
            case 3:
               this.dmode = 1;
               this.py = this.tty * this._parent.square_size;
               break;
            case 4:
               this.dmode = 2;
               this.px = (this.ttx + 1) * this._parent.square_size;
               break;
            case 2:
               this.dmode = 4;
               this.px = (this.ttx - 1) * this._parent.square_size;
         }
      }
      this.tttx1 = this.px + this._parent.square_size;
      this.ttty1 = this.py - this._parent.square_size;
      if(this.tttx2 + tw >= this.px && this.tttx2 <= this.tttx1 && this.ttty2 - th <= this.py && this.ttty2 >= this.ttty1)
      {
         if(this.mode == 1 || this.mode == 3)
         {
            if(this._y == this.py)
            {
               this.t = 0;
            }
            _loc2_ = object?.hitMoveVBlock(this.px,this.py,this.t,this);
         }
         else
         {
            if(this._x == this.px)
            {
               this.t = 0;
            }
            _loc2_ = object?.hitMoveHBlock(this.px,this.py,this.t,this);
         }
         if(_loc2_)
         {
            if(object?.ONCE_DOWN)
            {
               this.next_mode = this.mode + 1;
               if(this.next_mode > 4)
               {
                  this.next_mode = 1;
               }
            }
            if(object?.ONCE_UP)
            {
               this.next_mode = this.mode - 1;
               if(this.next_mode < 1)
               {
                  this.next_mode = 4;
               }
            }
         }
      }
      if(this.dmode > 0)
      {
         this.mode = this.dmode;
      }
      if(this.px % this._parent.square_size == 0 && this.py % this._parent.square_size == 0)
      {
         if(this.next_mode > 0)
         {
            this.mode = this.next_mode;
            this.next_mode = 0;
         }
      }
      this._x = this.px;
      this._y = this.py;
   }

}

export class Block15 extends Block {
constructor(){super();
      
   }

init(){
      this.typeNo = 15;
      this.wall = true;
      this.object_wall = true;
      this.kickdisable = true;
      this.superinit();
   }

}

export class Block16 extends Block {
constructor(){super();this.speed = 2;
      
   }

init(){
      this.typeNo = 16;
      this.wall = true;
      this.object_wall = true;
      this.flowDir = 1;
      this.superinit();
      this.graphic.gotoAndPlay(1);
   }

}

export class Block17 extends Block {
constructor(){super();this.speed = 2;
      
   }

init(){
      this.typeNo = 17;
      this.wall = true;
      this.object_wall = true;
      this.flowDir = -1;
      this.superinit();
      this.graphic.gotoAndPlay(1);
   }

}

export class Block18 extends Block {
constructor(){super();this.charge = 0;this.touch = false;this.timer = 0;this.speed = 0;this.sizex = 16;this.sizey = 16;
      
   }

init(){
      this.charge = 0;
      this.timer = 0;
      this.speed = 0;
      this.px = this._x;
      this.py = this._y;
      this.typeNo = 18;
      this.wall = false;
      this.object_wall = false;
      this.call = true;
      this.sizex = 16;
      this.sizey = 16;
      this.superinit();
   }

touchBlock(fg, player){
      this.timer = this.timer + 1;
      this.touch = true;
      if(this.timer > 6)
      {
         this.charge = 2;
         this.sizey = 8;
         if(fg > 0)
         {
            this.graphic.gotoAndStop(4);
         }
         else
         {
            this.graphic.gotoAndStop(7);
         }
         return this.charge;
      }
      if(this.timer > 3)
      {
         this.sizey = 12;
         this.charge = 1;
         if(fg > 0)
         {
            this.graphic.gotoAndStop(3);
         }
         else
         {
            this.graphic.gotoAndStop(6);
         }
         return this.charge;
      }
      if(this.timer > 0)
      {
         this.sizey = 14;
         this.charge = 0;
         if(fg > 0)
         {
            this.graphic.gotoAndStop(2);
         }
         else
         {
            this.graphic.gotoAndStop(5);
         }
         return this.charge;
      }
   }

callObject(tx, ty, tdx, tdy, tw, th, object){
      var _loc5_;
      var _loc4_;
      var _loc3_;
      var _loc2_;
      this.px = this._x;
      this.py = this._y;
      if(this.touch == false)
      {
         this.graphic.gotoAndStop(1);
         this.sizey = 16;
         this.timer = 0;
      }
      else
      {
         this.touch = false;
      }
      _loc5_ = this.px + this.sizex;
      _loc3_ = tx + tdx;
      _loc4_ = this.py - this.sizey;
      _loc2_ = ty + tdy;
      if(_loc3_ + tw >= this.px && _loc3_ <= _loc5_ && _loc2_ - th <= this.py && _loc2_ >= _loc4_)
      {
         object?.hitJumpBlock(this.px,this.py,this);
      }
   }

}

export class Block19 extends Block {
constructor(){super();this.speed = 2;this.fall_speed = 4;this.return_speed = 2;this.dir = 0;this.c = false;this.px = 0;this.py = 0;this.timer = 0;this.touch = false;
      
   }

init(){
      this.dir = 0;
      this.px = this._x;
      this.py = this._y;
      this.timer = 0;
      this.typeNo = 19;
      this.speed = 2;
      this.wall = false;
      this.object_wall = false;
      this.call = true;
      this.superinit();
   }

touchBlock(){
      this.touch = true;
   }

callObject(tx, ty, tdx, tdy, tw, th, object){
      var _loc4_;
      var _loc8_;
      var _loc3_;
      var _loc7_;
      var _loc2_;
      var _loc6_;
      var _loc5_;
      this.px = this._x;
      this.py = this._y;
      if(this.touch == false)
      {
         this.dir = 0;
         if(this.oy < this.py)
         {
            this.dir = -1;
         }
         if(this.oy > this.py)
         {
            this.dir = 1;
         }
         this.speed = this.return_speed;
      }
      else
      {
         this.speed = this.fall_speed;
         this.touch = false;
         if(object?.fg > 0)
         {
            this.dir = 1;
         }
         if(object?.fg < 0)
         {
            this.dir = -1;
         }
      }
      this.d = this.dir * this.speed;
      this.py += this.d;
      _loc7_ = this.px + this._parent.square_size;
      _loc2_ = this.py - this._parent.square_size;
      _loc6_ = tx + tdx;
      _loc5_ = ty + tdy;
      _loc8_ = Math.floor(this.px / this._parent.square_size);
      if(this.d > 0)
      {
         _loc3_ = Math.floor(this.py / this._parent.square_size);
      }
      else
      {
         _loc3_ = Math.floor(_loc2_ / this._parent.square_size);
      }
      if(this._parent.cell(_loc8_,_loc3_) == undefined || this._parent.cell(_loc8_,_loc3_)?.object_wall)
      {
         this.dir = 0;
         this.py = this._y;
      }
      _loc7_ = this.px + this._parent.square_size;
      _loc2_ = this.py - this._parent.square_size;
      if(_loc6_ + tw >= this.px && _loc6_ <= _loc7_ && _loc5_ - th <= this.py && _loc5_ >= _loc2_)
      {
         _loc4_ = this.d;
         if(this._y == this.py)
         {
            _loc4_ = 0;
         }
         object?.hitMoveVBlock(this.px,this.py,_loc4_,this);
      }
      this._x = this.px;
      this._y = this.py;
   }

}

export class Player extends Chara {
constructor(){super();this.down = false;this.jumped = false;this.jumpable = false;this.jump_charge = 0;this.charge_speed = 2;this.kickableDir = 0;this.dirX = 1;this.dirY = 1;this.mv = 0;this.dir_keyY = 1;this.dir_keyX = 1;this.landed = false;this.runMode = 1;this.fix_timer = 0;this.moved = false;this.slip_speed = 0;this.slipped = false;this.on_ice = false;this.climbing = false;this.ladderTouch = 0;this.ladderUpSpeed = 2;this.ladderDownSpeed = 4;this.ladderUpTouched = false;this.FIX_TIME = 6;
      
      this.init();
   }

init(){
      this.fg = 1;
      this.vx = 0;
      this.vy = 0;
      this.mv = 0;
      this.runMode = 1;
      this.down = false;
      this.jumped = false;
      this.jumpable = false;
      this.kickableDir = 0;
      this.dirX = 1;
      this.landed = false;
      this.runMode = 1;
      this.fix_timer = 0;
      this.moved = false;
      this.px = 0;
      this.py = 0;
      this.kick_speed = 6;
      this.jump_speed = 16;
      this.move_speed = 3;
   }

callObject(Action){
      if(!this._parent.run)
      {
         return undefined;
      }
      _root.game.timer++;
      _root.game.time.text = _root.game.timer;
      _root.game.time2.text = "loop";
      this.loopInit(this._parent.gravity);
      this.checkKey();
      this.landed = false;
      this.kickableDir = 0;
      this.checkMove();
      this.dy += this.fg * this.pg;
      var _loc3_;
      if(this.dy > 0)
      {
         _loc3_ = 0;
         while(_loc3_ < this._parent.objArr.length)
         {
            if(!this._parent.objArr[_loc3_].called)
            {
               this._parent.objArr[_loc3_].callObject(this.px,this.py,this.dx,this.dy,this.pw,this.ph,this);
            }
            _loc3_ = _loc3_ + 1;
         }
      }
      else
      {
         _loc3_ = this._parent.objArr.length - 1;
         while(_loc3_ >= 0)
         {
            if(!this._parent.objArr[_loc3_].called)
            {
               this._parent.objArr[_loc3_].callObject(this.px,this.py,this.dx,this.dy,this.pw,this.ph,this);
            }
            _loc3_ = _loc3_ - 1;
         }
      }
      _loc3_ = 0;
      while(_loc3_ < this._parent.objArr.length)
      {
         this._parent.objArr[_loc3_].called = false;
         _loc3_ = _loc3_ + 1;
      }
      this.moved = false;
      this.wallCheck();
      this.ladderUpTouched = false;
      if(!this.landed)
      {
         if(this.mv == 0)
         {
            this.mv = this.move_speed;
         }
         this.on_ice = false;
         this.slipped = false;
         this.jumpable = false;
      }
      else
      {
         this.jumpable = true;
      }
      if(this.climbing)
      {
         this.jumpable = true;
      }
      this.setCharaAction(Action);
      this.px += this.dx;
      this.py += this.dy;
      this._x = this.px;
      if(this.fg > 0)
      {
         this._y = this.py;
      }
      else
      {
         this._y = this.py - 16;
      }
      if(this.py < 0 || this.py > this._parent.scy + 16)
      {
         this._parent.gameOver();
      }
   }

setCharaAction(Action){
      var _loc3_ = 1;
      if(Key.isDown(9))
      {
         this._parent.dead(this.px,this.py);
         _root.suicideConnection();
         return undefined;
      }
      if(this.landed)
      {
         if(this.dx > 0)
         {
            if(this.slipped)
            {
               _loc3_ = 14;
            }
            if(this.runMode == 1)
            {
               _loc3_ = 3;
            }
            if(this.runMode == 2)
            {
               _loc3_ = 5;
            }
         }
         if(this.dx < 0)
         {
            if(this.slipped)
            {
               _loc3_ = 13;
            }
            if(this.runMode == 1)
            {
               _loc3_ = 2;
            }
            if(this.runMode == 2)
            {
               _loc3_ = 4;
            }
         }
         if(this.dx == 0)
         {
            _loc3_ = 1;
         }
      }
      else
      {
         _loc3_ = 12;
      }
      if(this.jumped)
      {
         if(this.dirX == 1)
         {
            _loc3_ = 9;
         }
         if(this.dirX == -1)
         {
            _loc3_ = 8;
         }
      }
      if(this.climbing)
      {
         if(this.dy != 0)
         {
            _loc3_ = 6;
         }
         else
         {
            _loc3_ = 7;
         }
      }
      if(this.fix_timer > 0)
      {
         if(this.dirX == 1)
         {
            _loc3_ = 11;
         }
         if(this.dirX == -1)
         {
            _loc3_ = 10;
         }
      }
      Action.gotoAndStop(_loc3_);
   }

checkKey(){
      this.dir_keyX = 0;
      this.dir_keyY = 0;
      if(Key.isDown(38) && Key.isDown(40))
      {
         if(!(this.PREV_UP && this.PREV_DOWN))
         {
            if(this.dirY == 1)
            {
               this.dir_keyY = -1;
            }
            else
            {
               this.dir_keyY = 1;
            }
         }
         else
         {
            this.dir_keyY = this.prev_dir_keyY;
         }
      }
      else
      {
         if(Key.isDown(40))
         {
            this.dir_keyY = 1;
         }
         if(Key.isDown(38))
         {
            this.dir_keyY = -1;
         }
      }
      if(this.dir_keyY == 1)
      {
         this.dirY = 1;
      }
      if(this.dir_keyY == -1)
      {
         this.dirY = -1;
      }
      this.prev_dir_keyY = this.dir_keyY;
      if(this.landed)
      {
         this.mv = this.move_speed;
      }
      this.runMode = 0;
      if(this.landed && !this.on_ice)
      {
         if(Key.isDown(17))
         {
            this.mv = this.move_speed * 2;
            this.runMode = 2;
         }
         else
         {
            this.runMode = 1;
         }
      }
      this.dir_keyX = 0;
      if(Key.isDown(39) && Key.isDown(37))
      {
         if(!(this.PREV_RIGHT && this.PREV_LEFT))
         {
            if(this.dirX == 1)
            {
               this.dir_keyX = -1;
            }
            else
            {
               this.dir_keyX = 1;
            }
         }
         else
         {
            this.dir_keyX = this.prev_dir_keyX;
         }
      }
      else
      {
         if(Key.isDown(39))
         {
            this.dir_keyX = 1;
         }
         if(Key.isDown(37))
         {
            this.dir_keyX = -1;
         }
      }
      if(this.dir_keyX != this.prev_dir_keyX)
      {
         this.mv = this.move_speed;
         this.runMode = 1;
      }
      if(this.slipped)
      {
         this.mv = 0;
      }
      if(this.fix_timer > 0)
      {
         this.fix_timer -= 1;
         this.dir_keyX = this.prev_dir_keyX;
      }
      if(this.dir_keyX == 1)
      {
         if(!this.slipped && this.vx < 0)
         {
            if(!this.landed)
            {
               this.vx = 0;
            }
            this.runMode = 1;
         }
         this.dirX = 1;
         if(this.landed || this.vx <= 0)
         {
            this.dx += this.mv;
         }
      }
      if(this.dir_keyX == -1)
      {
         if(!this.slipped && this.vx >= 0)
         {
            if(!this.landed)
            {
               this.vx = 0;
            }
            this.runMode = 1;
         }
         this.dirX = -1;
         if(this.landed || this.vx >= 0)
         {
            this.dx -= this.mv;
         }
      }
      this.prev_dir_keyX = this.dir_keyX;
      if(Key.isDown(38))
      {
         if(this.PREV_UP)
         {
            this.ONCE_UP = false;
         }
         else
         {
            this.ONCE_UP = true;
            this.PREV_UP = true;
         }
      }
      else
      {
         this.ONCE_UP = false;
         this.PREV_UP = false;
      }
      if(Key.isDown(40))
      {
         if(this.PREV_DOWN)
         {
            this.ONCE_DOWN = false;
         }
         else
         {
            this.ONCE_DOWN = true;
            this.PREV_DOWN = true;
         }
      }
      else
      {
         this.ONCE_DOWN = false;
         this.PREV_DOWN = false;
      }
      if(Key.isDown(39))
      {
         if(this.PREV_RIGHT)
         {
            this.ONCE_RIGHT = false;
         }
         else
         {
            this.ONCE_RIGHT = true;
            this.PREV_RIGHT = true;
         }
      }
      else
      {
         this.ONCE_RIGHT = false;
         this.PREV_RIGHT = false;
      }
      if(Key.isDown(37))
      {
         if(this.PREV_LEFT)
         {
            this.ONCE_LEFT = false;
         }
         else
         {
            this.ONCE_LEFT = true;
            this.PREV_LEFT = true;
         }
      }
      else
      {
         this.ONCE_LEFT = false;
         this.PREV_LEFT = false;
      }
      if(Key.isDown(32))
      {
         if(this.PREV_SPACE)
         {
            this.ONCE_SPACE = false;
         }
         else
         {
            this.ONCE_SPACE = true;
            this.PREV_SPACE = true;
         }
      }
      else
      {
         this.ONCE_SPACE = false;
         this.PREV_SPACE = false;
      }
      if(!this.landed)
      {
         if(this.kickableDir == this.dirX)
         {
            this.runMode = 1;
            this.fix_timer = this.FIX_TIME;
            this.dx = 0;
            this.dirX = - this.kickableDir;
            this.vx = this.kickableDir * this.kick_speed;
            this.vy = this.jump_speed - (this.jump_speed - this.pg) / 4;
            this.jumped = true;
            this.jumpable = false;
         }
      }
      if(this.ONCE_SPACE)
      {
         if(this.jumpable)
         {
            if(this.vx != 0)
            {
               this.vx += this.dx;
            }
            this.climbing = false;
            this.vy = this.jump_speed + this.charge_speed * this.jump_charge;
            this.jumped = true;
            this.jumpable = false;
         }
      }
      this.jump_charge = 0;
   }

checkMove(){
      this.dx += this.vx;
      if(this.jumped)
      {
         this.dy -= this.fg * this.vy;
         if(this.vy > 0)
         {
            this.vy -= this.pg / this._parent.resistY;
         }
      }
   }

wallCheck(){
      this.ladderTouch = 0;
      if(this.fg > 0)
      {
         this.downWallCheck();
         this.upWallCheck();
      }
      else
      {
         this.upWallCheck();
         this.downWallCheck();
      }
      this.rightWallCheck();
      this.leftWallCheck();
      if(this.ladderTouch == 0)
      {
         this.climbing = false;
      }
   }

upWallCheck(){
      var _loc2_;
      var _loc3_;
      if(this.dy <= 0)
      {
         _loc3_ = Math.floor((this.py + this.dy - this.ph + 1) / this._parent.square_size);
         _loc2_ = Math.floor((this.px + 1) / this._parent.square_size);
         this.upWall(_loc2_,_loc3_);
         _loc2_ = Math.floor((this.px + this.pw - 1) / this._parent.square_size);
         this.upWall(_loc2_,_loc3_);
      }
   }

downWallCheck(){
      var _loc2_;
      var _loc3_;
      if(this.dy >= 0)
      {
         _loc3_ = Math.floor((this.py + this.dy - 1) / this._parent.square_size);
         _loc2_ = Math.floor((this.px + 1) / this._parent.square_size);
         this.downWall(_loc2_,_loc3_);
         _loc2_ = Math.floor((this.px + this.pw - 1) / this._parent.square_size);
         this.downWall(_loc2_,_loc3_);
      }
   }

rightWallCheck(){
      var _loc3_;
      var _loc2_;
      if(this.dx >= 0)
      {
         _loc3_ = Math.floor((this.px + this.dx + this.pw - 1) / this._parent.square_size);
         _loc2_ = Math.floor((this.py - 1) / this._parent.square_size);
         this.rightWall(_loc3_,_loc2_);
         _loc2_ = Math.floor((this.py - this.ph + 1) / this._parent.square_size);
         this.rightWall(_loc3_,_loc2_);
      }
   }

leftWallCheck(){
      var _loc3_;
      var _loc2_;
      if(this.dx <= 0)
      {
         _loc3_ = Math.floor((this.px + this.dx + 1) / this._parent.square_size);
         _loc2_ = Math.floor((this.py - 1) / this._parent.square_size);
         this.leftWall(_loc3_,_loc2_);
         _loc2_ = Math.floor((this.py - this.ph + 1) / this._parent.square_size);
         this.leftWall(_loc3_,_loc2_);
      }
   }

upWall(tx, ty){
      var _loc4_;
      if(this._parent.cell(tx,ty)?.wall || this._parent.cell(tx,ty) == undefined && this.fg > 0)
      {
         if(!this.climbing || this.fg * this.dir_keyY < 0)
         {
            _loc4_ = ty * this._parent.square_size;
            this.py = _loc4_ + this.ph + this.ph;
            this.dy = 0;
            if(this.fg < 0)
            {
               this.landing(this._parent.cell(tx,ty));
            }
            else
            {
               this.vy = 0;
            }
         }
      }
      else
      {
         this.commonWall(tx,ty,0,-1);
      }
      this.touchWall(tx,ty,-1,0);
   }

downWall(tx, ty){
      var _loc4_;
      if(this._parent.cell(tx,ty)?.wall || this._parent.cell(tx,ty) == undefined && this.fg < 0)
      {
         if(!this.climbing || this.fg * this.dir_keyY > 0)
         {
            this.py = ty * this._parent.square_size;
            this.dy = 0;
            if(this.fg > 0)
            {
               this.landing(this._parent.cell(tx,ty));
            }
         }
      }
      else
      {
         this.commonWall(tx,ty,0,1);
      }
      this.touchWall(tx,ty,-1,0);
   }

rightWall(tx, ty){
      if(ty < 0 || ty >= this._parent.ysize)
      {
         return undefined;
      }
      var _loc4_;
      if(this._parent.cell(tx,ty) == undefined || this._parent.cell(tx,ty)?.wall)
      {
         _loc4_ = tx * this._parent.square_size;
         this.px = _loc4_ - this.pw - 1;
         this.slipped = false;
         this.dx = 0;
         this.vx = 0;
         if(!this._parent.cell(tx,ty)?.kickdisable)
         {
            this.kickRight();
         }
      }
      else
      {
         this.commonWall(tx,ty,1,0);
      }
      this.touchWall(tx,ty,-1,0);
   }

leftWall(tx, ty){
      if(ty < 0 || ty >= this._parent.ysize)
      {
         return undefined;
      }
      var _loc4_;
      if(this._parent.cell(tx,ty) == undefined || this._parent.cell(tx,ty)?.wall)
      {
         this.slipped = false;
         this.dx = 0;
         this.vx = 0;
         this.px = (tx + 1) * this._parent.square_size + 1;
         if(!this._parent.cell(tx,ty)?.kickdisable)
         {
            this.kickLeft();
         }
      }
      else
      {
         this.commonWall(tx,ty,-1,0);
      }
      this.touchWall(tx,ty,-1,0);
   }

touchWall(tx, ty, tdirX, tdirY){
      if(this._parent.cell(tx,ty)?.damage)
      {
         this._parent.dead(this.px,this.py);
      }
   }

commonWall(tx, ty, tdirX, tdirY){
      if(this._parent.cell(tx,ty)?.typeNo == 7)
      {
         this._parent.goal();
      }
      var _loc2_;
      if(this._parent.cell(tx,ty)?.typeNo == 9)
      {
         _loc2_ = tx * this._parent.square_size;
         if(tdirY * this.fg <= 0)
         {
            this.ladderUpTouched = true;
         }
         if(this.ladderTouch > 1)
         {
            return undefined;
         }
         if(this.climbing && this.ladderTouch == 0)
         {
            this.ladderTouch = this.ladderTouch + 1;
            this.px = _loc2_ + 4;
            this.dy = 0;
            if(this.dir_keyY > 0 && !this.landed)
            {
               this.dy += this.fg * this.ladderDownSpeed;
            }
         }
         if(this.dir_keyY < 0 && this.ladderUpTouched)
         {
            this.vx = 0;
            this.px = _loc2_ + 4;
            this.landed = false;
            this.climbing = true;
            this.dy = (- this.fg) * this.ladderUpSpeed;
            this.ladderTouch = this.ladderTouch + 1;
         }
         if(this.dir_keyX != 0)
         {
            this.jumpable = true;
            this.climbing = false;
         }
      }
   }

landing(object){
      if(object?.typeNo == 18)
      {
         this.jump_charge = object?.touchBlock(this.fg,this);
      }
      if(object?.typeNo == 19)
      {
         object?.touchBlock();
      }
      if(object?.reverseGravity)
      {
         if(this.fg < 0)
         {
            this._parent.gravity = Math.abs(this._parent.gravity);
         }
         else
         {
            this._parent.gravity = Math.abs(this._parent.gravity) * -1;
         }
      }
      this.landed = true;
      var _loc3_;
      if(object?.stopper)
      {
         this.vx = 0;
         this.on_ice = false;
         this.slipped = false;
      }
      else
      {
         this.on_ice = true;
         _loc3_ = false;
         if(!this.slipped)
         {
            this.vx = this.dx;
            this.slipped = true;
            _loc3_ = true;
         }
         else
         {
            if(this.dx * this.dir_keyX < 0)
            {
               this.vx /= this._parent.ICE_RESIST;
            }
            if(this.dx * this.dir_keyX > 0)
            {
               if(Math.abs(this.dx) < Math.abs(this.mv))
               {
                  this.vx *= this._parent.ICE_RESIST;
               }
            }
         }
         if(this.vx < 0.5 && this.vx > -0.5)
         {
            this.slipped = false;
            this.runMode = 1;
            this.dx = 0;
            this.vx = 0;
         }
      }
      this.jumped = false;
      if(object?.flowDir > 0)
      {
         this.vx = object?.speed;
      }
      if(object?.flowDir < 0)
      {
         this.vx = - object?.speed;
      }
   }

hitMoveHBlock(tx, ty, tdx, object){
      var _loc5_ = false;
      var _loc3_;
      var _loc7_;
      var _loc6_;
      _loc3_ = true;
      if(this.fg > 0)
      {
         _loc7_ = this.py - this.ph >= ty && this.dy < 0;
      }
      else
      {
         _loc7_ = this.py + this._parent.square_size <= ty && this.dy >= 0;
      }
      if(_loc7_)
      {
         this.dy = 0;
         this.jumped = false;
         _loc3_ = false;
      }
      if(this.fg > 0)
      {
         _loc6_ = this.py + this._parent.square_size <= ty && this.dy >= 0;
      }
      else
      {
         _loc6_ = this.py - this.ph >= ty && this.dy <= 0;
      }
      if(_loc6_)
      {
         this.dy = 0;
         this.py = ty - this._parent.square_size * this.fg;
         this.landing(object);
         _loc5_ = true;
         if(this.dx * tdx >= 0)
         {
            if(!this.moved)
            {
               this.dx += tdx;
            }
         }
      }
      else
      {
         if(this.dx > 0 && _loc3_)
         {
            this.px = tx - this.pw - 1 - tdx;
            this.kickRight();
         }
         if(this.dx < 0 && _loc3_)
         {
            this.px = tx + this._parent.square_size + 1 - tdx;
            this.kickLeft();
         }
         this.dx = 0;
         this.vx = 0;
         this.moved = true;
         this.dx += tdx;
      }
      return _loc5_;
   }

hitMoveVBlock(tx, ty, tdy, object){
      var _loc4_ = false;
      var _loc3_;
      var _loc6_;
      var _loc5_;
      _loc3_ = true;
      if(this.fg > 0)
      {
         _loc6_ = this.py - this.ph >= ty && this.dy < 0;
      }
      else
      {
         _loc6_ = this.py + this._parent.square_size <= ty && this.dy >= 0;
      }
      if(_loc6_)
      {
         this.dy = 0;
         this.jumped = false;
         _loc3_ = false;
      }
      if(this.fg > 0)
      {
         _loc5_ = this.py + this._parent.square_size - this._parent.moveBlockSpeed <= ty && this.dy >= 0;
      }
      else
      {
         _loc5_ = this.py - this._height + this._parent.moveBlockSpeed >= ty && this.dy < 0;
      }
      if(_loc5_)
      {
         this.dy = 0;
         this.py = ty - this._parent.square_size * this.fg;
         this.landing(object);
         _loc4_ = true;
         if(tdy * this.fg < 0)
         {
            this.py += tdy;
         }
         if(tdy == 0)
         {
            this.py += (- this._parent.moveBlockSpeed) * this.fg;
         }
      }
      else
      {
         if(this.dx > 0 && _loc3_)
         {
            this.px = tx - this.pw - 1;
            this.kickRight();
         }
         if(this.dx < 0 && _loc3_)
         {
            this.px = tx + this._parent.square_size + 1;
            this.kickLeft();
         }
         this.dx = 0;
         this.vx = 0;
         this.py += tdy;
      }
      return _loc4_;
   }

hitJumpBlock(tx, ty, object){
      var _loc5_ = false;
      var _loc4_;
      var _loc7_;
      var _loc6_;
      _loc4_ = true;
      if(this.fg > 0)
      {
         _loc7_ = this.py - this.ph >= ty && this.dy < 0;
      }
      else
      {
         _loc7_ = this.py + object?.sizey <= ty && this.dy >= 0;
      }
      if(_loc7_)
      {
         this.dy = 0;
         this.jumped = false;
         _loc4_ = false;
      }
      if(this.fg > 0)
      {
         _loc6_ = this.py + object?.sizey <= ty && this.dy >= 0;
      }
      else
      {
         _loc6_ = this.py - object?.sizey >= ty && this.dy < 0;
      }
      if(_loc6_)
      {
         this.dy = 0;
         this.py = ty - object?.sizey * this.fg;
         this.landing(object);
         _loc5_ = true;
      }
      else
      {
         if(this.dx > 0 && _loc4_)
         {
            this.px = tx - this.pw - 1;
            this.kickRight();
         }
         if(this.dx < 0 && _loc4_)
         {
            this.px = tx + object?.sizex + 1;
            this.kickLeft();
         }
         this.dx = 0;
         this.vx = 0;
      }
      return _loc5_;
   }

kickLeft(){
      this.kickableDir = 1;
   }

kickRight(){
      this.kickableDir = -1;
   }

}
