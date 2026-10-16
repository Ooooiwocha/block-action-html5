import {stageMode} from '@/lib/stage-replay';
import {database} from '@/lib/game-db';
type PublicStage={id:number;title:string;name:string;cells:string;mode:string;dark_chamber:number;pickup:number;plays:number;comments:number};
export async function GET(){
 try{
  const result=await database().prepare('SELECT s.id,s.title,s.name,s.cells,s.mode,s.dark_chamber,s.pickup,s.pn+s.retn AS plays,(SELECT COUNT(*) FROM comments c WHERE c.stage_id=s.id) AS comments FROM stages s WHERE s.deleted=0 ORDER BY s.id DESC LIMIT 100').all<PublicStage>();
  return Response.json(result.results.map(s=>({...s,cells:JSON.parse(s.cells),mode:stageMode(s.mode,!!s.dark_chamber)})),{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('Stage list unavailable',error);return Response.json({error:'ステージを読み込めませんでした。'},{status:503});}
}
