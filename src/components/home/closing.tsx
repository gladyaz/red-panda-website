import Link from 'next/link';

import { GooglePlayStatus } from '@/components/google-play-status';
import { SectionHeading } from '@/components/home/section-heading';
import { SERIES, posterInitial } from '@/lib/catalog';
import { findPoster } from '@/lib/posters';

/**
 * Four reasons, each one checkable against the product.
 *
 * No "seamless", no "immersive", no "revolutionary" — the four claims below are
 * things the app demonstrably does, written the way you would say them out
 * loud.
 */
const PILLARS = [
  {
    title: 'Short and bingeable',
    body: 'Episodes made to be watched a few minutes at a time, in a vertical feed, on a phone.',
  },
  {
    title: 'Free to watch',
    body: 'Every episode in V1 is free, supported by ads. Nothing to sign up for and nothing to buy.',
  },
  {
    title: 'Smart streaming',
    body: 'Adaptive quality over HLS, with manual control when you want it.',
  },
  {
    title: 'Rewards',
    body: 'Earn coins from check-ins, watching and social missions. Spend them on fewer ads.',
  },
];

export function WhyRedPanda() {
  return (
    <section aria-labelledby="why-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Why Red Panda"
          id="why-heading"
          title="Four things, done properly"
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <li className="bg-surface p-6 sm:p-7" key={pillar.title}>
              <h3 className="text-base font-semibold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2.5 text-sm/6 text-ink-muted text-pretty">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The closing call to action.
 *
 * The catalog returns as a dimmed backdrop rather than as a second rail — the
 * page has already shown these four series at full strength, and repeating them
 * as tiles would read as padding. Behind glass they are texture, and the store
 * status is what the eye lands on.
 *
 * `aria-hidden` on the backdrop: it is the same four series already announced
 * in the Discover section, and a screen reader meeting them twice would be
 * hearing decoration.
 */
function CatalogBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="flex h-full items-center justify-center gap-3 opacity-[0.22] blur-[1px]">
        {[...SERIES, ...SERIES].map((series, index) => {
          const poster = findPoster(series.id);

          return (
            <div
              className="aspect-2/3 w-32 shrink-0 overflow-hidden rounded-lg border border-line bg-surface sm:w-40"
              key={`${series.id}-${index}`}
              style={{ transform: `translateY(${index % 2 === 0 ? -1 : 1}rem)` }}
            >
              {poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt=""
                  className="size-full object-cover"
                  decoding="async"
                  loading="lazy"
                  src={poster}
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <span className="text-2xl font-extrabold text-ember-soft">
                    {posterInitial(series.title)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Keeps the headline legible over whatever the backdrop happens to be. */}
      <div className="absolute inset-0 bg-canvas/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-canvas via-transparent to-canvas" />
    </div>
  );
}

export function DownloadCta() {
  return (
    <section aria-labelledby="download-heading" className="relative">
      <div className="bloom relative isolate overflow-hidden border-y border-line">
        <CatalogBackdrop />

        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <h2
            className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl"
            id="download-heading"
          >
            Your next story is waiting
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg/8 text-ink-muted text-pretty">
            Red Panda is coming to Android. Free to watch, with nothing to sign
            up for and nothing to buy.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5">
            <GooglePlayStatus />
            <p className="text-sm text-ink-dim">
              Questions before you install? Read the{' '}
              <Link
                className="rounded-sm font-medium text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
