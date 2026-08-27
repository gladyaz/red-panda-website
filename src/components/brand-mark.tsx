import Link from 'next/link';

import { SITE_NAME } from '@/lib/site-config';

/**
 * The wordmark.
 *
 * Deliberately typographic. No official Red Panda logo asset exists yet, and
 * inventing one — even a tasteful geometric shape — would put a mark into the
 * header, the tab bar and eventually a store listing that the product owner
 * never approved and would have to unpick later. Type is the honest
 * placeholder: it is legible, it scales, and replacing it with a real asset is
 * a change to this one file.
 */
export function BrandMark({ asLink = true }: { asLink?: boolean }) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-ember transition-transform duration-200 group-hover:scale-125"
      />
      <span className="text-[0.98rem] font-semibold tracking-tight text-ink">
        {SITE_NAME}
      </span>
    </>
  );

  if (!asLink) {
    return <span className="group flex items-center gap-2.5">{content}</span>;
  }

  return (
    <Link
      className="group flex items-center gap-2.5 rounded-sm"
      href="/"
      // The homepage link in a header is conventionally unlabelled beyond the
      // wordmark, but the wordmark alone does not say where it goes.
      aria-label={`${SITE_NAME} — home`}
    >
      {content}
    </Link>
  );
}
