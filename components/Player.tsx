'use client'
import {createContext,useContext,useEffect,useRef,useState,useCallback} from 'react'
import {sb,fmt,Song} from '@/lib/supabase'
const Ctx=createContext<any>(null);export const useApp=()=>useContext(Ctx)
const ls=(k:string,d:any)=>{try{return JSON.parse(localStorage.getItem(k)||'')||d}catch{return d}}
export function Art({s,cls=''}:{s?:Song;cls?:string}){return s?.artwork_url?<img src={s.artwork_url} alt="" className={`object-cover ${cls}`}/>:
<div className={`flex items-center justify-center font-serif text-4xl text-amber-200/80 bg-gradient-to-br from-[#6b3a22] via-[#3a1f16] to-[#1c1210] ${cls}`}>{(s?.title||'V')[0]}</div>}
const Btn=({on,children,c=''}:any)=><button onClick={on} className={`w-10 h-10 rounded-full hover:bg-white/10 ${c}`}>{children}</button>
function Controls(){const {toggle,playing,prev,next,shuffle,setShuffle,repeat,setRepeat}=useApp()
 return <div className="flex items-center justify-center gap-1">
  <Btn on={()=>setShuffle(!shuffle)} c={shuffle?'text-amber-400':''}>⇄</Btn><Btn on={prev}>⏮</Btn>
  <button onClick={toggle} className="btn !w-12 !h-12 !p-0">{playing?'❚❚':'▶'}</button><Btn on={next}>⏭</Btn>
  <Btn on={()=>setRepeat(!repeat)} c={repeat?'text-amber-400':''}>↻</Btn></div>}
function Seek(){const {a,t,dur}=useApp()
 return <div className="flex items-center gap-2 text-xs text-white/60"><span>{fmt(t)}</span>
  <input type="range" min={0} max={dur||0} step={0.1} value={t} onChange={e=>{if(a.current)a.current.currentTime=+e.target.value}} className="flex-1"/><span>{fmt(dur)}</span></div>}
