import type { Metadata } from 'next';

import { SITE_NAME, absoluteUrl, getSiteUrl } from '@/lib/site-config';

/**
 * Builds a page's metadata from its title, description and path.
 *
 * The canonical URL and the Open Graph `url` are emitted ONLY when
 * `NEXT_PUBLIC_SITE_URL` is configured. Without it there is no honest absolute
 * URL to publish, and a canonical tag pointing at a hostname nobody owns is
 * worse than none: it tells search engines the real page is somewhere else.
 *
 * For the same reason, a build with no site URL is marked `noindex`. That build
 * is a preview or a local check — not the published site — and it should not
 * compete with the real one in an index.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const canonical = absoluteUrl(path);
  const isPublished = getSiteUrl() !== undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: isPublished
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      // `title` here is the full document title, not the template-stripped one.
      title: path === '/' ? title : `${title} — ${SITE_NAME}`,
      description,
      url: canonical,
      locale: 'en_US',
    },
  };
}
