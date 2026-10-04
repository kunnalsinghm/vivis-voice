'use client'
import {useParams} from 'next/navigation'
import {useApp,Art} from '@/components/Player'
export default function SongPage(){const {id}=useParams();const {songs,play,fav,favs}=useApp();const s=songs.find((x:any)=>x.id===id)
 if(!s)return <p className="py-20 text-white/60">Loading…</p>
 return <div className="fade grid md:grid-cols-2 gap-8 pt-4"><Art s={s} cls="w-full aspect-square rounded-3xl"/>
  <div className="space-y-4"><p className="text-xs uppercase tracking-widest text-white/50">{s.category}{s.year&&` · ${s.year}`}</p>
   <h1 className="font-serif text-5xl">{s.title}</h1><p className="text-white/60">Vivi</p>
   <div className="flex gap-3"><button className="btn" onClick={()=>play(s,songs)}>▶ Play</button>
    <button className="btn ghost" onClick={()=>fav(s.id)}>{favs.includes(s.id)?'♥ Favourited':'♡ Favourite'}</button></div>
   {s.description&&<p className="text-white/70">{s.description}</p>}
   {s.personal_note&&<blockquote className="border-l-2 border-amber-400 pl-4 italic text-lg">{s.personal_note}</blockquote>}
   {s.lyrics&&<div><h3 className="font-serif text-xl mb-2">Lyrics</h3><p className="whitespace-pre-wrap leading-8 text-white/80">{s.lyrics}</p></div>}</div></div>}
