import { PosterTile } from '@/components/home/poster-tile';
import { SectionHeading } from '@/components/home/section-heading';
import { GENRES, SERIES } from '@/lib/catalog';

/**
 * The catalog rail and the genre strip.
 *
 * Both are driven entirely by `SERIES` in `src/lib/catalog.ts`, which is copied
 * from the backend's seed data. Adding a series there adds it here; there is no
 * second, hand-maintained list on this page that could drift from the catalog
 * the app actually serves.
 *
 * WHAT THIS SECTION DOES NOT DO: no view counts, no star ratings, no "#1
 * trending" rank, no "new" badge. The backend records none of those, so every
 * one of them would be a number invented to make a rail look busier. The
 * heading says "Now on Red Panda" rather than "Trending" for the same reason —
 * there is no popularity signal behind a trending claim.
 *
 * The tiles are not links. Red Panda has no web player.
 */
export function Discover() {
  return (
    <section aria-labelledby="discover-heading" id="discover">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Discover"
          id="discover-heading"
          title="Now on Red Panda"
        >
          Mandarin short dramas with Indonesian subtitles burned into every
          episode. Ten episodes per series, all free to watch.
        </SectionHeading>
      </div>

      {/*
        Full-bleed on mobile so the rail can scroll past the viewport edge and
        read as a rail rather than a cropped grid; constrained again from md,
        where `.rail` becomes a four-column grid.
      */}
      <div className="mt-10 md:mx-auto md:max-w-6xl md:px-8">
        <ul className="rail">
          {SERIES.map((series, index) => (
            <li key={series.id}>
              <PosterTile priority={index === 0} series={series} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <h3 className="text-sm font-bold tracking-[0.16em] text-ink-dim uppercase">
          Browse by genre
        </h3>
        {/*
          Only the genres real rows actually carry. The app ships eight category
          chips — it also knows Revenge, Family, CEO and Historical — but four of
          them have nothing behind them today, and a marketing page listing them
          would advertise a catalog that is not there.
        */}
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {GENRES.map((genre) => (
            <li key={genre}>
              <span className="inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink">
                {genre}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
