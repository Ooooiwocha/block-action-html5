import {stagePreview,previewBlockVisible} from '@/lib/stage-preview';
export default function StageThumbnail({id,cells,mode,tileColor}:{id:number;cells:number[];mode:string;tileColor:(n:number)=>string}){
 const p=stagePreview(cells,mode),mask='stage-dark-mask-'+id;
 return <svg viewBox="0 0 480 448" aria-hidden="true" className="stage-map" data-mode={mode}>
 {p.obscured&&<defs><mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="448"><rect width="480" height="448" fill="white"/>{p.lights.map((l,i)=><circle key={i} cx={l.x} cy={l.y} r={p.radius} fill="black"/>)}</mask></defs>}
 {cells.map((n,i)=>previewBlockVisible(n)?<rect key={i} x={Math.floor(i/28)*16} y={(i%28)*16} width="16" height="16" fill={tileColor(n)} fillOpacity={[38,39,43].includes(n)?0.24:1}/>:null)}
 {p.obscured&&<><rect width="480" height="448" fill="black" mask={'url(#'+mask+')'}/>{p.checkpoints.map((c,i)=><rect key={i} x={c.x-6} y={c.y-6} width="12" height="12" fill={tileColor(99)}/>)}</>}
 </svg>;
}
