import { getGooglePlayUrl } from '@/lib/site-config';

/**
 * The homepage call to action.
 *
 * Red Panda is not on Google Play yet. Until `NEXT_PUBLIC_GOOGLE_PLAY_URL`
 * holds a real `play.google.com` listing, this renders a STATUS — not a
 * link, not a disabled button that looks clickable, and above all not a Play
 * badge pointing at a search page or a guessed store URL. A store badge that
 * leads nowhere is the single most common way a pre-launch site misleads the
 * person reading it.
 *
 * The moment the variable is set, the same slot becomes a real link. Nothing
 * else on the page changes.
 */
export function GooglePlayStatus() {
  const playUrl = getGooglePlayUrl();

  if (playUrl) {
    return (
      <a
        className="inline-flex items-center justify-center rounded-full bg-ember px-6 py-3 text-sm font-semibold text-canvas transition-opacity duration-150 hover:opacity-90"
        href={playUrl}
      >
        Get Red Panda on Google Play
      </a>
    );
  }

  return (
    <p className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-medium text-ink">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
      Coming to Google Play
    </p>
  );
}
