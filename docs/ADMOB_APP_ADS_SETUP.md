# app-ads.txt — AdMob setup

`public/app-ads.txt` carries the **real** Google AdMob authorization for
publisher `pub-1667435731286936`:

```
google.com, pub-1667435731286936, DIRECT, f08c47fec0942fa0
```

That is the whole declaration: one account, selling directly, with no resellers
and no mediation partners. A record here is a signed statement about who may
sell this app's ad inventory, so nothing goes in that AdMob did not print for
this account.

**Publishing the file is not the same as AdMob verifying it.** Google verifies
by crawling the developer website named in a *published* Play listing. Red
Panda is not on Google Play yet and the AdMob payment profile is still
incomplete, so steps 5 to 7 below remain outstanding.

This document is the procedure, kept for re-copying the line and for finishing
verification.

---

## Where this stands

**Steps 1 and 2 are done.** The placeholder is gone and
`https://redpandadrama.online/app-ads.txt` serves the real record, so the
ordering hazard this section used to warn about — a public domain serving a
placeholder file while the app serves real ads — can no longer happen.

What remains is outside this repository: publish the app, point the Play
listing at the same host, and let Google crawl. See steps 5 to 7.

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

## 2. Replace the file contents — done

The placeholder text is gone. What replaced it is a comment header describing
the real record, followed by the record itself. Comments are legal — the spec
ignores any line beginning with `#` — but they have to describe what the file
*is*. The hazard the old wording guarded against was the opposite: a file whose
first twenty lines call themselves a placeholder while a real record sits
underneath, which is the file somebody misreads later.

If AdMob ever prints more than one line — a mediation partner, say — include
all of them, one per line, exactly as printed.

> `src/__tests__/site-hygiene.test.ts` now asserts the opposite of what it once
> did: the file must contain **exactly** the record above, exactly one publisher
> id, and no `RESELLER` entry. Changing the record without updating that test
> fails the suite, which is the intent.

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
