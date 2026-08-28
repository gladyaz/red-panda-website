import type { ReactNode } from 'react';

/**
 * The shared frame for the three content pages (Privacy, Delete Account,
 * Support).
 *
 * Holds the reading measure at a comfortable width and gives every one of them
 * the same `<h1>` treatment, so the three legal surfaces read as one document
 * set rather than three separately-styled pages.
 */
export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {intro ? (
          <div className="mt-4 text-base/7 text-ink-muted text-pretty">{intro}</div>
        ) : null}
      </header>

      <hr className="rule-fade my-10" />

      {children}
    </article>
  );
}

/**
 * A titled section within a content page. Renders a real `<h2>` inside a
 * `<section>` labelled by it, so the heading outline a screen reader announces
 * matches the one a sighted reader sees.
 */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-10 first:mt-0">
      <h2
        className="text-xl font-semibold tracking-tight text-ink"
        id={`${id}-heading`}
      >
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-base/7 text-ink-muted">{children}</div>
    </section>
  );
}
