# Privacy fact inventory

The audit the Privacy Policy and the Delete Account page are written from.

Every claim on `/privacy` and `/delete-account` traces to a row below, and every
row traces to a file in one of the two product repositories. This document
exists so that the next person to edit the legal copy can check a sentence
against the code instead of against their memory of the product.

**Audited 27 August 2026**, read-only, against:

- `mobile-app-redpanda-secure-session` — the Red Panda Expo/React Native app.
- `short-drama-backend-v1-release-gate` — the NestJS backend, branch
  `integration/v1-auth-rewards`.

**§11 re-audited 28 August 2026**, read-only, against:

- `red-panda-mobile`, branch `integration/red-panda-v1-final` — the provider-aware
  deletion flow.
- `red-panda-backend`, `docs/ACCOUNT_DELETION.md` — the provider-aware deletion
  contract.

No reference repository was modified in either pass.

> If a fact below stops being true, the policy sentence it supports has to
> change with it. A privacy policy that describes last release's behaviour is a
> false statement, not a stale one.
>
> §11 is the worked example. The gap it recorded was real when it was written,
> was closed by a later backend release, and the website went on asserting it
> for as long as nobody re-read this file against the code.

---

## 1. Product identity and scope

| Fact | Source |
|---|---|
| App name **Red Panda**, Android package `com.spark.redpanda`, version 1.0.0 | mobile `app.json` |
| Short-form vertical drama; Mandarin source with Indonesian subtitles burned into the video | mobile `docs/internal-storage.md` |
| App languages: Indonesian (default), English, Chinese | mobile `src/services/i18n/translations.ts` |
| V1 = free content + ads + rewards + Google Login + WhatsApp Login over HLS | backend `docs/PLAY_STORE_V1_BACKEND.md`; mobile `docs/v1-product-scope.md` |
| **No payment, no subscription, no paywall, no coin purchase.** `PAYMENTS_ENABLED=false`; `/payments/*` answers 503 | backend `docs/PLAY_STORE_V1_BACKEND.md` §8 |
| Premium surfaces exist in the tree but are switched off by `isPremiumExperienceEnabled()`, defaulting off, and the release preflight blocks a build that turns them on | mobile `src/services/config/v1-scope.ts` |

**Consequence for the website:** the site must not use the words premium,
subscription, purchase or pricing as marketing. A test enforces this on the
homepage, and a second test asserts no page anywhere offers a paid action or
quotes a price.

## 2. Account data

| Fact | Source |
|---|---|
| `User` holds: nullable `email`, nullable `passwordHash`, optional `displayName`, `role`, `createdAt`, `updatedAt` | backend `prisma/schema.prisma` |
| A Google-only or WhatsApp-only account has **no email and no password**; no synthetic address is ever invented | backend `docs/auth-identity-api-contract.md` §3.5 |
| Google email is stored **only when the token carries `email_verified: true`**, otherwise `null` | backend `docs/auth-identity-api-contract.md` |
| `AuthIdentity` holds `provider` (`email` \| `google` \| `whatsapp`), `providerSubject`, `normalizedIdentifier`, `createdAt`, `verifiedAt` | backend `prisma/schema.prisma` |
| `providerSubject` is the Google `sub`, the E.164 phone number, or the lowercased email — **never a display name** | backend `docs/auth-identity-api-contract.md` |
| `PhoneOtpChallenge` stores `phoneE164`, `codeHash` (HMAC-SHA256, never the code), `expiresAt`, `attemptCount`, `consumedAt`, `ipHash`. Pruned opportunistically past `OTP_CHALLENGE_RETENTION_MS` | backend `prisma/schema.prisma` |
| Passwords are bcrypt-hashed | backend `src/auth/auth.service.ts` |
| Refresh tokens stored only as a keyed hash (`Session.refreshTokenHash`) | backend `prisma/schema.prisma` |

## 3. Activity data

| Fact | Source |
|---|---|
| `UserVideoInteraction` — likes and saves | backend `prisma/schema.prisma` |
| `WatchProgress` — one row per `(userId, seriesId)`: series, episode number, resume position | backend `prisma/schema.prisma`, `retention.constants.ts` |
| Rewards: `RewardWallet`, `RewardLedgerEntry`, `RewardCheckIn`, `RewardRedemption`, `RewardMissionClaim`, `RewardWatchCredit`, `RewardPerk` | backend `prisma/schema.prisma` |
| Coin utility in V1 is **ad perks only**: `redeem_skip_next_ad` (one interstitial skip, 24h shelf life) and `redeem_ad_pass_2h` (no interstitials for two hours). Both `kind: "AD_PERK"`, `grantsDays: 0` | mobile `docs/v1-product-scope.md`; backend `docs/rewards-api-contract.md` |
| Watch missions count **distinct episodes the server authorised within a reward day**, not watch time — the backend has no trustworthy duration signal | mobile `docs/v1-product-scope.md` |
| **Social missions are `USER_CONFIRMED`, never a verified follow.** Ledger reason `EXTERNAL_SOCIAL_ACTION`. No platform exposes a "did user X follow page Y" check | backend `docs/rewards-api-contract.md` §6; `docs/PLAY_STORE_V1_BACKEND.md` §8 |

