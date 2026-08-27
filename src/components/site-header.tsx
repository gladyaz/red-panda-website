import { BrandMark } from '@/components/brand-mark';
import { SiteNav } from '@/components/site-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 sm:px-8">
        <BrandMark />
        <SiteNav />
      </div>
    </header>
  );
}
