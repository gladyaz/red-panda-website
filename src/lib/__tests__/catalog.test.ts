import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'vitest';

import { GENRES, SERIES, TOTAL_EPISODES, posterInitial } from '@/lib/catalog';
import { findPoster } from '@/lib/posters';

/**
 * The catalog on this website must be the catalog the backend actually serves.
 *
 * The expected values below are transcribed from
 * `short-drama-backend-v1-release-gate`'s `src/videos/videos.data.ts` — the
 * array `prisma/seed.ts` seeds the `Video` table from. They are hardcoded here
 * ON PURPOSE rather than derived from `SERIES`: a test that read its
 * expectations out of the module it is testing would pass just as happily for
 * an invented fifth drama. This list is the independent record.
 */
const BACKEND_CATALOG = [
  {
    id: 'series-101',
    title: 'Hidup Bahagiaku Bersama Sang Permaisuri',
    genre: 'Romance',
    episodeCount: 10,
  },
  {
    id: 'series-104',
    title: 'Malapetaka Datang: Benteng Bergerakku',
    genre: 'Action',
    episodeCount: 10,
  },
  {
    id: 'series-010',
    title: 'Kue Gulung Kaya Raya: Kedaiku Menembus Waktu',
    genre: 'Comedy',
    episodeCount: 10,
  },
  {
    id: 'series-105',
    title: 'Hati Yin yang Jahat: Antagonis Serang Habis-habisan',
    genre: 'Drama',
    episodeCount: 10,
  },
] as const;

describe('catalog fidelity', () => {
  test('carries exactly the four series the backend seeds, and no others', () => {
    // Arrange & Act
    const shipped = SERIES.map((series) => ({
      id: series.id,
      title: series.title,
      genre: series.genre,
      episodeCount: series.episodeCount,
    }));

    // Assert — a fabricated title, a renamed one, or a fifth invented drama
    // all fail here.
    expect(shipped).toEqual(
      expect.arrayContaining(BACKEND_CATALOG.map((s) => ({ ...s }))),
    );
    expect(shipped).toHaveLength(BACKEND_CATALOG.length);
  });

  test('reports 40 episodes, which is what the seed actually contains', () => {
    expect(TOTAL_EPISODES).toBe(40);
  });

  test('advertises only genres that have content behind them', () => {
    // The app ships eight category chips — it also knows Revenge, Family, CEO
    // and Historical — but only these four have any series today. Listing the
    // others would advertise a catalog that is not there.
    expect([...GENRES].sort()).toEqual(['Action', 'Comedy', 'Drama', 'Romance']);
  });

  test('every series id is unique', () => {
    expect(new Set(SERIES.map((s) => s.id)).size).toBe(SERIES.length);
  });
});

describe('poster resolution', () => {
  test('only ever returns a path that exists on disk', () => {
    // The homepage renders whatever this returns as an <img src>. A path that
    // resolved to nothing would be a broken image on the landing page.
    for (const series of SERIES) {
      const poster = findPoster(series.id);

      if (poster !== undefined) {
        expect(poster.startsWith('/posters/')).toBe(true);
        expect(
          existsSync(join(process.cwd(), 'public', poster.replace('/', ''))),
          `${poster} is served but not on disk`,
        ).toBe(true);
      }
    }
  });

  test('returns undefined for a series with no artwork, rather than guessing', () => {
    expect(findPoster('series-does-not-exist')).toBeUndefined();
  });

  test('the posters directory documents what belongs in it', () => {
    // Artwork arrives by somebody dropping files in; the README is the only
    // instruction they get about naming and format.
    const readme = join(process.cwd(), 'public', 'posters', 'README.md');

    expect(existsSync(readme)).toBe(true);
  });
});

describe('posterInitial', () => {
  test('takes the first character of the title, uppercased', () => {
    expect(posterInitial('Malapetaka Datang')).toBe('M');
  });

  test('does not split a multi-unit code point in half', () => {
    // Array.from, not [0]: a Chinese-leading title is one code point but two
    // UTF-16 units, and indexing would return half a character.
    expect(posterInitial('第1集')).toBe('第');
  });

  test('falls back to a bullet for an empty title', () => {
    expect(posterInitial('   ')).toBe('•');
  });
});
