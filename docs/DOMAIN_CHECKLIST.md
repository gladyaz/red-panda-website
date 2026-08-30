# Domain checklist

The recommended DNS topology for Red Panda, and the order to do it in.

**The root domain has not been chosen.** Nothing in any Red Panda repository
names one, so nothing here invents one — `<root-domain>` below is a placeholder
you replace. Choosing it is the first task on this page and it blocks most of
the rest.

---

## 1. Recommended topology

| Host | Serves | Repository |
|---|---|---|
| `https://<root-domain>/` | This website — homepage | `red-panda-website` |
| `https://<root-domain>/privacy` | Privacy Policy | this repo |
| `https://<root-domain>/delete-account` | Account deletion | this repo |
| `https://<root-domain>/support` | Support | this repo |
| `https://<root-domain>/app-ads.txt` | AdMob authorized sellers | this repo |
| `https://api.<root-domain>` | The Red Panda API | `short-drama-backend-v1-release-gate` |
| `https://stream.<root-domain>` | HLS gateway (Cloudflare Worker), if HLS is enabled | backend / Cloudflare |

### Why this split

- **The website is on the apex.** Google Play takes a *developer website* for
  the store listing and looks for `app-ads.txt` at that domain's **root**. Put
  the site on a subdirectory or a subdomain and `app-ads.txt` verification gets
  harder for no benefit.
- **The API is a separate host.** The backend refuses to boot in production
  unless every client-facing URL is an absolute, non-private `https` origin, and
  it enforces `CORS_ORIGINS` at boot with `*` refused in every environment. An
  empty CORS list is correct for a mobile-only V1 — this website never calls the
  API, so it needs no CORS entry.
- **The HLS gateway is separate again** because it is a Cloudflare Worker in
  front of a private R2 bucket, not part of the API process. It is only needed
  when `TRANSCODE_ENABLED=true`; `false` is a valid V1 posture, in which case
  `stream.` is not required at all.
- **This website depends on none of them.** It makes no network calls, so it
  stays up and correct — including the Privacy Policy and the account-deletion
  instructions — while the API is down or not yet deployed. That property is
  worth protecting: do not add a status widget or a catalogue preview that
  fetches from the API.

### Do not do these

- Do not serve the website from `www.` only. If you use `www`, redirect the
  apex to it permanently and make sure `app-ads.txt` resolves on both.
- Do not put the API on the apex and the site on a subdomain.
- Do not point the app's `EXPO_PUBLIC_PRIVACY_POLICY_URL` at a host that differs
  from the one in the Play listing.

## 2. Choose the domain

- [ ] Pick the root domain. Prefer something short that matches the app name.
- [ ] Check it is available and register it.
- [ ] Decide **apex or `www` as canonical** and write the decision down. Every
      later step depends on this one being consistent.
- [ ] Register the domain to the account or entity that will own it long term,
      not to a personal account you intend to migrate later.

## 3. DNS

- [ ] Point the apex at the website host.
- [ ] Point `www` at the same host, redirecting permanently to the canonical
      choice from §2.
- [ ] Do **not** create `api.` or `stream.` records until the backend is
      actually deployed — an `api.` record that resolves to nothing is worse
      than no record.
- [ ] Confirm resolution before going further:

```bash
dig +short <root-domain>
dig +short www.<root-domain>
```

## 4. HTTPS

- [ ] The apex serves valid HTTPS with a certificate covering the exact host.
- [ ] `www` serves valid HTTPS too, so the redirect does not go through an
      untrusted hop.
- [ ] `http://` redirects to `https://`.
- [ ] Later, when the backend is deployed, `api.` and `stream.` are HTTPS with
      certificates that the phone accepts. The backend refuses to boot
      otherwise, so this is enforced rather than assumed.

Only after every subdomain is HTTPS-only should you consider adding
`includeSubDomains` to this site's HSTS header — see
[DEPLOYMENT.md](./DEPLOYMENT.md) §4.

## 5. Deploy the website

- [ ] Build with `NEXT_PUBLIC_SITE_URL=https://<canonical-host>`.
- [ ] Deploy. See [DEPLOYMENT.md](./DEPLOYMENT.md).
- [ ] Run the post-deploy checklist in that document — all seven paths return
      200, robots says `Allow: /`, and the canonical tag names your domain.

## 6. `app-ads.txt`

- [ ] `https://<root-domain>/app-ads.txt` returns **200** as `text/plain`.
- [ ] It resolves on both the apex and `www`.
- [x] Replace the placeholder with the real AdMob line. Done:
      `google.com, pub-1667435731286936, DIRECT, f08c47fec0942fa0` is live.
      Publishing it is not verification — see
      [ADMOB_APP_ADS_SETUP.md](./ADMOB_APP_ADS_SETUP.md) steps 5 to 7.

## 7. Link it to Google Play

- [ ] Play Console → Store listing → Store settings → **Developer website** =
      `https://<canonical-host>` (an origin, not a path).
- [ ] Play Console → Store listing → **Privacy policy URL** =
      `https://<canonical-host>/privacy`.
- [ ] Play Console → App content → Data safety → **Account deletion URL** =
      `https://<canonical-host>/delete-account`.
- [ ] The developer website host is byte-identical to the host serving
      `app-ads.txt`. This is the single most common verification failure.

## 8. Link it to the mobile app

In the mobile repository's build environment:

- [ ] `EXPO_PUBLIC_PRIVACY_POLICY_URL=https://<canonical-host>/privacy`
- [ ] `EXPO_PUBLIC_ACCOUNT_DELETION_URL=https://<canonical-host>/delete-account`
- [ ] `EXPO_PUBLIC_API_BASE_URL=https://api.<root-domain>` once the backend is up
- [ ] `npm run release:preflight` exits 0.
- [ ] Build with a cleared bundler cache and **verify the built artifact**, not
      the environment — the mobile repo's
      `docs/play-store-v1-owner-checklist.md` §9 documents a real case of a
      release bundle carrying a stale LAN host past a passing preflight.

## 9. Backend, when it is deployed

Not this repository's work, listed so the domain plan is complete:

- [ ] `PUBLIC_BASE_URL=https://api.<root-domain>`
- [ ] `CORS_ORIGINS` declared. **Empty is correct and valid for a mobile-only
      V1** — this website never calls the API. `*` is refused in every
      environment.
- [ ] `HLS_GATEWAY_BASE_URL=https://stream.<root-domain>` if
      `TRANSCODE_ENABLED=true`; otherwise the variable and the subdomain are
      both unnecessary.
- [ ] `TRUST_PROXY_HOPS` set to the real number of proxies in front of the app —
      1 on a typical managed platform. Never `trust proxy: true`.
- [ ] `npm run production:preflight` exits 0.

## 10. Still needed, and not obtainable from any repository

None of these could be established from the code, and none was guessed:

| | Blocks |
|---|---|
| **The root domain** | Everything on this page |
| **The support email address** | The account-deletion fallback for anyone who has lost access to the app or to their sign-in method. Every V1 sign-in method now deletes in-app, so this is the exception rather than the majority route |
| **AdMob verification** — the publisher line itself is supplied and live; a published Play listing and a complete payment profile are not | AdMob serving real ads |
| **The Google Play listing URL** | The homepage call to action becoming a link |
| **The legal entity operating Red Panda**, if one exists | Naming an operator anywhere in the footer or the policy |
| The three official Red Panda social profile URLs | Rewards social missions (backend, not this site) |
