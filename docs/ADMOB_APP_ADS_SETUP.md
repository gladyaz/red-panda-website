# app-ads.txt — AdMob setup

`public/app-ads.txt` currently contains **comments only**. It declares no
authorized sellers, because Red Panda has no AdMob account yet and a publisher
id cannot be invented — it is a signed statement about who may sell this app's
ad inventory.

This document is the procedure for finishing it.

---

## Read this before you publish

**Order matters.** An `app-ads.txt` that a crawler can reach but that does not
list your publisher id is a positive declaration that *nobody* is authorized to
sell your inventory. That is fine today, because there is no live Red Panda
inventory to devalue: the app is not on Google Play and no AdMob account exists.
It stops being fine the moment the app is live with real ad units.

So: **complete step 2 below before, or in the same session as, the first
production release of the app.** Do not leave a public domain serving the
placeholder file while the app is serving real ads.

If you need the website live before AdMob is ready — to satisfy the Google Play
privacy-policy and account-deletion URL requirements, which is the usual reason
— that is fine. The app is not distributed yet, so there is no inventory to
misdeclare. Just do not forget this file when the app ships.

---

## 1. Get the exact line from AdMob

1. Create the AdMob app for **`com.spark.redpanda`** if it does not exist.
2. In AdMob, go to **Apps → Red Panda → App settings**.
3. Find the **app-ads.txt** section. AdMob prints the exact line for your
   publisher account.
4. **Copy it verbatim.** Do not retype it and do not correct anything in it. The
   publisher id is a 16-digit number and a single wrong digit silently
   invalidates the whole record.

The record format is defined by the IAB Tech Lab `app-ads.txt` specification:

```
<advertising system domain>, <publisher id>, <DIRECT|RESELLER>, <certification authority id>
```

For a Google AdMob publisher it looks like this, with your own 16 digits in
place of the zeroes:

```
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
```

`f08c47fec0942fa0` is Google's own TAG certification authority id and is the
same for every Google publisher. The publisher id is the part that is yours.

## 2. Replace the file contents

Open `public/app-ads.txt` and **replace everything in it** with the line AdMob
gave you.

Do not append the record below the existing comments. Delete them. A file whose
first twenty lines explain that it is a placeholder, followed by a real record,
is a file somebody will misread later.

If AdMob gives you more than one line — for example a mediation partner as well
— include all of them, one per line, exactly as printed.

The finished file is typically one line long.

> The repository test `src/__tests__/site-hygiene.test.ts` asserts that this
> file contains **no** publisher id, precisely so nobody can commit a fabricated
> one. When you paste the real line, that test will fail. **That failure is
> correct and expected** — update or remove the two assertions in the
> "declares no publisher id" and "contains only comments" tests at the same
> commit, and say in the commit message that the real record has landed.

## 3. Deploy the website

Deploy as normal — see [DEPLOYMENT.md](./DEPLOYMENT.md). The file is static and
is served straight from `public/`.

## 4. Verify it is actually reachable

```bash
curl -sSL -o /dev/null -w '%{http_code} %{content_type} %{url_effective}\n' \
  https://<your-domain>/app-ads.txt

curl -sSL https://<your-domain>/app-ads.txt
```

All of the following must hold:

- **200**, not 301 to a login page and not 404.
- Content type is `text/plain`.
- Served over **https**, at the **root** of the domain — `/app-ads.txt`, never
  `/public/app-ads.txt` or a subdirectory.
- The body is the record you pasted.
- It resolves at the **exact host** you will put in the Play listing. If the
  listing says `example.com` and only `www.example.com` serves the file, Google
  will not find it. Serve it on both, or make one redirect to the other and
  confirm the redirect is followed.

## 5. Put the same domain in the Google Play listing

Google finds `app-ads.txt` by taking the **developer website** from the Play
Store listing and requesting `/app-ads.txt` at that domain's root.

In Play Console → your app → **Store listing → Store settings → Contact
details**, set the website to the same domain — the bare origin, e.g.
`https://example.com`, not a path.

This must match the domain you verified in step 4. A mismatch here is the most
common reason verification never completes.

## 6. Request and re-check verification in AdMob

1. In AdMob, go to **Apps → Red Panda → App settings → app-ads.txt**.
2. Use **Check for updates**.
3. Wait. Google crawls app-ads.txt files on its own schedule, and a first
   successful crawl commonly takes **24 hours to a few days** after the app is
   published. There is nothing to do in that window.

Status will move to verified once Google has crawled the file and found your
publisher id at the domain in the listing.

## 7. When it does not verify

In roughly the order these actually go wrong:

| Symptom | Cause to check first |
|---|---|
| AdMob reports the file not found | The Play listing website does not match the host serving the file, or points at a path rather than an origin. |
| Not found, but `curl` works for you | `www` vs bare host, or a redirect Google did not follow. Test both hosts explicitly. |
| File found, publisher id not recognised | A retyped or reformatted line. Re-copy it from AdMob and replace the file. |
| Nothing has happened at all | The app is not published yet. Google does not crawl for an app that is not live. |
| File returns HTML | The host is serving an SPA fallback for unknown paths. Confirm `public/app-ads.txt` is in the deployed output. |

## What never goes in this file

- An invented publisher id, in any shape, including an `X`-filled dummy.
- Another company's publisher line.
- A commented-out example record — the one somebody uncomments by mistake.
- Anything that is not a real record AdMob printed for this account.
