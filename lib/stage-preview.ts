export function stagePreview(cells:number[],mode:string){
 const dark=mode==='dark chamber',exploration=mode==='exploration'||mode==='exploration2';
 const points=(type:number)=>cells.flatMap((n,i)=>n===type?[{x:Math.floor(i/28)*16+8,y:i%28*16+8}]:[]);
 const starts=points(6);
 // Exploration starts at the player's initial center, four pixels left of the start marker.
 const lights=dark?[...starts,...points(7)]:exploration?starts.slice(-1).map(p=>({...p,x:p.x-4})):[];
 return {obscured:dark||exploration,lights,checkpoints:points(99),radius:56};
}

export function previewBlockVisible(type:number){return Number.isInteger(type)&&type>0&&type<=103&&![3,4,31,102].includes(type);}
