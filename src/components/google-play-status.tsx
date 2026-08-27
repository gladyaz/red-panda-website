import { getGooglePlayUrl } from '@/lib/site-config';

/**
 * The store call to action.
 *
 * Red Panda is not on Google Play yet. Until `NEXT_PUBLIC_GOOGLE_PLAY_URL`
 * holds a real `play.google.com` listing, this renders a STATUS — not a link,
 * not a disabled button that still looks clickable, and above all not a Play
 * badge pointing at a search page or a guessed store URL. A store badge that
 * leads nowhere is the single most common way a pre-launch site misleads the
 * person reading it.
 *
 * There is no App Store control in either state. Red Panda V1 targets Android,
 * and an iOS button — even a "coming soon" one — would promise a platform the
 * project has not committed to.
 *
 * The moment the variable is set, the same slot becomes a real link. Nothing
 * else on the page changes.
 */
export function GooglePlayStatus() {
  const playUrl = getGooglePlayUrl();

  if (playUrl) {
    return (
      <a
        className="brand-gradient inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-canvas transition-transform duration-200 hover:scale-[1.02]"
        href={playUrl}
      >
        Get it on Google Play
        <span aria-hidden="true">&rarr;</span>
      </a>
    );
  }

  return (
    <p className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface px-6 py-3 text-sm font-semibold text-ink">
      <span
        aria-hidden="true"
        className="brand-gradient size-2 rounded-full"
      />
      Coming to Google Play
    </p>
  );
}
