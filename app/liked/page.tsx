'use client'
import {useApp,Grid} from '@/components/Player'
export default function Liked(){const {songs,favs,play,setShuffle}=useApp();const l=songs.filter((s:any)=>favs.includes(s.id))
 return <div className="space-y-6"><h1 className="font-serif text-4xl">Favourites</h1>
  {l.length?<><div className="flex gap-3"><button className="btn" onClick={()=>{setShuffle(false);play(l[0],l)}}>▶ Play all</button>
   <button className="btn ghost" onClick={()=>{setShuffle(true);play(l[Math.floor(Math.random()*l.length)],l)}}>⇄ Shuffle</button></div>
   <Grid list={l}/><p className="text-sm text-white/40">Tap ♥ on a card to remove a favourite.</p></>:<p className="text-white/60">No favourites yet — tap ♡ on any song.</p>}</div>}
