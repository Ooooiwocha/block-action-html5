"use client";
import {useEffect,useRef} from 'react';
import {prepareGuideIcons} from '../public/game/guide-icons.mjs';
export default function BlockIcon({id}:{id:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{let active=true;
  prepareGuideIcons().then((draw:(canvas:HTMLCanvasElement,id:number)=>void)=>{if(active&&ref.current)draw(ref.current,id);}).catch((error:unknown)=>console.error('Block guide image:',error));
  return()=>{active=false;};
 },[id]);
 return <canvas ref={ref} width={64} height={64} className="block-guide-icon" aria-hidden="true"/>;
}
