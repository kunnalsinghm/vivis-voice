'use client'
import {useApp,Grid} from '@/components/Player'
import {cfg} from '@/lib/config'
export default function ForVivi(){const {songs,favs,play}=useApp();const l=songs.filter((s:any)=>favs.includes(s.id));const list=l.length?l:songs
 return <div className="text-center space-y-10 pt-10 fade"><h1 className="font-serif text-6xl text-amber-200">For Vivi ❤️</h1>
  <p className="max-w-xl mx-auto text-xl leading-9 font-serif italic text-white/85">{cfg.message}</p>
  <h2 className="font-serif text-2xl">Songs I Love Hearing You Sing</h2>
  {list[0]&&<button className="btn !text-lg !px-8 !py-4" onClick={()=>play(list[0],list)}>Play Our Playlist</button>}
  <p className="text-xs text-white/40">(Playlist = your favourites; if none, all songs.)</p><div className="text-left"><Grid list={list}/></div></div>}
