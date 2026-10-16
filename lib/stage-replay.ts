export const modes=['normal','dark chamber','exploration','exploration2'] as const;
export function stageMode(mode:unknown,dark=false){return modes.includes(mode as typeof modes[number])?String(mode):dark?'dark chamber':'normal';}
export async function stageRevision(s:{ghost_ii?:number;hannya_ii?:number;hannya?:number;cells:string;mode?:string;dark_chamber:number;ghost:number;doppelganger:number;doppel_variant:number}){
 const data=JSON.stringify([JSON.parse(s.cells),stageMode(s.mode,!!s.dark_chamber),!!s.ghost,!!s.doppelganger,!!s.doppel_variant,...(s.hannya?[true]:[]),...((s.ghost_ii||s.hannya_ii)?[!!s.ghost_ii,!!s.hannya_ii]:[])]);
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(data));
 return Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
}
export function validReplay(raw:string|undefined,time:number){
 if(!raw||time<1||time>30000||raw.length>6000000)return null;
 try{const frames=JSON.parse(raw);if(!Array.isArray(frames)||frames.length!==time||!frames.every(f=>Array.isArray(f)&&(f.length===5||f.length===7)&&f.slice(0,5).every(v=>typeof v==='number'&&Number.isFinite(v))&&Number.isInteger(f[2])&&f[2]>=1&&f[2]<=20&&(f[4]===1||f[4]===-1)&&(f.length===5||(Number.isInteger(f[5])&&f[5]>=0&&f[5]<=127&&Array.isArray(f[6])&&f[6].length<=128&&f[6].every((v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<1)))))return null;return JSON.stringify(frames);}catch{return null;}
}
export function stageTags(text:string){return new Set([...text.matchAll(/(?<![\p{L}\p{M}\p{N}_#＃])[#＃]([\p{L}\p{M}\p{N}_]+)/gu)].map(m=>m[1].normalize('NFKC').toLowerCase()));}