**Consequence for the website:** the policy states outright that Red Panda
cannot check whether a follow happened. A test asserts the denial is present in
both languages and that no affirmative verification claim appears in either.

## 4. Analytics

| Fact | Source |
|---|---|
| Self-hosted only — `POST /analytics/events` to Red Panda's own backend. **No third-party analytics SDK is installed** | mobile `package.json`; `src/services/analytics/analytics-service.ts` |
| Allowlisted events: `feed_view`, `video_play`, `video_like`, `video_save`, `episode_navigate`, `premium_gate_hit`, `app_error` | backend `src/analytics/analytics.types.ts` |
| Properties are allowlisted per event and everything else is stripped **server-side before persistence** | backend `src/analytics/analytics.types.ts` |
| `AnalyticsEvent` stores `userId?`, `eventName`, `properties`, `platform`, `clientTimestamp`, `receivedAt`. **The model has no `ipHash` and no `userAgent` column** | backend `prisma/schema.prisma` |
| Crash capture is the app's own global handler reporting `app_error`; `stack`/`message` are truncated server-side | backend `src/analytics/analytics.types.ts` |

## 5. Security and audit data

| Fact | Source |
|---|---|
| `AuthAuditEvent` stores `event`, `ipHash`, `userAgent`, `metadata`, `createdAt` | backend `prisma/schema.prisma` |
| `ipHash` is HMAC-SHA256 of the client IP keyed with a dedicated secret. **The raw IP is never computed into the column or persisted anywhere** | backend `prisma/schema.prisma` |
| `userAgent` is truncated and control-character-sanitised before storage | backend `prisma/schema.prisma` |
| `metadata` is validated against a per-event allowlist; no password, token, secret, raw email or raw IP can reach it | backend `prisma/schema.prisma` |
| Account lockout: 15 minutes after 10 failed logins in a rolling 15-minute window | backend `prisma/schema.prisma` (`AccountLockout`) |
| WhatsApp OTP limits: 60s resend cooldown per number, 5 requests/hour per number, 5 guesses per challenge, per-IP 3/10min request and 5/min verify | mobile `docs/v1-product-scope.md` |

## 6. Advertising

| Fact | Source |
|---|---|
| Google AdMob, **interstitial format only** | mobile `src/services/ads/interstitial-adapter.ts` |
| The merged release manifest carries `com.google.android.gms.permission.AD_ID` → **the Advertising ID is collected and must be declared in Play Data safety** | mobile `docs/play-store-v1-owner-checklist.md` §2 |
| Consent runs through Google's User Messaging Platform before any ad request, and **fails closed**: no consent, no ad requested | mobile `src/services/ads/consent-gate.ts` |
| An "Ad Privacy Options" row appears in Profile where `privacyOptionsRequirementStatus === 'REQUIRED'` | mobile `src/app/(tabs)/profile.tsx` |
| The backend runs **no** ad-serving logic; it only serves pacing config via `GET /config/ads` | backend `docs/PLAY_STORE_V1_BACKEND.md` §8 |
| **The production AdMob ids do not exist yet.** `app.json` ships Google's published sample publisher ids, because the native `MobileAdsInitProvider` crashes on launch with an empty application id | mobile `app.config.js` |

## 7. On-device storage

| Fact | Source |
|---|---|
| Sign-in tokens in `expo-secure-store`, which opens `KeyStore.getInstance("AndroidKeystore")`; the ciphertext lands in a `SecureStore` SharedPreferences file | mobile `src/services/auth/session-secret-store.ts` |
| **AsyncStorage itself is not encrypted by any of that**, and the module says so explicitly | mobile `src/services/auth/session-secret-store.ts` |
| AsyncStorage keys: `@mobile-app-ecc/auth`, `/video-interactions`, `/series-progress`, `/language`, plus the two sync queues and the ads store | mobile `src/services/storage/local-storage.ts` |
| Android auto-backup **disabled** — `allowBackup: false` in `app.json`, `configureAndroidBackup: false` on the secure-store plugin | mobile `app.json` |

**Consequence for the website:** the policy says tokens are held in the Android
system's secure storage in encrypted form, and separately says the local cache
of likes/saves/progress is **not** encrypted. Claiming otherwise would be false.

## 8. Permissions and what is NOT collected

