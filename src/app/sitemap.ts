import type { MetadataRoute } from 'next';

import { ALL_ROUTES } from '@/lib/navigation';
import { absoluteUrl, getSiteUrl } from '@/lib/site-config';

/**
 * Built from `ALL_ROUTES`, the same array the header and footer read, so a page
 * cannot be linked in navigation without appearing here.
 *
 * A sitemap entry has to be an absolute URL, so a build without
 * `NEXT_PUBLIC_SITE_URL` emits an empty sitemap rather than inventing a
 * hostname. That build's robots.txt already tells crawlers not to come.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (getSiteUrl() === undefined) {
    return [];
  }

  return ALL_ROUTES.map((route) => ({
    url: absoluteUrl(route.href) as string,
    changeFrequency: 'monthly' as const,
    priority: route.priority,
  }));
}
