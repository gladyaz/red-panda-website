# Series poster artwork

The four Red Panda series covers live here. The homepage rail and the Discover
mockup pick them up at build time — **no code change is needed** to add, replace
or remove one.

## Filenames

The file stem must be the backend's own series id:

| File | Series | Genre |
|---|---|---|
| `series-101.webp` | Hidup Bahagiaku Bersama Sang Permaisuri | Romance |
| `series-104.webp` | Malapetaka Datang: Benteng Bergerakku | Action |
| `series-010.webp` | Kue Gulung Kaya Raya: Kedaiku Menembus Waktu | Comedy |
| `series-105.webp` | Hati Yin yang Jahat: Antagonis Serang Habis-habisan | Drama |

Accepted extensions, in the order they are preferred:
`avif`, `webp`, `jpg`, `jpeg`, `png`.

Dropping an `.avif` next to an existing `.webp` switches to the smaller file
with no other change. Deleting a file is also safe: that series falls back to
the branded initial tile the app itself shows for a series with no cover.

## Format

- **Aspect ratio 2:3 portrait** — the same ratio the app's Discover grid uses
  (`POSTER_ASPECT_RATIO = 2 / 3`). The files here are centre-cropped to it from
  taller 1:1.4 sources, so no title text is lost at the edges.
- **600 × 900** is what ships. The tile is never rendered wider than about
  300 CSS pixels, so a larger file only costs bandwidth.
- Compress before committing. These are the heaviest assets on the site — the
  four together are under 300 KB at WebP q80.

## Provenance

These are the production covers for exactly these four series, taken from the
same source the catalog was cut from. They carry the original Mandarin title
lockup, which is what the app displays too — the covers are not localised.

The same artwork also lives in the **private** Cloudflare R2 bucket as
`Series.coverImageKey` and reaches the app only as expiring presigned URLs, so
the bucket cannot be the source for a static site. That is why a committed copy
exists here rather than a fetch at build time.

## What must not go here

Artwork from another short-drama app, stock photography standing in for a real
drama, or AI-generated art presented as a real series cover. A poster is a claim
about what a drama looks like, and the whole site is built on not making claims
it cannot support.
