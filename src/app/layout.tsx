import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_NAME, getSiteUrl } from '@/lib/site-config';

import './globals.css';

/**
 * The same family the Red Panda mobile app ships
 * (`@expo-google-fonts/plus-jakarta-sans`), so the website and the app read as
 * one product. Self-hosted by `next/font`, so no request ever leaves for a
 * font CDN.
 */
const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  // Only set when a real origin is configured; `undefined` simply leaves
  // relative metadata URLs unresolved rather than resolving them against a
  // hostname nobody owns.
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: `${SITE_NAME} — Short dramas, made easy to watch`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'Red Panda is a short-drama streaming app: free episodes, adaptive streaming built for mobile, and rewards you earn while you watch.',
  applicationName: SITE_NAME,
  // No Twitter/X card block and no `creator` handle: Red Panda has no
  // published social account recorded in any of this product's repositories,
  // and inventing one would attribute the site to somebody else's profile.
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html className={`${plusJakarta.variable} h-full`} lang="en">
      <body className="flex min-h-full flex-col font-sans">
        <a
          className="sr-only z-50 rounded-md bg-surface-raised px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
          href="#main"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main className="flex-1" id="main">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
