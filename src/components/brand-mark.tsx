import Link from 'next/link';

import { SITE_NAME } from '@/lib/site-config';

/**
 * The wordmark.
 *
 * Deliberately typographic. No Red Panda logo asset exists — the mobile app
 * still ships Expo's stock icon, and `logo-glow.png` in that repository is a
 * template gradient, not branding. Inventing a mark here would put a symbol
 * into the header, the browser tab and eventually a store listing that the
 * product owner never approved and would have to unpick later. Type is the
 * honest placeholder, and replacing it with a real asset is a change to this
 * one file.
 *
 * The dot carries the brand gradient, which is the one piece of visual identity
 * that IS real: it comes straight from the app's `Gradients.primary`.
 */
export function BrandMark({ asLink = true }: { asLink?: boolean }) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="brand-gradient size-2 rounded-full transition-transform duration-200 group-hover:scale-125"
      />
      <span className="text-base font-extrabold tracking-tight text-ink">
        {SITE_NAME}
      </span>
    </>
  );

  if (!asLink) {
    return <span className="group flex items-center gap-2.5">{content}</span>;
  }

  return (
    <Link
      // The wordmark alone does not say where it goes.
      aria-label={`${SITE_NAME} — home`}
      className="group flex shrink-0 items-center gap-2.5 rounded-sm"
      href="/"
    >
      {content}
    </Link>
  );
}
