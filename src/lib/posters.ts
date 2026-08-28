import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Resolves which series have real cover artwork on disk, at BUILD time.
 *
 * Series covers live in a private Cloudflare R2 bucket and are served as
 * short-lived presigned URLs, so a static site cannot fetch them — the only way
 * artwork reaches this site is a file committed under `public/posters/`. That
 * may or may not have happened yet, and the page has to be correct either way.
 *
 * Resolving it here, on the server, during the prerender, is what lets the
 * poster tile stay a Server Component: no `onError` handler, no client
 * JavaScript, no flash of a broken image before a fallback swaps in. A build
 * with artwork ships `<img>`; a build without it ships the branded fallback,
 * and neither needs a code change to become the other.
 *
 * The extension list is ordered by preference, so dropping in a `.webp`
 * alongside an old `.jpg` switches to the smaller file automatically.
 */
const POSTER_DIRECTORY = join(process.cwd(), 'public', 'posters');

const EXTENSIONS = ['avif', 'webp', 'jpg', 'jpeg', 'png'] as const;

export function findPoster(seriesId: string): string | undefined {
  for (const extension of EXTENSIONS) {
    const fileName = `${seriesId}.${extension}`;

    if (existsSync(join(POSTER_DIRECTORY, fileName))) {
      return `/posters/${fileName}`;
    }
  }

  return undefined;
}
