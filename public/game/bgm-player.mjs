const tracks=[
 {title:'Noraneko ha Uchu wo Mezashita - sharou',url:'./music/noraneko-ha-uchu-wo-mezashita.mp3'},
 {title:'Atorie to Denno Sekai - sharou',url:'./music/atorie-to-denno-sekai.mp3'},
 null,
 {title:'Maboroshi no Daichi, Inishie no Tsuki - SILDRA COMPANY',url:'./music/maboroshi-no-daichi-inishie-no-tsuki.mp3',startOffset:19.191133787,loopStart:19.191133787,loopEnd:131.991133787},
 {title:'Huuwari - SILDRA COMPANY',url:'./music/huuwari.mp3',startOffset:14.661065760,loopStart:14.661065760,loopEnd:188.271065760},
 null,
 {title:'Plastic Adventure - MusMus',url:'./music/plastic-adventure.mp3',volume:.30,startOffset:1.8,loopStart:16.75,loopEnd:76.52325,seamFade:.02,trimToLoop:true},
 {title:'If I Had a Chicken - Kevin MacLeod',url:'./music/if-i-had-a-chicken.mp3',startOffset:0,loopStart:30.7494375,loopEnd:91.2219375,seamFade:.015,trimToLoop:true},
 null,
];
const button=document.getElementById('bgm-player'),label=button.querySelector('.bgm-title'),viewport=button.querySelector('.bgm-title-window');
let selected=tracks.length-1,source=null,serial=0,context=null,gain=null;
const buffers=new Map();
function measure(){
 const scale=document.querySelector('#canvaswrap canvas').clientWidth/608;
 button.style.fontSize=13*scale+'px';
 label.classList.remove('bgm-scrolling');
 const distance=Math.max(0,label.scrollWidth-viewport.clientWidth);
 label.style.setProperty('--bgm-travel',-distance+'px');
 label.style.setProperty('--bgm-duration',(distance/(18*scale)+3)+'s');
 void label.offsetWidth;
 if(distance>1)label.classList.add('bgm-scrolling');
}
function show(){
 const title=tracks[selected]?.title??'OFF';
 label.textContent=title;button.title='BGM: '+title+' — Click to change';
 button.setAttribute('aria-label','BGM: '+title+'. Click to change track.');
 button.setAttribute('aria-pressed',String(Boolean(tracks[selected])));measure();
}
function stop(){if(source){source.stop();source.disconnect();source=null;}}
async function getBuffer(track){
 if(!buffers.has(track.url)){
  const pending=(async()=>{
   const response=await fetch(new URL(track.url,import.meta.url));
   if(!response.ok)throw new Error('BGM load failed: '+response.status);
   let buffer=await context.decodeAudioData(await response.arrayBuffer());
   // Keep the first-pass intro, but discard the unused later verses from decoded memory.
   if(track.trimToLoop&&track.loopEnd<buffer.duration){
    const shortened=context.createBuffer(buffer.numberOfChannels,Math.ceil(track.loopEnd*buffer.sampleRate)+2,buffer.sampleRate);
    for(let ch=0;ch<buffer.numberOfChannels;ch++)shortened.copyToChannel(buffer.getChannelData(ch).subarray(0,shortened.length),ch);
    buffer=shortened;
   }
   if(track.seamFade){
    const start=Math.round(track.loopStart*buffer.sampleRate),end=Math.round(track.loopEnd*buffer.sampleRate),length=Math.min(Math.round(track.seamFade*buffer.sampleRate),start,end);
    for(let ch=0;ch<buffer.numberOfChannels;ch++){
     const data=buffer.getChannelData(ch);
     // Blend toward the samples preceding loopStart, preserving the beat and loop duration.
     for(let i=0;i<length;i++){const mix=(i+1)/length;data[end-length+i]=data[end-length+i]*(1-mix)+data[start-length+i]*mix;}
    }
   }
   return buffer;
  })();
  buffers.set(track.url,pending);
  // Retain only the two most recently requested songs.
  while(buffers.size>2)buffers.delete(buffers.keys().next().value);
  pending.catch(()=>{if(buffers.get(track.url)===pending)buffers.delete(track.url);});
 }
 return buffers.get(track.url);
}
button.addEventListener('click',async()=>{
 const request=++serial;stop();
 selected=(selected+1)%tracks.length;show();
 if(!tracks[selected])return;
 const track=tracks[selected];
 try{
  // Resume during the user gesture; AudioBufferSource handles loop points sample accurately.
  if(!context){context=new AudioContext();gain=context.createGain();gain.gain.value=.5;gain.connect(context.destination);}
  await context.resume();
  const buffer=await getBuffer(track);
  if(request!==serial)return;
  const player=context.createBufferSource();player.buffer=buffer;player.loop=true;
  player.loopStart=track.loopStart??0;player.loopEnd=track.loopEnd??buffer.duration;
  gain.gain.value=track.volume??.5;player.connect(gain);source=player;player.start(0,track.startOffset??0);
 }catch(error){if(request!==serial)return;stop();selected=tracks.length-1;show();button.title='BGM could not play. Click to try again.';console.warn('BGM playback:',error);}
});
for(const event of ['keydown','keyup'])button.addEventListener(event,e=>e.stopPropagation());
new ResizeObserver(measure).observe(document.getElementById('canvaswrap'));
window.addEventListener('pagehide',()=>{serial++;stop();context?.suspend();});
show();
