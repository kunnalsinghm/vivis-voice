import './globals.css'
import {Playfair_Display} from 'next/font/google'
import {Provider} from '@/components/Player'
import {cfg} from '@/lib/config'
const serif=Playfair_Display({subsets:['latin'],variable:'--serif'})
export const metadata={title:cfg.title,description:cfg.tagline}
export default function L({children}:{children:React.ReactNode}){return <html lang="en"><body className={serif.variable}><Provider>
 <nav className="max-w-5xl mx-auto px-5 py-5 flex gap-5 text-sm text-white/70 flex-wrap"><a href="/" className="font-serif text-amber-200 mr-auto">Vivi's Voice</a>
  <a href="/liked">Favourites</a><a href="/for-vivi">For Vivi ❤️</a><a href="/admin">Admin</a></nav>
 <main className="max-w-5xl mx-auto px-5 pb-40">{children}</main></Provider></body></html>}
