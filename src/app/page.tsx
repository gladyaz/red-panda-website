import Link from 'next/link';

import { GooglePlayStatus } from '@/components/google-play-status';
import { pageMetadata } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/site-config';

export const metadata = pageMetadata({
  title: `${SITE_NAME} — Short dramas, made easy to watch`,
  description:
    'Red Panda is a short-drama streaming app: free episodes, adaptive streaming built for mobile, and rewards you earn while you watch.',
  path: '/',
});

/**
 * Four highlights, each one describing something the app actually does today.
 *
 * Sourced from the V1 scope both product repositories agree on: free content,
 * ads, rewards, HLS. Nothing here describes a feature that is switched off in a
 * V1 build, and nothing markets a tier that does not exist.
 */
const HIGHLIGHTS = [
  {
    title: 'Watch anywhere',
    body: 'Adaptive streaming that adjusts quality to your connection, built for watching on a phone. Pick a quality yourself if you would rather.',
  },
  {
    title: 'Rewards',
    body: 'Earn coins from daily check-ins, from watching episodes, and from following Red Panda on Instagram, TikTok and YouTube.',
  },
  {
    title: 'Your watchlist',
    body: 'Like and save the dramas you want to come back to. Red Panda remembers where you stopped and picks the episode back up.',
  },
  {
    title: 'Simple and free',
    body: 'Every episode in Red Panda V1 is free to watch, supported by ads. There is nothing to sign up for and nothing to buy.',
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="hero-bloom relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <h1>
            <span className="block text-xs font-semibold tracking-[0.22em] text-ember-text uppercase">
              {SITE_NAME}
            </span>
            <span className="mt-5 block max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Short dramas, made easy to watch.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg/8 text-ink-muted text-pretty">
            Vertical short-form drama series, free to watch and streamed
            adaptively so an episode keeps playing when your connection moves.
            Earn rewards while you watch.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <GooglePlayStatus />
            <Link
              className="rounded-sm text-sm font-medium text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-ink hover:decoration-ink-muted"
              href="/privacy"
            >
              Read the Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      <hr className="rule-fade" />

      <section aria-labelledby="highlights-heading" className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="sr-only" id="highlights-heading">
          What Red Panda does
        </h2>

        <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {HIGHLIGHTS.map((highlight) => (
            <li className="bg-surface p-6 sm:p-8" key={highlight.title}>
              <h3 className="text-base font-semibold tracking-tight text-ink">
                {highlight.title}
              </h3>
              <p className="mt-2.5 text-base/7 text-ink-muted text-pretty">
                {highlight.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <hr className="rule-fade" />

      <section
        aria-labelledby="about-heading"
        className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="max-w-2xl">
          <h2
            className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
            id="about-heading"
          >
            About Red Panda
          </h2>
          <div className="mt-5 space-y-4 text-base/7 text-ink-muted text-pretty">
            <p>
              Red Panda is a mobile app for watching short drama series —
              episodes made to be watched a few minutes at a time, in a vertical
              feed, on a phone. The catalogue is Mandarin-language drama with
              Indonesian subtitles, and the app itself runs in Indonesian,
              English or Chinese.
            </p>
            <p>
              You can browse and watch without an account. Signing in with
              Google or with a WhatsApp one-time code adds the things that need
              to follow you between devices: your likes, your saved series,
              where you stopped in each one, and your rewards balance.
            </p>
            <p>
              This first release is free and ad-supported. You can read exactly
              what the app collects in the{' '}
              <Link
                className="rounded-sm font-medium text-ember-text underline decoration-ember-text/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-text"
                href="/privacy"
              >
                Privacy Policy
              </Link>
              , and delete your account at any time — see{' '}
              <Link
                className="rounded-sm font-medium text-ember-text underline decoration-ember-text/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-text"
                href="/delete-account"
              >
                Delete Account
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