| Fact | Source |
|---|---|
| Merged release manifest contains only `INTERNET`, `ACCESS_NETWORK_STATE`, `VIBRATE`, `WAKE_LOCK`, `FOREGROUND_SERVICE`, `AD_ID` and the AdServices set | mobile `docs/play-store-v1-owner-checklist.md` §2 |
| Blocked outright: `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` | mobile `app.json` |
| **No location, contacts, calendar, camera, microphone, files or SMS** | same |
| **No push notifications** — `expo-notifications` is not a dependency | mobile `package.json` |
| No age gate and no child-directed AdMob configuration exists in the codebase | grep for `coppa` / `tagForChildDirectedTreatment` / `maxAdContentRating` returns nothing |

**Consequence for the website:** the children's-privacy section states an
intent ("not directed at children", "does not knowingly collect") and does
**not** claim any technical control, because none is implemented.

## 9. Media and infrastructure

| Fact | Source |
|---|---|
| Cloudflare R2, **private bucket**. Only a presigned, short-lived URL ever reaches the client; the app never receives an R2 key, bucket name or endpoint | mobile `docs/internal-storage.md` |
| HLS is packaged by a separate worker and served through a Cloudflare Worker gateway | backend `docs/PLAY_STORE_V1_BACKEND.md` §2 |
| Postgres for data; Redis for the transcode queue (worker only) | backend `docs/PLAY_STORE_V1_BACKEND.md` §2 |
| Production boot refuses any client-facing URL that is not absolute https and non-private | backend `docs/PLAY_STORE_V1_BACKEND.md` §1 |

## 10. Retention

Defined as named constants with a schedulable cleanup job
(`RETENTION_SCHEDULE_ENABLED` / `_CRON` / `_COMMIT`, all exact-string and
fail-closed).

| Data | Window | Constant |
|---|---|---|
| Expired/revoked session records | 90 days | `SESSION_RETENTION_DAYS` |
| Used/expired password-reset records | 90 days | `PASSWORD_RESET_TOKEN_RETENTION_DAYS` |
| Product analytics events | 180 days | `ANALYTICS_EVENT_RETENTION_DAYS` |
| Watch progress | 730 days | `WATCH_PROGRESS_RETENTION_DAYS` |
| Auth/security audit events | 730 days | `AUTH_AUDIT_EVENT_RETENTION_DAYS` |

Source: backend `src/retention/retention.constants.ts`,
`retention-schedule.config.ts`.

The four windows other than watch progress are recorded as human-decided
values, not engineering defaults. **These are the only retention periods stated
on the website. No other period was invented.**

## 11. Account deletion — the load-bearing section

| Fact | Source |
|---|---|
| Three authenticated routes: `GET /users/me/deletion/methods`, `POST /users/me/deletion/whatsapp/otp`, `POST /users/me/deletion` — all behind `JwtAuthGuard` | backend `docs/ACCOUNT_DELETION.md` §3 |
| `confirmDeletion` as the literal boolean `true` is still required, and is an intent flag, never a credential | backend `docs/ACCOUNT_DELETION.md` §2 |
| The proof travels with an optional `method` field defaulting to `"password"`, so the original `{ currentPassword, confirmDeletion }` body is still valid verbatim | backend `docs/ACCOUNT_DELETION.md` §3 |
| Rate limited to **5 calls per 15 minutes**, a deliberate override of the app-wide default because the action is irreversible | backend `src/common/rate-limit.constants.ts` |
| Immediate and irreversible: **no grace period, no cancellation endpoint** | backend `src/auth/auth.service.ts` |
| Refused with `403 ACCOUNT_DELETION_FORBIDDEN` when `user.role !== 'user'` | backend `src/auth/auth.service.ts` |
| **There is no unauthenticated, web-originated deletion API.** The authenticated endpoint above is the only one that exists | verified: no other delete route in `src/**` |

### What the transaction deletes

Cascade (`onDelete: Cascade`) from the `User` row: `Session`,
`UserVideoInteraction`, `WatchProgress`, `Entitlement`, `PasswordResetToken`,
`AccountLockout`, `AuthIdentity`, `RewardWallet`, `RewardLedgerEntry`,
`RewardCheckIn`, `RewardRedemption`, `RewardMissionClaim`, `RewardWatchCredit`,
`RewardPerk` — plus the `User` row itself.

### What survives, and in what state

- `AnalyticsEvent` — `userId` set to `NULL` by the cascade. The model carries no
  `ipHash` or `userAgent`, so nothing else can re-link the row.
- `AuthAuditEvent` — scrubbed **inside the same transaction, before** the user
  row is deleted: `userId`, `ipHash`, `userAgent` and `metadata` are all nulled,
  leaving only `event` and `createdAt`. The ordering is load-bearing and is
  pinned by a mutation test.
