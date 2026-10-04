import {createClient} from '@supabase/supabase-js'
export const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export const BUCKET='vivi'
export type Song={id:string;title:string;audio_url:string;artwork_url:string|null;category:string;year:number|null;lyrics:string|null;description:string|null;personal_note:string|null;duration:number|null;created_at:string}
export const fmt=(s:number)=>!s||isNaN(s)?'0:00':`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
