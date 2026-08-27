import { BrandMark } from '@/components/brand-mark';
import { SiteNav } from '@/components/site-nav';

/**
 * The sticky header.
 *
 * Deliberately ONE row at every width. Letting the nav wrap onto a second line
 * pushed the header to 93px on a 375px screen — 11% of the viewport,
 * permanently, on the device most of this site's visitors will use. `flex-nowrap`
 * with a shrink-proof wordmark and a `min-w-0` nav keeps it near 60px and lets
 * the link row scroll horizontally instead.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-nowrap items-center justify-between gap-4 px-5 py-3.5 sm:gap-8 sm:px-8 sm:py-4">
        <BrandMark />
        <SiteNav />
      </div>
    </header>
  );
}
