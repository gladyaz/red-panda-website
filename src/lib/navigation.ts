/**
 * The site's public routes and the homepage sections the header links to.
 *
 * `ALL_ROUTES` is what `sitemap.ts` reads, so a page cannot be linked in
 * navigation without appearing in the sitemap, or the reverse. Section anchors
 * are NOT routes and are deliberately absent from it — a sitemap entry for
 * `/#rewards` would ask a crawler to index the homepage four times.
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
 * The legal and support pages, in the order they appear in the footer.
 * Spelled out in words, never as icons — somebody looking for the
 * account-deletion page must be able to read the link that takes them there.
 */
export const SECONDARY_ROUTES: readonly SiteRoute[] = [
  { href: '/privacy', label: 'Privacy', priority: 0.8 },
  { href: '/delete-account', label: 'Delete Account', priority: 0.8 },
  { href: '/support', label: 'Support', priority: 0.6 },
];

export const ALL_ROUTES: readonly SiteRoute[] = [HOME_ROUTE, ...SECONDARY_ROUTES];

/**
 * Homepage sections the header offers as jump links.
 *
 * Each id is rendered as the `id` of a real `<section>` on the homepage, and a
 * test asserts every one of them resolves — a header link to an anchor that
 * does not exist scrolls nowhere and looks broken rather than absent.
 */
export interface SiteSection {
  readonly id: string;
  readonly label: string;
}

export const HOME_SECTIONS: readonly SiteSection[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'features', label: 'Features' },
  { id: 'rewards', label: 'Rewards' },
];

/**
 * The header's link set: the three homepage sections, then Privacy and
 * Support.
 *
 * Delete Account is deliberately not here. Five items is already the most a
 * 375px header can carry, and the page it matters to is one link away in the
 * footer of every page, from the Privacy Policy's own deletion section, and
 * from the Support page. Crowding a sixth item into the header would make all
 * six harder to hit rather than making that one easier to find.
 */
export const HEADER_ROUTES: readonly SiteRoute[] = SECONDARY_ROUTES.filter(
  (route) => route.href !== '/delete-account',
);
