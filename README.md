# THE FOREX PROGRAM — website

A working site: landing page, sign up, log in, dashboard (25 courses,
filterable, with progress tracking), and a video lesson page with a sidebar
playlist, dark/light theme toggle, and a black/blue design.

Auth and progress tracking now run on **Supabase** (real accounts, real
database) instead of the earlier localStorage demo.

## One-time setup (do this before testing signup/login)
1. Open your Supabase project → **SQL Editor** → New query.
2. Paste in the contents of `supabase-setup.sql` (included in this folder)
   and click **Run**. This creates the `progress` table and locks it down
   so each user can only read/write their own rows (Row Level Security).
3. In Supabase → **Authentication → Providers**, confirm **Email** is
   enabled (on by default).
4. By default, Supabase requires **email confirmation** before a new
   account can log in. For faster testing, you can turn this off at
   Authentication → Providers → Email → "Confirm email" toggle. Leave it
   on for a real launch.

## Run it
Open `index.html` in a browser, or serve the folder locally
(`npx serve .`) so routing behaves correctly. No build step.

## What's real now
- Full page structure, styling, dark/light theme (toggle persists locally).
- **Real signup / login / logout** via Supabase Auth.
- **Real per-user progress tracking**, stored in a Postgres table
  (`public.progress`), protected by Row Level Security so users can only
  see their own data.
- Route protection: dashboard and lesson pages redirect to `login.html`
  if you're not signed in.
- 25-lesson catalog in `js/courses-data.js` — edit titles/descriptions/
  durations there.

## What's still a placeholder
**The video player is a placeholder frame**, not a real player. To play
actual video you'll want a streaming provider (Cloudflare Stream, Mux, or
Bunny Stream) — they handle adaptive streaming, signed/expiring URLs, and
watermarking far better than hosting raw video files yourself. Swap the
`.fallback` block in `course.html` for their embed/player code once you
pick one.

**Content protection is a light deterrent, not real DRM.** Right-click is
disabled on the video area and each lesson shows the logged-in user's
email as a watermark (so a leak is traceable). Neither of these — nor
anything else, on any platform — can stop someone screen-recording. Treat
this as "reduce casual sharing," not "impossible to copy."

## Your Supabase credentials
Already wired into `js/supabase-client.js`:
- Project URL: `https://sltxydcvjhaaldokcmbv.supabase.co`
- Publishable (anon) key: safe to expose in frontend code — it's
  public-facing by design and gated by the Row Level Security policies in
  `supabase-setup.sql`.

## Suggested next steps
1. Run `supabase-setup.sql` in Supabase if you haven't yet (see above).
2. Test signup → check the account shows up in Supabase → Authentication
   → Users.
3. Pick a video host (Cloudflare Stream is simple to wire up) and swap
   the player in `course.html`.
4. Buy a domain and deploy (Vercel or Netlify both work well for a static
   site like this).
