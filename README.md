# Red Panda — public website

The official public website for **Red Panda**, a short-drama streaming app.

Four static pages, no database, no authentication, no backend calls, no secrets.
It exists to serve the surfaces Google Play requires before the app can be
published, and to be a simple, honest brand presence.

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/privacy` | Privacy Policy — English and Bahasa Indonesia |
| `/delete-account` | Account deletion, including the only route available to Google and WhatsApp accounts |
| `/support` | Support topics and contact |
| `/app-ads.txt` | AdMob authorized sellers (placeholder — see below) |
| `/robots.txt`, `/sitemap.xml` | Generated at build time |

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4,
Vitest with React Testing Library. Every route is prerendered to static HTML.

## Getting started

```bash
npm ci
npm run dev      # http://127.0.0.1:3000
```

```bash
npm run lint
npm test
npm run build
```

## Configuration

Three optional public variables — see [`.env.example`](./.env.example).

| Variable | Unset behaviour |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | No canonical URLs, empty sitemap, every page `noindex`, robots disallows all |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | `/support` and `/delete-account` say contact details are being finalized |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | The homepage shows a non-clickable "Coming to Google Play" status |

They are inlined at build time and are permanently public. **No secret may ever
go in a `NEXT_PUBLIC_*` variable** — this site has none and needs none.

## Content and assets — where everything came from

Nothing on the homepage is invented. Every piece of content traces to one of the
two product repositories, both of which were read **read-only** and neither of
which was modified.

| On the site | Source |
|---|---|
| The four series titles, genres and episode counts | `short-drama-backend-v1-release-gate` → `src/videos/videos.data.ts`, the array `prisma/seed.ts` seeds the `Video` table from. Mirrored in [`src/lib/catalog.ts`](./src/lib/catalog.ts) and pinned by a test that holds an independent copy of the list. |
| Colours, gradient, type and poster ratio | `mobile-app-redpanda-secure-session` → `src/constants/theme.ts` (`Palette`, `Gradients`, `Radius`, `FontFamily`) and `POSTER_ASPECT_RATIO` |
| The poster fallback treatment | The app's own `PosterFallback` in `src/features/discover/discover-poster.tsx` |
| App mockup labels and controls | The app's English strings in `src/services/i18n/translations.ts`, plus the real 360p/540p/720p rendition ladder |

**No image asset was copied, because none exists.** Series covers live in a
private Cloudflare R2 bucket and reach clients only as short-lived presigned
URLs — there is no cover file in either repository. There is also no Red Panda
logo: the mobile app still ships Expo's stock icon, and `logo-glow.png` there is
a template gradient. Until artwork is committed to
[`public/posters/`](./public/posters/README.md), every tile renders the same
branded fallback the app itself shows for a series with no cover.

The homepage deliberately carries **no view counts, ratings, rankings or
download numbers.** The backend records none of them, so each one would be a
number invented to make the page look busier.

## The rule this repository is built on

Red Panda has no domain, no support mailbox, no AdMob account and no Play
listing yet. Nothing in this repository invents one.

Every value that does not exist yet comes from configuration, and every surface
that would use it renders an honest "not available" state instead. A URL that
404s is worse than no link, and a fabricated one in a store listing is a policy
problem rather than a cosmetic one. The mobile app follows the same rule for the
two URLs it consumes from this site — see its `src/constants/legal.ts`.

The tests enforce it: no hardcoded Play URL, no invented publisher id, no
localhost or LAN host, no API origin, no committed environment value.

## Documentation

| | |
|---|---|
| [PRIVACY_FACT_INVENTORY.md](./docs/PRIVACY_FACT_INVENTORY.md) | The audit of the mobile and backend repositories that the Privacy Policy and deletion page are written from. **Read this before editing legal copy.** |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Requirements, environment, security headers, static export, post-deploy checks, Cloudflare and Vercel notes |
| [DOMAIN_CHECKLIST.md](./docs/DOMAIN_CHECKLIST.md) | Recommended DNS topology and the order to set it up in |
| [ADMOB_APP_ADS_SETUP.md](./docs/ADMOB_APP_ADS_SETUP.md) | How to finish `public/app-ads.txt` |

## Still needed from outside this repository

- The root domain
- The support email address
- The real AdMob `app-ads.txt` line
- The Google Play listing URL, once the app is live
- The legal entity operating Red Panda, if one exists
