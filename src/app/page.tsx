import { Discover } from '@/components/home/discover';
import { DownloadCta, WhyRedPanda } from '@/components/home/closing';
import { Hero } from '@/components/home/hero';
import { Playback, Rewards } from '@/components/home/experience';
import { pageMetadata } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/site-config';

export const metadata = pageMetadata({
  title: `${SITE_NAME} — Free short drama app`,
  description:
    'Red Panda is a free short drama app for Android. Watch Mandarin short dramas with Indonesian subtitles, adaptive streaming built for mobile, and earn rewards while you watch.',
  path: '/',
});

/**
 * The homepage.
 *
 * Order is deliberate: dramas before features. A visitor lands on the app and
 * its catalog, sees what is actually on it, and only then meets playback,
 * rewards and the reasons to install. A short-drama site that opens with a
 * feature grid has buried the product.
 *
 * Sections are separated by a hairline rule rather than by alternating
 * background panels — a near-black page that switches to a slightly-less-black
 * panel every screenful reads as a dashboard, not as a streaming product.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <hr className="rule-fade" />

      <div className="py-20 sm:py-24">
        <Discover />
      </div>

      <hr className="rule-fade" />

      <div className="py-20 sm:py-28">
        <Playback />
      </div>

      <div className="py-20 sm:py-28">
        <Rewards />
      </div>

      <hr className="rule-fade" />

      <div className="py-20 sm:py-24">
        <WhyRedPanda />
      </div>

      <DownloadCta />
    </>
  );
}
