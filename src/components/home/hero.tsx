import { DiscoverMockup } from '@/components/home/app-mockups';
import { PhoneFrame } from '@/components/home/phone-frame';
import { GooglePlayStatus } from '@/components/google-play-status';

/**
 * The hero.
 *
 * Composition is deliberately app-first: the copy occupies the left column and
 * a device carrying the real Discover catalog occupies the right, so the first
 * thing a visitor sees is dramas rather than a value proposition. On a phone
 * the two stack, copy first — the headline and the store status must both be
 * above the fold at 375px, and the device follows.
 *
 * Every claim in the supporting line is checkable: vertical short-form drama,
 * free in V1, adaptive streaming, Indonesian subtitles burned into the video.
 */
export function Hero() {
  return (
    <section className="bloom relative overflow-hidden" id="top">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-20 lg:pb-28">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-semibold text-ink-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Short drama · Free to watch
          </p>

          <h1 className="mt-6 text-[2.6rem]/[1.05] font-extrabold tracking-tight text-balance sm:text-6xl/[1.02]">
            Stories worth{' '}
            <span className="brand-text">another episode</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg/8 text-ink-muted text-pretty">
            Vertical short dramas you can finish on a coffee break. Every episode
            is free to watch in Red Panda V1, with Indonesian subtitles and
            adaptive streaming that keeps playing when your signal moves.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-4">
            <GooglePlayStatus />
            <a
              className="rounded-sm text-sm font-semibold text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-ink hover:decoration-ink-muted"
              href="#discover"
            >
              See what&rsquo;s on
            </a>
          </div>
        </div>

        <PhoneFrame
          caption="Illustration of the Red Panda app"
          className="rise [animation-delay:120ms]"
        >
          <DiscoverMockup />
        </PhoneFrame>
      </div>
    </section>
  );
}
