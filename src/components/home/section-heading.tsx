import type { ReactNode } from 'react';

/**
 * The shared heading for every homepage section: a small brand-coloured
 * eyebrow, the heading itself, and an optional line beneath.
 *
 * The eyebrow is `aria-hidden`. It is a visual label, and a screen reader
 * announcing "Discover — Four dramas to start with" as one run of text would
 * read the decoration as part of the sentence.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
  align = 'start',
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: 'start' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <p
        aria-hidden="true"
        className="text-xs font-bold tracking-[0.2em] text-ember uppercase"
      >
        {eyebrow}
      </p>
      <h2
        className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        id={id}
      >
        {title}
      </h2>
      {children ? (
        <div
          className={`mt-4 text-base/7 text-ink-muted text-pretty ${
            align === 'center' ? 'mx-auto max-w-xl' : 'max-w-xl'
          }`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
