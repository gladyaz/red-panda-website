/**
 * The Red Panda catalog, as it actually exists.
 *
 * SOURCE OF TRUTH: `short-drama-backend-v1-release-gate`'s
 * `src/videos/videos.data.ts`, the array `prisma/seed.ts` seeds the `Video`
 * table from. Four series, ten episodes each, forty rows. Titles, genres and
 * episode counts below are copied from it verbatim — nothing here is invented,
 * and no fifth series was added to make a rail look fuller.
 *
 * WHAT IS DELIBERATELY ABSENT: view counts, ratings, rankings and "trending"
 * positions. The backend stores a seeded `likeCount` and nothing else that
 * could support any of them, so none of them appear on this site. A streaming
 * site is exactly where invented engagement numbers look most natural and are
 * most misleading.
 *
 * ARTWORK: series covers live in a PRIVATE Cloudflare R2 bucket and reach
 * clients only as short-lived presigned URLs (see the mobile repo's
 * `docs/internal-storage.md`), so this site cannot fetch them at build time.
 * A committed copy of the four production covers therefore lives in
 * `public/posters/`, keyed by the ids below. Remove one and that tile falls
 * back to the branded initial the app itself shows for a series with no
 * cover — see `public/posters/README.md`.
 */

export interface Series {
  /** The backend's own series id. Also the poster filename stem. */
  readonly id: string;
  readonly title: string;
  /** Genre, exactly as the catalog records it. */
  readonly genre: Genre;
  readonly episodeCount: number;
  /**
   * Portrait or landscape source, from the record's measured `width`/`height`.
   * Not shown to visitors — it is here so nobody later assumes every series is
   * vertical and writes copy that says so.
   */
  readonly orientation: 'portrait' | 'landscape';
}

/**
 * The genres real catalog rows actually carry.
 *
 * The app ships eight category chips (it also knows Revenge, Family, CEO and
 * Historical), but only these four have any content behind them today — the
 * app's own empty state exists precisely because a chip can be selected with
 * nothing in it. Listing the other four on a marketing page would advertise a
 * catalog that is not there.
 */
export type Genre = 'Romance' | 'Action' | 'Comedy' | 'Drama';

export const SERIES: readonly Series[] = [
  {
    id: 'series-101',
    title: 'Hidup Bahagiaku Bersama Sang Permaisuri',
    genre: 'Romance',
    episodeCount: 10,
    orientation: 'portrait',
  },
  {
    id: 'series-104',
    title: 'Malapetaka Datang: Benteng Bergerakku',
    genre: 'Action',
    episodeCount: 10,
    orientation: 'portrait',
  },
  {
    id: 'series-010',
    title: 'Kue Gulung Kaya Raya: Kedaiku Menembus Waktu',
    genre: 'Comedy',
    episodeCount: 10,
    orientation: 'landscape',
  },
  {
    id: 'series-105',
    title: 'Hati Yin yang Jahat: Antagonis Serang Habis-habisan',
    genre: 'Drama',
    episodeCount: 10,
    orientation: 'landscape',
  },
];

/** Every genre with at least one series behind it, in catalog order. */
export const GENRES: readonly Genre[] = [
  ...new Set(SERIES.map((series) => series.genre)),
];

export const TOTAL_EPISODES = SERIES.reduce(
  (total, series) => total + series.episodeCount,
  0,
);

/**
 * The first character of a title, used by the fallback tile.
 *
 * `Array.from`, not `[0]`: a Chinese or emoji-leading title is one code point
 * wide but two UTF-16 units, and indexing would split it in half. This mirrors
 * `resolvePosterInitial` in the app's `discover-poster.tsx` exactly.
 */
export function posterInitial(title: string): string {
  const [first] = Array.from(title.trim());

  return first ? first.toUpperCase() : '•';
}
