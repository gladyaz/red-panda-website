import Link from 'next/link';

import { SITE_NAME } from '@/lib/site-config';

/**
 * The logo lockup: the Red Panda mark beside the wordmark.
 *
 * The mark is the supplied brand artwork with its white background cut away.
 * That cut is not trivial and is worth recording: the artwork uses white as
 * both the background AND a design colour — the muzzle, the eye mask, the
 * chest swoosh and the ear insides are all white — and they meet the outer
 * white with no dividing outline. A plain background removal therefore eats
 * the panda's face. The committed PNG was cut by deciding what counted as
 * "outside" at 1/20 scale, where the narrow channel joining the muzzle to the
 * background does not survive, then recovering the crisp edge at full
 * resolution. Re-cut it the same way, or replace it with a transparent export
 * from the vector source, which is better than any automated cut.
 *
 * On this dark canvas the mark's black areas recede and the orange and white
 * carry the shape. That is a property of the artwork, not a bug to correct
 * here — recolouring a logo to suit a background is a brand decision.
 */
export function BrandMark({ asLink = true }: { asLink?: boolean }) {
  const content = (
    <>
      {/*
        Plain <img>, not next/image: this is an already-sized static file, and
        the optimizer would add a server dependency the site does not otherwise
        have — it must keep working as a pure static export.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        // Decorative: the wordmark beside it already carries the name, so a
        // screen reader announcing both would read "Red Panda Red Panda".
        alt=""
        className="size-7 shrink-0 transition-transform duration-200 group-hover:scale-110"
        decoding="async"
        height={28}
        src="/logo.png"
        width={28}
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
