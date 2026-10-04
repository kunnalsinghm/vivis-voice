'use client'
import {useState} from 'react'
import {useApp,Grid,Art} from '@/components/Player'
import {cfg} from '@/lib/config'
export default function Home(){const {songs,loaded,recent,favs,play}=useApp();const [q,setQ]=useState('')
 const f=songs.filter((s:any)=>`${s.title} ${s.category} ${s.lyrics||''}`.toLowerCase().includes(q.toLowerCase()))
 const rec=recent.map((i:string)=>songs.find((s:any)=>s.id===i)).filter(Boolean),fv=songs.filter((s:any)=>favs.includes(s.id))
 if(loaded&&!songs.length)return <div className="text-center py-32 space-y-4"><h1 className="font-serif text-4xl">Vivi’s voice is waiting here.</h1>
  <p className="text-white/60">Upload her first recording to begin.</p><a href="/admin" className="btn inline-block">Upload Recording</a></div>
 return <div className="space-y-12">
  <header className="fade text-center pt-6 space-y-3"><h1 className="font-serif text-5xl md:text-7xl tracking-wide">VIVI’S VOICE</h1>
   <p className="text-amber-200/80 italic text-lg">{cfg.tagline}</p></header>
  {songs[0]&&<section className="rounded-3xl bg-white/5 p-5 md:p-8 flex flex-col md:flex-row gap-6 items-center fade">
   {cfg.photo?<img src={cfg.photo} className="w-56 h-56 rounded-2xl object-cover"/>:<Art s={songs[songs.length-1]} cls="w-56 h-56 rounded-2xl"/>}
   <div className="space-y-3 text-center md:text-left"><p className="text-xs uppercase tracking-widest text-white/50">{cfg.name} · {songs.length} recordings</p>
    <h2 className="font-serif text-3xl">{cfg.bio}</h2>
    <button className="btn" onClick={()=>play(songs[0],songs)}>▶ Play all</button></div></section>}
  <section className="space-y-4"><div className="flex items-center gap-4"><h2 className="font-serif text-2xl flex-1">Her Songs</h2>
   <input className="inp !w-48" placeholder="Search title, lyrics…" value={q} onChange={e=>setQ(e.target.value)}/></div><Grid list={f}/></section>
  {!q&&rec.length>0&&<section className="space-y-4"><h2 className="font-serif text-2xl">Recently Played</h2><Grid list={rec}/></section>}
  {!q&&fv.length>0&&<section className="space-y-4"><h2 className="font-serif text-2xl">My Favourites</h2><Grid list={fv}/></section>}</div>}
