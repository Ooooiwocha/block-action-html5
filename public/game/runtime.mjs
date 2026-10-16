export const Key={held:new Set(),isDown(code){return this.held.has(code);}};
export const int=Math.trunc;
export const _root={game:{timer:0,time:{text:''},time2:{text:''},edit:false},suicideConnection(){},addGameOver(){}};
export class Sprite {
 constructor(){this._x=0;this._y=0;this._yscale=100;this._height=16;this._width=16;this._visible=true;this.frame=1;this.animation=0;this.playing=true;}
 gotoAndStop(n){if(this.frame!==n)this.animation=0;this.frame=n;this.playing=false;}
 gotoAndPlay(n){this.frame=n;this.animation=0;this.playing=true;}
}
