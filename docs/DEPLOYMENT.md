# Deployment

The Red Panda public website. Four static pages, no database, no authentication,
no backend calls, no secrets.

This document is provider-neutral first. Provider notes for Cloudflare and
Vercel are at the end.

**Nothing here has been deployed.** No account was created and no hostname was
registered from this repository.

---

## 1. Requirements

| | |
|---|---|
| **Node.js** | **20.9.0 or later** (Next.js 16 minimum; Node 18 is not supported). Developed on Node 24. |
| **Package manager** | npm. `package-lock.json` is committed — use `npm ci` in CI, not `npm install`. |
| **Install** | `npm ci` |
| **Build** | `npm run build` |
| **Output** | `.next/` — every route prerendered to static HTML at build time |
| **Start** | `npm run start` (serves on port 3000; `PORT` overrides) |
| **Lint** | `npm run lint` |
| **Test** | `npm test` |

Next.js 16 uses Turbopack for both `dev` and `build` by default.

### Verify before you deploy

```bash
npm ci
npm run lint
npm test
npm run build
```

All four must pass. `npm run build` also runs the TypeScript check and fails the
build on a type error — that is configured explicitly in `next.config.ts` so it
cannot be relaxed by accident.

The build output should show every route marked `○ (Static)`. If a route ever
becomes dynamic, something has been added that this site does not need.

## 2. Environment variables

All three are **optional**. The site builds and serves correctly with none of
them set; each surface renders an honest "not available yet" state rather than a
broken link. See [`.env.example`](../.env.example).

| Variable | Effect when set | Effect when unset |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, Open Graph `url`, `sitemap.xml` entries, and the `Sitemap:` line in `robots.txt` | No canonical is emitted, the sitemap is empty, every page is `noindex`, and `robots.txt` disallows everything |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | `mailto:` links on `/support` and `/delete-account` | Both pages state that contact details are being finalized |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | The homepage call to action becomes a real Play link | The homepage shows a non-clickable "Coming to Google Play" status |

Three things to know about these:

1. **They are build-time values.** `NEXT_PUBLIC_*` variables are inlined into
   the output when `next build` runs. Changing one in your host's dashboard does
   nothing until you **rebuild and redeploy**.
2. **They are permanently public.** They ship inside the JavaScript bundle.
   Never put a secret in one. This site has no secrets and needs none: it makes
   no server-side calls, holds no credentials, and talks to no API.
3. **`NEXT_PUBLIC_GOOGLE_PLAY_URL` is host-checked.** Only a `play.google.com`
   URL is accepted. Anything else is ignored and the status badge stays.

### Set `NEXT_PUBLIC_SITE_URL` for the real deployment

This is the one you must not forget. Without it the production site is
`noindex` with a `Disallow: /` robots file — correct behaviour for a preview,
wrong for the real thing.

Leave it **unset** on preview and branch deployments, deliberately, so a preview
never competes with the production site in a search index.

## 3. Domain and HTTPS

- Serve over **HTTPS**. The mobile app only accepts an absolute `https` URL for
  the privacy-policy and account-deletion links; an `http` URL is rejected at
  the client and the link row simply does not render.
- Decide **bare host or `www`** and redirect the other to it permanently. Pick
  the same one you put in `NEXT_PUBLIC_SITE_URL`, in the Google Play listing,
  and in the app's `EXPO_PUBLIC_*` URLs. A mismatch breaks `app-ads.txt`
  verification.
- See [DOMAIN_CHECKLIST.md](./DOMAIN_CHECKLIST.md) for the full topology.

## 4. Security headers

`next.config.ts` sets them on every response: a Content-Security-Policy,
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` and `Strict-Transport-Security`. `poweredByHeader` is off.

Two deliberate choices, both documented in the config file itself:

- **`script-src` allows `'unsafe-inline'`.** Next.js prerenders these pages at
  build time and a per-request nonce cannot be issued for a static page.
  Removing the allowance would mean giving up static rendering. The rest of the
  policy still holds: no external script origin, no framing, no plugins, no
  outbound connections, no form posting.
- **HSTS omits `includeSubDomains` and `preload`.** The planned topology puts
  the API and the streaming gateway on sibling subdomains, and this website
  should not commit them to HTTPS-only on their behalf. Add
  `includeSubDomains` once every subdomain of the root domain is HTTPS-only and
  you are confident it will stay that way; add `preload` only after that has
  been true for a while, because it is very hard to reverse.

**Verify after deploying:**

```bash
curl -sSI https://<your-domain>/ | grep -iE \
  'content-security-policy|x-frame-options|x-content-type|referrer-policy|strict-transport|permissions-policy'
