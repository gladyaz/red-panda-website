# Series poster artwork

Drop the four Red Panda series covers in this directory and the homepage rail
picks them up on the next build. **No code change is needed.**

## Filenames

The file stem must be the backend's own series id:

| File | Series | Genre |
|---|---|---|
| `series-101.<ext>` | Hidup Bahagiaku Bersama Sang Permaisuri | Romance |
| `series-104.<ext>` | Malapetaka Datang: Benteng Bergerakku | Action |
| `series-010.<ext>` | Kue Gulung Kaya Raya: Kedaiku Menembus Waktu | Comedy |
| `series-105.<ext>` | Hati Yin yang Jahat: Antagonis Serang Habis-habisan | Drama |

Accepted extensions, in the order they are preferred:
`avif`, `webp`, `jpg`, `jpeg`, `png`.

Adding a `.webp` next to an existing `.jpg` switches to the smaller file with no
other change.

## Format

- **Aspect ratio 2:3 portrait** — the same ratio the app's Discover grid uses
  (`POSTER_ASPECT_RATIO = 2 / 3`). The tile crops to fill, so anything close
  works, but a 2:3 export avoids losing the top or bottom of the artwork.
- **Roughly 600 × 900** is plenty. The tile is never rendered wider than about
  300 CSS pixels, so a larger file only costs bandwidth.
- Compress before committing. These are the heaviest assets on the site.

## Where to get them

Covers live in the **private** Cloudflare R2 bucket as `Series.coverImageKey`,
and reach the app only as expiring presigned URLs — there is no cover file in
either the mobile or the backend repository. Export them from R2, or from
whatever source the covers were produced from, and commit them here.

## What happens until then

Each tile renders the same branded fallback the Red Panda app itself shows for a
series with no cover: the series initial in the brand colour on an elevated
surface, with a gradient bar beneath. Nothing is broken and nothing is faked —
the page simply has no photograph to show yet.

## What must not go here

Artwork from another short-drama app, stock photography standing in for a real
drama, or AI-generated art presented as a real series cover. A poster is a claim
about what a drama looks like, and the whole site is built on not making claims
it cannot support.
