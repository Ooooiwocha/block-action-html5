// Frame numbers and transition order follow Game, Fade and P_dead in the SWF.
export class Presentation {
 constructor(stage,edit=false){this.stage=stage;this.edit=edit;this.phase=edit?'edit':'title';this.frame=1;}
 start(retry=false){this.stage.reset();this.phase=this.edit?'playing':'starting';this.frame=retry?1:2;if(this.edit)this.stage.start();}
 tick(){
  if(this.phase!=='playing')this.stage.advanceEffects();
  if(this.phase!=='playing')for(const b of this.stage.blocks)if(b.graphic.playing)b.graphic.animation++;
  if(this.phase==='starting'){if(++this.frame===27){this.phase='playing';this.stage.start();}return;}
  if(this.phase==='playing'){
   this.stage.step();
   if(this.stage.status==='dead'){this.phase=this.stage.deathAnimation?'dying':'over';this.frame=1;if(this.edit&&!this.stage.deathAnimation)this.back();}
   else if(this.stage.status==='clear'){this.phase='clearing';this.frame=1;if(this.edit)this.back();}
   return;
  }
  if(this.phase==='dying'){if(++this.frame===30){if(this.edit)this.back();else{this.phase='over';this.frame=1;}}}
  else if(this.phase==='over'){this.frame=Math.min(11,this.frame+1);}
  else if(this.phase==='clearing'){if(++this.frame===46)this.phase='clear';}
 }
 back(){this.stage.reset();this.phase=this.edit?'edit':'title';this.frame=1;}
 get showPlayer(){return this.stage.player._visible&&['playing','clearing','clear'].includes(this.phase);}
 get retryAvailable(){return this.phase==='over'&&this.frame===11;}
 get titleAvailable(){return this.retryAvailable||this.phase==='clear';}
 get fadeAlpha(){return this.phase==='starting'?(27-this.frame)/26*.5:0;}
}
