import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';
const sql=new DatabaseSync(':memory:');
for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(fs.readFileSync('drizzle/'+file,'utf8'));
class Query{
 constructor(text){this.text=text;this.values=[];}
 bind(...values){this.values=values;return this;}
 async first(){return sql.prepare(this.text).get(...this.values)||null;}
 async all(){return {results:sql.prepare(this.text).all(...this.values)};}
 async run(){const r=sql.prepare(this.text).run(...this.values);return {meta:{last_row_id:Number(r.lastInsertRowid),changes:Number(r.changes)}};}
}
const db={prepare(text){return new Query(text)},async batch(queries){sql.exec('BEGIN');try{const result=[];for(const q of queries)result.push(await q.run());sql.exec('COMMIT');return result;}catch(e){sql.exec('ROLLBACK');throw e;}}};
const context=vm.createContext({after:()=>{},console,crypto,Request,Response,URL,URLSearchParams,TextEncoder,Uint8Array,database:()=>db,env:{COMMENT_ID_SECRET:'x'.repeat(32)},browserIdentity:async()=>({id:'test',cookie:null}),visitorIP:()=>null,shortID:async()=>null,isListedVPN:()=>false,postingCountry:()=> 'JP',formatGameDate:x=>x,matches:async(p,s)=>p===s,encodePassword:async p=>p,adminMatches:async()=>false});
function evaluate(file){let code=fs.readFileSync(file,'utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,'');code=ts.transpile(code,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None});vm.runInContext(code,context);}
evaluate('lib/stage-replay.ts');evaluate('app/[endpoint]/route.ts');
const api=async(name,data={})=>{const result=await context.POST(new Request('https://test.example/'+name+'.php',{method:'POST',body:new URLSearchParams(data)}),{params:Promise.resolve({endpoint:name+'.php'})});assert.notEqual(result.status,503,await result.clone().text());return Object.fromEntries(new URLSearchParams(await result.text()));};
let cells=Array(840).fill(-1);cells[0]=6;cells[1]=97;cells[2]=47;cells[3]=98;cells[4]=101;cells[6]=102;cells[7]=103;
let payload={action_id:-1,title:'#Puzzle',name:'Test',comment:'＃迷路',password:'test',mapdata:cells.join(','),mode:'exploration2',valid:'true'};
const saved=await api('saveMapData',payload);assert.equal(saved.error,'false');const id=Number(saved.action_id);payload.action_id=id;
let stage=await api('loadMapData',{action_id:id});assert.equal(stage.mode,'exploration2');assert.equal(stage['1'],'97');assert.equal(stage['3'],'98');assert.equal(stage['4'],'101');assert.equal(stage['6'],'102');assert.equal(stage['7'],'103');
assert.equal((await api('loadActionList',{sortType:9,tag:'迷路'})).id0,String(id));assert.equal((await api('loadActionList',{sortType:9,tag:'puzzle2'})).count,'0');
const score=async(time,name='Player',revision=stage.revision)=>api('saveTimeAttack',{action_id:id,name,time,revision,secure:(time*(id+24)+id)*3+32,replay:JSON.stringify(Array.from({length:time},()=>[0,0,1,0,1]))});
assert.equal((await score(10)).error,'false');assert((await api('loadReplay',{action_id:id})).replay);
await score(20);assert.equal(sql.prepare('SELECT time FROM replays').get().time,10);
await score(5);assert.equal(sql.prepare('SELECT time FROM replays').get().time,5);
await api('saveMapData',{...payload,title:'Metadata edit',name:'Changed',comment:'#New',password:'test'});assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,1);
cells[5]=15;payload.mapdata=cells.join(',');await api('saveMapData',payload);assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,0);
assert.equal((await score(4)).error,'true');stage=await api('loadMapData',{action_id:id});await score(4);assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,1);
await api('clearRanking',{action_id:id,password:'wrong'});assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,1);
await api('clearRanking',{action_id:id,password:'test'});assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,0);
await score(30001);assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,0);assert.equal(sql.prepare('SELECT count(*) n FROM scores').get().n,1);
await score(3);assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,1);
await api('saveTimeAttack',{action_id:id,time:2,name:''});assert.equal(sql.prepare('SELECT count(*) n FROM scores').get().n,2);
const breaks='\r\n\u000b\u000c\u0085\u2028\u2029';
await api('saveMapData',{...payload,title:'Title'+breaks+'End',name:'Creator'+breaks+'End',comment:'Line 1\nLine 2'});
const lineStage=await api('loadMapData',{action_id:id});assert.equal(lineStage.title,'TitleEnd');assert.equal(lineStage.name,'CreatorEnd');assert.equal(lineStage.comment,'Line 1\nLine 2','stage descriptions retain line breaks');
await api('saveComment',{action_id:id,name:'Poster'+breaks+'End',comment:'Body'+breaks+'End'});
const lineComment=sql.prepare('SELECT name,comment FROM comments WHERE stage_id=? ORDER BY id DESC LIMIT 1').get(id);assert.equal(lineComment.name,'PosterEnd');assert.equal(lineComment.comment,'BodyEnd');
assert.equal((await api('saveComment',{action_id:id,comment:breaks})).error,'true');
await score(2,'Rank'+breaks+'End');assert.equal(sql.prepare('SELECT name FROM scores WHERE stage_id=? ORDER BY id DESC LIMIT 1').get(id).name,'RankEnd');
assert.equal((await api('saveTimeAttack',{action_id:id,name:breaks,time:1})).declined,'true');
for(const name of [' ','   ','　',' '+breaks+' ']){await score(2,name);assert.equal(sql.prepare('SELECT name FROM scores WHERE stage_id=? ORDER BY id DESC LIMIT 1').get(id).name,name.replace(/[\r\n\u000b\u000c\u0085\u2028\u2029]/g,''));}
assert.equal((await api('saveTimeAttack',{action_id:id,name:'',time:1})).declined,'true');
console.log('PASS: spaces are valid ranking names; only an empty name after sanitization declines registration.');
console.log('PASS: direct requests strip all line separators from board posts/names, titles, creators and rankings; description newlines remain intact.');
await api('deleteMap',{action_id:id,password:'test'});assert.equal(sql.prepare('SELECT count(*) n FROM replays').get().n,0);
console.log('PASS: real SQL migrations and API: 103 block IDs, mode, tags, first-place replay, metadata preservation, map/stale-run invalidation, password protection, ranking clear, >30000 discard, blank-name decline, deletion.');