export function Provider({children}:any){
 const [songs,setSongs]=useState<Song[]>([]),[loaded,setLoaded]=useState(false)
 const [queue,setQueue]=useState<Song[]>([]),[cur,setCur]=useState<Song|null>(null)
 const [playing,setPlaying]=useState(false),[t,setT]=useState(0),[dur,setDur]=useState(0)
 const [vol,setVol]=useState(1),[muted,setMuted]=useState(false),[shuffle,setShuffle]=useState(false),[repeat,setRepeat]=useState(false)
 const [favs,setFavs]=useState<string[]>([]),[recent,setRecent]=useState<string[]>([]),[open,setOpen]=useState(false),[lyr,setLyr]=useState(false)
 const a=useRef<HTMLAudioElement>(null)
 const reload=useCallback(async()=>{const {data}=await sb.from('songs').select('*').order('created_at');setSongs(data||[]);setLoaded(true)},[])
 useEffect(()=>{reload();setFavs(ls('favs',[]));setRecent(ls('recent',[]))},[reload])
 const start=(s:Song)=>{const e=a.current;if(e&&s.audio_url){if(cur?.id!==s.id)e.src=s.audio_url;e.currentTime=0;e.play().catch(()=>{})}
  setCur(s);const r=[s.id,...recent.filter(i=>i!==s.id)].slice(0,10);setRecent(r);localStorage.setItem('recent',JSON.stringify(r))}
 const toggle=()=>{const e=a.current;if(!e||!cur)return;if(e.paused)e.play().catch(()=>{});else e.pause()}
 const play=(s:Song,list?:Song[])=>{if(cur?.id===s.id){toggle();return}
  if(list)setQueue(list);else if(!queue.length)setQueue(songs);start(s)}
 const step=(d:number)=>{if(!queue.length||!cur)return;const i=queue.findIndex(x=>x.id===cur.id)
  start(shuffle&&queue.length>1?queue.filter(x=>x.id!==cur.id)[Math.floor(Math.random()*(queue.length-1))]:queue[(i+d+queue.length)%queue.length])}
 const fav=(id:string)=>{const f=favs.includes(id)?favs.filter(i=>i!==id):[...favs,id];setFavs(f);localStorage.setItem('favs',JSON.stringify(f))}
 useEffect(()=>{if(a.current){a.current.volume=vol;a.current.muted=muted}},[vol,muted])
 const v={songs,loaded,reload,play,fav,favs,recent,cur,playing,toggle,next:()=>step(1),prev:()=>step(-1),shuffle,setShuffle,repeat,setRepeat,queue,a,t,dur}
 return <Ctx.Provider value={v}>{children}
 <audio ref={a} preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onTimeUpdate={e=>setT(e.currentTarget.currentTime)}
  onLoadedMetadata={e=>setDur(e.currentTarget.duration)} onEnded={()=>{if(repeat){a.current!.currentTime=0;a.current!.play()}else step(1)}}/>
 {cur&&!open&&<div className="fixed bottom-0 inset-x-0 z-40 bg-black/80 backdrop-blur-xl border-t border-white/10 px-4 py-2">
  <div className="max-w-5xl mx-auto flex items-center gap-3">
   <button onClick={()=>setOpen(true)} className="flex items-center gap-3 flex-1 min-w-0 text-left"><Art s={cur} cls="w-12 h-12 rounded-lg !text-xl"/>
    <div className="min-w-0"><div className="truncate font-medium">{cur.title}</div><div className="text-xs text-white/50">Vivi</div></div></button>
   <div className="hidden md:block w-96"><Controls/><Seek/></div>
   <div className="md:hidden flex"><Btn on={v.prev}>⏮</Btn><button onClick={toggle} className="btn !w-11 !h-11 !p-0">{playing?'❚❚':'▶'}</button><Btn on={v.next}>⏭</Btn></div>
   <div className="hidden md:flex items-center gap-1 w-36"><Btn on={()=>setMuted(!muted)}>{muted||!vol?'🔇':'🔊'}</Btn>
    <input type="range" min={0} max={1} step={0.01} value={vol} onChange={e=>{setVol(+e.target.value);setMuted(false)}} className="w-20"/></div></div>
  <div className="md:hidden h-1 bg-white/10 rounded mt-1"><div className="h-1 bg-amber-400 rounded" style={{width:`${dur?t/dur*100:0}%`}}/></div></div>}
 {cur&&open&&<div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#4a2a1b] to-[#0e0b0a] fade"><div className="max-w-md mx-auto p-6 space-y-5">
  <button onClick={()=>setOpen(false)} className="text-2xl">⌄</button>
  <Art s={cur} cls={`w-full aspect-square rounded-3xl shadow-2xl transition-transform duration-700 ${playing?'scale-100':'scale-90'}`}/>
  <div className="flex justify-between items-center"><div><h2 className="font-serif text-3xl">{cur.title}</h2><p className="text-white/60">Vivi</p></div>
   <Btn on={()=>fav(cur.id)} c="text-2xl">{favs.includes(cur.id)?'♥':'♡'}</Btn></div>
  <Seek/><Controls/>
  <button onClick={()=>setLyr(!lyr)} className="btn ghost w-full">{lyr?'Hide':'Show'} lyrics</button>
  {lyr&&<p className="whitespace-pre-wrap leading-8 text-lg fade">{cur.lyrics||'No lyrics yet.'}</p>}
  {cur.personal_note&&<blockquote className="border-l-2 border-amber-400 pl-4 italic text-white/80">{cur.personal_note}</blockquote>}</div></div>}
 </Ctx.Provider>}
export function Card({s,list}:{s:Song;list:Song[]}){const {play,fav,favs,cur,playing}=useApp()
 return <div className="group fade rounded-2xl bg-white/5 hover:bg-white/10 p-3 transition hover:-translate-y-1">
  <div className="relative"><a href={`/song/${s.id}`}><Art s={s} cls="w-full aspect-square rounded-xl"/></a>
   <button onClick={()=>play(s,list)} className="btn !p-0 w-12 h-12 absolute bottom-2 right-2 md:opacity-0 group-hover:opacity-100">{cur?.id===s.id&&playing?'❚❚':'▶'}</button></div>
  <div className="flex items-center justify-between mt-3"><div className="min-w-0"><a href={`/song/${s.id}`} className="block truncate font-medium">{s.title}</a>
   <span className="text-xs text-white/50">{fmt(s.duration||0)} · {s.category}</span></div>
   <button onClick={()=>fav(s.id)} className="text-xl p-1">{favs.includes(s.id)?'♥':'♡'}</button></div></div>}
export const Grid=({list}:{list:Song[]})=><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{list.map(s=><Card key={s.id} s={s} list={list}/>)}</div>
