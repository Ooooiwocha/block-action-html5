import {env} from 'cloudflare:workers';
export function database(){if(!env.DB)throw Error('Stage storage unavailable');return env.DB;}
export async function digest(p:string,salt:string){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(p),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new TextEncoder().encode(salt),iterations:100000},key,256);
 return Array.from(new Uint8Array(bits),b=>b.toString(16).padStart(2,'0')).join('');
}
export async function encodePassword(p:string){const salt=crypto.randomUUID();return salt+':'+await digest(p,salt);}
export async function matches(p:string,stored:string){const [salt,hash]=stored.split(':');return !!hash&&(await digest(p,salt))===hash;}
export async function adminMatches(p:string,role:'PICKUP'|'EDIT'|'RANKING'|'DELETE'){
 const hash=(env as unknown as Record<string,string|undefined>)[`ADMIN_${role}_HASH`];
 return !!p&&!!hash&&await matches(p,hash);
}

export type StageRow={featured:number;ghost_ii:number;hannya_ii:number;hannya:number;mode:string;revision:string;dark_chamber:number;ghost:number;doppelganger:number;doppel_variant:number;country:string|null;id:number;title:string;name:string;comment:string;cells:string;password:string;valid:number;demo:number;pickup:number;created:string;pn:number;dn:number;cn:number;retn:number;good:number;bad:number;};
