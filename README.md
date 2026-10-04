# Vivi's Voice
Next.js + Tailwind + Supabase (free tiers). Every version of her, in sound.

## Setup (≈10 min)
1. **Supabase**: create a free project at supabase.com.
2. **SQL Editor** → paste `supabase/schema.sql` → Run. (Creates the `songs` table, the public `vivi` storage bucket, access rules, and 4 silent demo songs.)
3. **Auth → Users → Add user**: your email + password (tick auto-confirm). **Auth → Providers → Email → turn OFF "Allow new users to sign up"** so only you can log in.
4. **Settings → API**: copy Project URL and the `anon` key.
5. Locally: `cp .env.example .env.local`, fill both values, then `npm install && npm run dev` → http://localhost:3000
6. Open `/admin`, sign in, and drag all ~20 recordings onto the upload box. Titles come from filenames (`vivi_song_1.mp3` → "Vivi Song 1"). Click **Edit** on each to add title, artwork, category, year, lyrics, note. Delete the demo songs.
7. Personalise name, bio, photo URL and the For Vivi message in `lib/config.ts`.

## Deploy free
Push to GitHub → vercel.com → Import repo → add the two env vars → Deploy. Share the link with Vivi.

## Notes
- Audio sits in a *public* bucket (unguessable URLs, not listed). Fine for a private gift link; don't post the site publicly.
- Favourites and Recently Played are saved in the visitor's own browser (localStorage), so Vivi has her own.
- Free tier: 1 GB storage. ~20 recordings usually fit; compress WAVs to MP3 if you go over.