```

If nothing comes back, your host is not applying `next.config.ts` headers — see
the static-export note below.

## 5. Static export — when and how

This site is a genuine candidate for `output: 'export'`: all four pages are
static, there are no dynamic routes, no route handlers, no cookies, no server
actions and no image optimization. `robots.ts` and `sitemap.ts` are both
generated at build time and work under static export.

**The one thing you lose is `headers()`**, which is a server feature. Static
export means the security headers above must move to your host's own
configuration.

To switch:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  // `headers()` no longer applies — move it to the host. See below.
};
```

`npm run build` then writes a plain static site to `out/`, which any static host
serves with no adapter and no Node runtime.

For Cloudflare Pages, create `public/_headers`:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=63072000
```

For Vercel, the same values go in `vercel.json` under `headers`.

**Recommendation:** stay on the default output if you deploy to Vercel — the
headers work with no extra file to keep in sync. Switch to static export if you
deploy to Cloudflare Pages or any plain static host, and add `public/_headers`
in the same commit. Whichever you choose, run the `curl -I` check above
afterwards; a security header that silently stopped being applied is the failure
mode here.

## 6. Post-deploy checklist

```bash
DOMAIN=https://<your-domain>

for path in / /privacy /delete-account /support /app-ads.txt /robots.txt /sitemap.xml; do
  printf '%s -> ' "$path"
  curl -sSL -o /dev/null -w '%{http_code}\n' "$DOMAIN$path"
done
```

Then confirm by eye:

- [ ] All seven return **200**.
- [ ] `/app-ads.txt` is served as `text/plain` from the **root** of the domain.
- [ ] `/robots.txt` says `Allow: /` and carries a `Sitemap:` line — if it says
      `Disallow: /`, `NEXT_PUBLIC_SITE_URL` was not set at build time.
- [ ] `/sitemap.xml` lists all four pages with your real domain.
- [ ] View source on `/privacy`: the `<link rel="canonical">` points at your
      domain, and there is no `noindex` robots meta.
- [ ] `/support` and `/delete-account` show either a real `mailto:` link or the
      honest "being finalized" text — never a placeholder address.
- [ ] The homepage shows either a real Play link or the "Coming to Google Play"
      status — never a link that 404s.
- [ ] Security headers are present (§4).
- [ ] The browser console is clean on all four pages — no hydration warning, no
      failed request.

## 7. Linking the site to Google Play and to the app

Once the site is live, three places need the URLs:

**Play Console → Store listing → Store settings:**
- Privacy policy URL → `https://<domain>/privacy`
- Developer website (contact details) → `https://<domain>`

**Play Console → App content → Data safety:**
- Account deletion URL → `https://<domain>/delete-account`

**The mobile app's build environment** (`mobile-app-redpanda-secure-session`):

```
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://<domain>/privacy
EXPO_PUBLIC_ACCOUNT_DELETION_URL=https://<domain>/delete-account
```

The app's `release:preflight` treats an unset privacy-policy URL as a release
blocker, and its `constants/legal.ts` accepts only an absolute `https` URL — a
typo produces no link row rather than a broken one.

> **The mobile repository documents a trap here that applies to it, not to this
> site, but is worth knowing:** Expo inlines `EXPO_PUBLIC_*` values into the
> JavaScript bundle and the Metro cache can serve stale ones. Their build step
> requires `expo export --clear` and a verification pass over the built artifact.
> See that repo's `docs/play-store-v1-owner-checklist.md` §9.

---

## Provider notes

### Cloudflare

For a site this shape, **Cloudflare Pages with static export is the better
fit** than running Next.js on Workers. It needs no adapter, no Node runtime and
no build plugin.

1. Set `output: 'export'` and add `public/_headers` (§5).
2. Connect the repository in the Cloudflare dashboard.
3. Build command `npm run build`, output directory **`out`**.
4. Set `NEXT_PUBLIC_*` variables under **Production** only. Leave them unset for
   Preview so branch deployments stay `noindex`.
5. Add the custom domain; Cloudflare issues the certificate.
6. Verify the headers with the `curl -I` check — this is the step people skip,
   and a missing `_headers` file fails silently.

If you would rather keep the default output, deploy to **Cloudflare Workers**
using the OpenNext adapter. It works, and `next.config.ts` headers apply, but it
adds a dependency and a build step this site does not otherwise need.

### Vercel

The zero-configuration path.

1. Import the repository. Vercel detects Next.js 16; no build settings to change.
2. Set the `NEXT_PUBLIC_*` variables for the **Production** environment only.
   Leave Preview unset so preview deployments stay `noindex`.
3. Add the custom domain and pick bare-host or `www` as canonical; Vercel sets
   up the redirect and the certificate.
4. **Redeploy after changing any environment variable** — they are inlined at
   build time and an existing deployment will not pick up a change.
5. `next.config.ts` headers apply as written, with no extra file.

Keep the default output on Vercel. Static export gains nothing here and costs
you the headers.
