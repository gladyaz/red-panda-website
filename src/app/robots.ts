import type { MetadataRoute } from 'next';

import { absoluteUrl, getSiteUrl } from '@/lib/site-config';

/**
 * There are no private routes on this site, so a published build allows
 * everything.
 *
 * A build with no `NEXT_PUBLIC_SITE_URL` disallows everything instead. That
 * build is a preview or a local check rather than the published site, it has
 * no canonical URL to point a crawler at, and every page in it is already
 * marked `noindex` — telling crawlers to stay away is the consistent answer,
 * not a stricter one.
 */
export default function robots(): MetadataRoute.Robots {
  const isPublished = getSiteUrl() !== undefined;

  if (!isPublished) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