- `PaymentOrder` — `SetNull`. Irrelevant in V1: payments are disabled, so no row
  can exist.

Purged immediately after the commit, outside the transaction: every
`PhoneOtpChallenge` for the account's number. That table deliberately carries
no `userId` and no foreign key — an OTP is requested for a *number*, before the
server may know an account exists — so no cascade reaches it.
Source: backend `docs/ACCOUNT_DELETION.md` §4.

### THE GAP THAT USED TO DEFINE THIS PAGE, AND IS NOW CLOSED

**Superseded 28 August 2026.** Until then this section recorded a real defect:
`deleteAccount` required a password and refused when `passwordHash === null`,
so a Google-only or WhatsApp-only account — the majority of V1 accounts — had
no in-app and no API deletion path at all, and `/delete-account` was written
to lead with "email support" for exactly that reason.

That defect is fixed. **Deletion proof is now appropriate to the identity, and
is always a fresh re-demonstration of the same factor the account signs in
with:**

| Account has | Proof | What the server verifies |
|---|---|---|
| `passwordHash` | `password` | bcrypt against the stored hash |
| a `google` identity | `google` | a freshly obtained Google ID token whose `sub` equals **this account's** `AuthIdentity.providerSubject` |
| a `whatsapp` identity | `whatsapp` | a single-use OTP sent to **this account's** linked number, in the `account_deletion` challenge namespace — a namespace that cannot be redeemed at the login verify route |

An account holding more than one of these may use **any single one**; each is
already independently sufficient to sign in and take full control, so requiring
all of them would recreate the same lock-out in a new place.
`GET /users/me/deletion/methods` returns the list and the client picks.

Nothing about authentication was weakened: a valid access token is still
necessary and still not sufficient.

Source: backend `docs/ACCOUNT_DELETION.md` §1–§3, §5;
`src/auth/deletion/deletion-authorization.service.ts`. A release-gate step,
`deletion-coverage`, blocks a release in which any V1 provider lacks an
implemented proof or is disabled on the server.

**Consequence for the website:** `/delete-account` leads with the **in-app**
route, for all three identity types, and describes the confirmation step per
method. Support is the documented fallback for someone who has lost access to
the app or to the sign-in factor itself — the exception, no longer the rule.
`NEXT_PUBLIC_SUPPORT_EMAIL` is still load-bearing for that fallback, but it is
no longer the only thing standing between most users and deletion.

### In-app steps

Profile → Data & Privacy → `Hapus Akun` → confirm with the method the account
owns → `Hapus Akun Saya` → confirm `Ya, Hapus Akun Saya Selamanya`.

The confirmation step, per method, as it appears on the shipped screen:

| Method | What the person does |
|---|---|
| Password | Types the current password under `Password Saat Ini` |
| Google | Taps `Lanjutkan dengan Google` and re-authenticates with the linked Google account |
| WhatsApp | Taps `Kirim Kode Verifikasi`, then types the code under `Kode Verifikasi` |

The picker is rendered **only** when the account genuinely owns more than one
method — a single-option picker would imply a decision the viewer does not
have. The destructive button does not appear until the flow reaches the step
where pressing it means something.

The Data & Privacy screen's own copy is Indonesian in every app language, which
is why the website quotes the Indonesian labels with an English gloss.
Source: mobile `src/features/account-deletion/delete-account-card.tsx`,
`deletion-copy.ts`, and `src/app/account-data.tsx`.

## 12. Data export

`GET /users/me/export` — synchronous, authenticated JSON. Returns profile,
auth identities (Google `sub` withheld entirely, phone masked to its last four
digits), interactions, watch progress, entitlements and analytics events.
Excludes internal database ids, storage keys, roles, password hashes, session
and refresh-token hashes, and all audit metadata.

Source: backend `src/export/export.types.ts`; mobile `src/app/account-data.tsx`.

## 13. What the website must NOT claim

Each of these was checked and is **not** true:

- End-to-end encryption — nothing in either repository implements it.
- Encryption of all on-device data — AsyncStorage is explicitly not encrypted.
- Any GDPR, ISO or other certification — none exists.
- Meta or Google verification — **Meta WhatsApp provisioning has not been
  started**, and Google OAuth is code-configured only, never Google-verified.
- AdMob serving in production — **no AdMob account exists**; the repo ships
  Google's sample ids.
- Verified social follows — impossible, and the backend says so.
- Any retention period other than the five in §10.

## 14. Still unknown at the time of this audit

None of these could be established from the code, and none was guessed:

- The root domain.
- The support email address.
- The legal entity operating Red Panda, if any.
- The real AdMob publisher id and `app-ads.txt` line.
- The Google Play listing URL.
- The three official Red Panda social profile URLs.
