import type { NextConfig } from 'next';

/**
 * Conservative response headers for a public, static, credential-free site.
 *
 * This site has no accounts, no forms, no cookies and no backend calls, so
 * these are defence in depth rather than mitigation of a live risk. They cost
 * nothing and they are what a Play Store developer website should be serving.
 *
 * On `script-src 'unsafe-inline'`: Next.js prerenders these pages to static
 * HTML with a small inline bootstrap script, and a nonce cannot be issued for
 * a page that is generated at build time rather than per request. Removing the
 * inline allowance would mean giving up static rendering — a real cost for no
 * real gain here, because the site renders no user input, accepts no
 * parameters, and has nothing an injected script could reach. Everything else
 * in the policy still holds: no external script origin, no framing, no
 * plugins, no outbound connections, and no form posting anywhere.
 *
 * `Strict-Transport-Security` deliberately omits `includeSubDomains` and
 * `preload`. The planned topology puts the API and the streaming gateway on
 * sibling subdomains, and committing every future subdomain to HTTPS-only from
 * this website's header is not this website's call to make. See
 * docs/DEPLOYMENT.md for when to add them.
 *
 * NOTE: `headers()` is a server feature. If this site is switched to
 * `output: 'export'` for static hosting, these headers must move to the host's
 * own configuration — docs/DEPLOYMENT.md carries the equivalent file.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
];

const nextConfig: NextConfig = {
  // Fail the build on a type error rather than shipping one. This is the
  // default; it is written out so nobody relaxes it by accident. There is no
  // matching `eslint` key: Next.js 16 removed `next lint`, so linting is the
  // separate `npm run lint` script and is not part of `next build`.
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
