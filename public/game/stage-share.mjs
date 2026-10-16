export function shareLinks({id,title,creator,origin}){
 const url=new URL('/?stage='+id,origin).href;
 const text=`${title||'Untitled'}\nCreator: ${creator||'Anonymous'}\n${url}`;
 return {X:'https://x.com/intent/tweet?'+new URLSearchParams({text}),Bluesky:'https://bsky.app/intent/compose?'+new URLSearchParams({text}),Threads:'https://www.threads.net/intent/post?'+new URLSearchParams({text}),Facebook:'https://www.facebook.com/sharer/sharer.php?'+new URLSearchParams({u:url})};
}
export function installStageShare(root){
 for(const [name,file] of [['X','x'],['Bluesky','bluesky'],['Threads','threads'],['Facebook','facebook']]){
  const a=document.createElement('a');a.dataset.service=name;a.className='share-'+file;a.target='_blank';a.rel='noopener noreferrer';a.title='Share on '+name;a.setAttribute('aria-label','Share on '+name);
  const img=document.createElement('img');img.src=new URL('./share-icons/'+file+'.svg',import.meta.url);img.alt='';img.draggable=false;a.append(img);root.append(a);
 }
 let previous='';
 return (visible,stage,scale)=>{
  root.hidden=!visible||stage.id<1;
  if(root.hidden)return;
  root.style.setProperty('--share-scale',String(scale));
  const signature=JSON.stringify(stage);if(signature===previous)return;previous=signature;
  const links=shareLinks(stage);for(const a of root.children)a.href=links[a.dataset.service];
 };
}
