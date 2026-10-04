'use client'
import {useEffect,useState} from 'react'
import {sb,BUCKET,Song} from '@/lib/supabase'
import {useApp} from '@/components/Player'
const CATS=['Songs','Covers','Voice Notes','Live','Unreleased']
const pub=(p:string)=>sb.storage.from(BUCKET).getPublicUrl(p).data.publicUrl
const clean=(n:string)=>n.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
const getDur=(f:File)=>new Promise<number>(r=>{const a=new Audio(URL.createObjectURL(f));a.onloadedmetadata=()=>r(Math.round(a.duration)||0);a.onerror=()=>r(0)})
function Row({s,done}:{s:Song;done:()=>void}){const [f,setF]=useState<any>(s),[open,setOpen]=useState(false),[msg,setMsg]=useState('')
 const set=(k:string,v:any)=>setF((p:any)=>({...p,[k]:v}))
 const save=async()=>{const {error}=await sb.from('songs').update({title:f.title,category:f.category,year:f.year||null,lyrics:f.lyrics,description:f.description,personal_note:f.personal_note,artwork_url:f.artwork_url}).eq('id',s.id)
  setMsg(error?error.message:'Saved âœ“');done()}
 const art=async(file?:File)=>{if(!file)return;const p=`art/${Date.now()}-${file.name.replace(/[^\w.-]/g,'_')}`
  const {error}=await sb.storage.from(BUCKET).upload(p,file);if(!error){set('artwork_url',pub(p));setMsg('Artwork added â€” press Save')}else setMsg(error.message)}
 const del=async()=>{if(!confirm(`Delete "${s.title}"?`))return
  const m=s.audio_url.split(`/${BUCKET}/`)[1];if(m)await sb.storage.from(BUCKET).remove([m]);await sb.from('songs').delete().eq('id',s.id);done()}
 return <div className="rounded-2xl bg-white/5 p-4 space-y-3"><div className="flex items-center gap-3"><span className="flex-1 truncate">{s.title}</span>
  <button className="btn ghost" onClick={()=>setOpen(!open)}>{open?'Close':'Edit'}</button><button className="btn ghost" onClick={del}>Delete</button></div>
  {open&&<div className="grid gap-2"><input className="inp" value={f.title} onChange={e=>set('title',e.target.value)} placeholder="Title"/>
   <div className="flex gap-2"><select className="inp" value={f.category} onChange={e=>set('category',e.target.value)}>{CATS.map(c=><option key={c} className="text-black">{c}</option>)}</select>
    <input className="inp" type="number" placeholder="Year" value={f.year||''} onChange={e=>set('year',e.target.value)}/></div>
   <input className="inp" placeholder="Description" value={f.description||''} onChange={e=>set('description',e.target.value)}/>
   <textarea className="inp" rows={2} placeholder="Personal note" value={f.personal_note||''} onChange={e=>set('personal_note',e.target.value)}/>
   <textarea className="inp" rows={6} placeholder="Lyrics" value={f.lyrics||''} onChange={e=>set('lyrics',e.target.value)}/>
   <label className="text-sm text-white/60">Artwork <input type="file" accept="image/*" onChange={e=>art(e.target.files?.[0])}/></label>
   <div className="flex items-center gap-3"><button className="btn" onClick={save}>Save</button><span className="text-sm">{msg}</span></div></div>}</div>}
export default function Admin(){const {songs,reload}=useApp();const [user,setUser]=useState<any>(null),[em,setEm]=useState(''),[pw,setPw]=useState(''),[err,setErr]=useState('')
 const [ups,setUps]=useState<{name:string;st:string}[]>([]),[drag,setDrag]=useState(false)
 useEffect(()=>{sb.auth.getSession().then(({data})=>setUser(data.session?.user??null));const {data}=sb.auth.onAuthStateChange((_,s)=>setUser(s?.user??null));return()=>data.subscription.unsubscribe()},[])
 const upload=async(files:File[])=>{setUps(files.map(f=>({name:f.name,st:'waitingâ€¦'})))
  for(let i=0;i<files.length;i++){const f=files[i],u=(st:string)=>setUps(p=>p.map((x,j)=>j===i?{...x,st}:x));u('uploadingâ€¦')
   const p=`audio/${Date.now()}-${f.name.replace(/[^\w.-]/g,'_')}`
   const {error}=await sb.storage.from(BUCKET).upload(p,f,{contentType:f.type||undefined});if(error){u('âŒ '+error.message);continue}
   const {error:e2}=await sb.from('songs').insert({title:clean(f.name),audio_url:pub(p),duration:await getDur(f)});u(e2?'âŒ '+e2.message:'âœ“ done')}
  reload()}
 if(!user)return <div className="max-w-sm mx-auto space-y-3 pt-10"><h1 className="font-serif text-3xl">Admin</h1>
  <input className="inp" placeholder="Email" value={em} onChange={e=>setEm(e.target.value)}/><input className="inp" type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)}/>
  <button className="btn w-full" onClick={async()=>{const {error}=await sb.auth.signInWithPassword({email:em,password:pw});setErr(error?.message||'')}}>Sign in</button><p className="text-red-300 text-sm">{err}</p></div>
 return <div className="space-y-8"><div className="flex items-center"><h1 className="font-serif text-3xl flex-1">Admin</h1><button className="btn ghost" onClick={()=>sb.auth.signOut()}>Sign out</button></div>
  <label onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);upload(Array.from(e.dataTransfer.files))}}
   className={`block text-center rounded-3xl border-2 border-dashed p-10 cursor-pointer ${drag?'border-amber-400 bg-white/10':'border-white/20'}`}>
   Drag recordings here or click to choose (MP3, WAV, M4A, AAC, OGG)
   <input type="file" multiple accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg" className="hidden" onChange={e=>e.target.files&&upload(Array.from(e.target.files))}/></label>
  {ups.map((u,i)=><div key={i} className="text-sm flex justify-between"><span>{u.name}</span><span>{u.st}</span></div>)}
  <div className="space-y-3"><h2 className="font-serif text-xl">Songs ({songs.length})</h2>{songs.map((s:Song)=><Row key={s.id} s={s} done={reload}/>)}</div></div>}

