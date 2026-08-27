/**
 * The site's complete public route list, declared once.
 *
 * The header, the footer and `sitemap.ts` all read from this array, so a route
 * can never appear in navigation without appearing in the sitemap, or the
 * reverse. There are no private or internal routes on this site — the array is
 * the whole surface.
 */
export interface SiteRoute {
  readonly href: string;
  readonly label: string;
  /** Ordering hint for the sitemap. The homepage leads. */
  readonly priority: number;
}

export const HOME_ROUTE: SiteRoute = {
  href: '/',
  label: 'Red Panda',
  priority: 1,
};

/**
 * The three legal and support surfaces, in the order they appear in both the
 * header and the footer. Spelled out in words, never as icons — a person
 * looking for the account-deletion page must be able to read the link that
 * takes them there.
 */
export const SECONDARY_ROUTES: readonly SiteRoute[] = [
  { href: '/privacy', label: 'Privacy', priority: 0.8 },
  { href: '/delete-account', label: 'Delete Account', priority: 0.8 },
  { href: '/support', label: 'Support', priority: 0.6 },
];

export const ALL_ROUTES: readonly SiteRoute[] = [HOME_ROUTE, ...SECONDARY_ROUTES];
