import { posterInitial, type Series } from '@/lib/catalog';
import { findPoster } from '@/lib/posters';

/**
 * One series tile.
 *
 * Renders real cover artwork when a file exists in `public/posters/`, and the
 * app's own branded fallback when it does not. That choice is made at build
 * time (`findPoster`), which is what keeps this a Server Component: no
 * `onError` handler, no client JavaScript, and no flash of a broken image
 * before a fallback swaps in.
 *
 * The fallback is not a generic grey box — it is a deliberate translation of
 * `PosterFallback` in the app's `discover-poster.tsx`: the series initial in
 * the brand colour on an elevated surface, with the brand gradient as a bar
 * beneath. A visitor who later installs the app sees the same treatment for
 * the same series, because it is the same design decision.
 *
 * Not a link. Red Panda has no web player, and a tile that navigated nowhere —
 * or worse, to a store page pretending to be an episode — would be a promise
 * the product cannot keep.
 */
export function PosterTile({
  series,
  priority = false,
}: {
  series: Series;
  /** The first row of the first rail; skips lazy-loading for the LCP image. */
  priority?: boolean;
}) {
  const poster = findPoster(series.id);

  return (
    <figure className="group">
      <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-line bg-surface">
        {poster ? (
          // Plain <img>, not next/image: these are already-sized static files
          // and the optimizer would add a server dependency this site does not
          // otherwise have — it must keep working as a pure static export.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`Cover art for ${series.title}`}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            decoding="async"
            loading={priority ? 'eager' : 'lazy'}
            src={poster}
          />
        ) : (
          <div
            // Decoration: the caption below already carries the title, so a
            // screen reader announcing a lone letter would only add noise.
            aria-hidden="true"
            className="relative flex size-full items-center justify-center bg-surface"
          >
            {/* A soft brand wash, so the tile reads as a designed placeholder
                rather than as artwork that failed to load. */}
            <span className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_38%,rgb(255_122_26/0.14),transparent_70%)]" />
            <span className="relative text-6xl font-extrabold text-ember-soft">
              {posterInitial(series.title)}
            </span>
            <span className="brand-gradient absolute inset-x-0 bottom-0 h-[3px]" />
          </div>
        )}

        <span className="absolute top-2 left-2 rounded-md bg-canvas/75 px-2 py-1 text-[0.65rem] font-semibold tracking-wide text-ink-muted uppercase backdrop-blur-sm">
          {series.genre}
        </span>
      </div>

      <figcaption className="mt-3">
        <p className="line-clamp-2 text-sm/5 font-semibold text-ink">
          {series.title}
        </p>
        <p className="mt-1 text-xs text-ink-dim">
          {series.episodeCount} episodes
        </p>
      </figcaption>
    </figure>
  );
}
