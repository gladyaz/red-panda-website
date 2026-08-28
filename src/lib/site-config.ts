/**
 * Every externally-supplied value this website depends on, read once and
 * validated here.
 *
 * The Red Panda V1 website ships BEFORE the domain, the support mailbox and
 * the Google Play listing exist. That is the normal state of this repository,
 * not a broken one: the mobile app's own `src/constants/legal.ts` follows the
 * identical rule for the two URLs it consumes from this site, and its comment
 * explains why — "a URL that 404s is worse than no link, and a fabricated one
 * in a store listing is a policy problem rather than a cosmetic one".
 *
 * So every getter below returns `undefined` rather than a placeholder, and
 * every surface that consumes one renders an honest "not available yet" state
 * instead of a broken link. Filling these in is a deployment step, not a code
 * change.
 *
 * These are `NEXT_PUBLIC_*` values: they are inlined into the client bundle at
 * build time and are permanently public. Nothing here is or may become a
 * secret.
 */

export const SITE_NAME = 'Red Panda';

/** Shown in the footer. The product's first public year. */
export const COPYRIGHT_YEAR = 2026;

/**
 * The Android application id, settled in the mobile repository
 * (`app.json` → `expo.android.package`). Safe to state publicly: it is
 * embedded in every published build and visible in any Play listing URL.
 */
export const ANDROID_PACKAGE_ID = 'com.spark.redpanda';

/**
 * Accepts only an absolute https origin, mirroring the mobile app's
 * `readHttpsUrl`. A relative path, an http origin or a typo would each
 * produce a canonical tag pointing at nothing, which is worse for SEO than
 * emitting no canonical at all.
 *
 * Any trailing slash is removed so callers can always join with `/path`.
 */
function readHttpsOrigin(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);

    return url.protocol === 'https:' ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The public origin this site is served from, e.g. `https://example.com`.
 *
 * Used for canonical URLs, Open Graph `url`, and the `sitemap` line in
 * robots.txt. When unset, none of those are emitted — an absolute URL cannot
 * be guessed, and guessing one would point search engines at a hostname
 * nobody controls.
 */
export function getSiteUrl(): string | undefined {
  // Static member access: the value must be a literal `process.env.X` for the
  // bundler to inline it at build time.
  return readHttpsOrigin(process.env.NEXT_PUBLIC_SITE_URL);
}

/**
 * Builds an absolute URL for a site-relative path, or `undefined` when the
 * site URL is not configured.
 */
export function absoluteUrl(path: string): string | undefined {
  const origin = getSiteUrl();

  return origin ? `${origin}${path}` : undefined;
}

/**
 * A conservative address check: exactly one `@`, a non-empty local part, and a
 * dotted domain with no whitespace.
 *
 * This is deliberately not an RFC 5322 parser. Its only job is to stop a
 * malformed or half-edited environment value from becoming a `mailto:` link
 * that opens a broken draft — in which case the page shows the "not yet
 * available" state instead, which is true and useful.
 */
function readEmail(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(trimmed) ? trimmed : undefined;
}

/**
 * The published support mailbox.
 *
 * Load-bearing, not decorative. Every V1 sign-in method now has a working
 * in-app deletion path, so this is no longer the majority route — but it is
 * still the only route left for someone who has lost access to the app or to
 * the sign-in method their account uses, and the app itself falls back to
 * "email the address on the Privacy Policy page" when it can offer an account
 * no verifiable confirmation method (see `/delete-account`). Until this is
 * set, both the support page and the deletion page say so plainly rather than
 * showing an address nobody reads.
 */
export function getSupportEmail(): string | undefined {
  return readEmail(process.env.NEXT_PUBLIC_SUPPORT_EMAIL);
}

/**
 * Accepts only an international number: a leading `+`, then 8 to 15 digits.
 *
 * Written numbers carry spaces, dashes and brackets, so those are stripped
 * before the check — but a LOCAL number (`0858…`) is refused rather than
 * repaired. Prefixing a country code onto it would be inventing part of a
 * phone number, and a wa.me link one digit off does not fail visibly: it opens
 * a chat with a stranger who then receives support requests.
 *
 * Returns the digits WITHOUT the `+`, which is the form wa.me takes.
 */
function readInternationalNumber(
  value: string | undefined,
): string | undefined {
  const compact = value?.trim().replace(/[\s()-]/g, '');

  if (!compact) {
    return undefined;
  }

  return /^\+\d{8,15}$/.test(compact) ? compact.slice(1) : undefined;
}

/**
 * The support WhatsApp number, set as `+6285884022823` and returned as
 * `6285884022823`.
 *
 * A second contact route, not a replacement for the mailbox: WhatsApp is how
 * this audience actually reaches a business, but an account-deletion request
 * needs a written trail, and the app's own fallback text points at an email
 * address. Both are offered; neither is required for the site to be correct.
 */
export function getSupportWhatsApp(): string | undefined {
  return readInternationalNumber(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP);
}

/**
 * The Google Play listing, once it exists.
 *
 * Accepted only when it is genuinely a Google Play URL. An arbitrary https URL
 * here would put a "Get it on Google Play" call to action in front of visitors
 * that leads somewhere else, which is precisely the failure this whole module
 * exists to prevent — so the host allowlist is the validation, not a nicety.
 */
export function getGooglePlayUrl(): string | undefined {
  const value = readHttpsOrigin(process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL)
    ? process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL
    : undefined;

  if (!value) {
    return undefined;
  }

  const host = new URL(value).hostname.toLowerCase();

  return host === 'play.google.com' ? value : undefined;
}
