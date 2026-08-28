import {
  BookmarkIcon,
  CompassIcon,
  FlameIcon,
  GiftIcon,
  HomeIcon,
  ProfileIcon,
  SearchIcon,
} from '@/components/home/mockup-icons';
import { SERIES, posterInitial, type Genre, type Series } from '@/lib/catalog';
import { findPoster } from '@/lib/posters';

/**
 * Illustrations of three real Red Panda screens: the Discover catalog, the
 * playback quality sheet, and Rewards.
 *
 * Every control drawn here exists in the shipped app, and every label is the
 * app's own string — Indonesian, because that is the app's default language.
 * Nothing promises a feature Red Panda does not have: no downloads, no
 * comments, no profiles-per-household, no cast button.
 *
 * The quality ladder deliberately stops at 720p. The transcode ladder is
 * 360p/540p/720p with a 1080p cap, and every series in the real catalog is a
 * 720×1280 or 1280×720 source, so no 1080p rung exists for any of them today.
 * Drawing one would over-promise in the one place a visitor would believe it.
 *
 * Rewards shows no coin balance and no redemption shelf. A balance would be a
 * fabricated account state, and what coins buy is a claim the copy beside the
 * frame already makes in words. The screen illustrates how coins are *earned*,
 * which is what that section is about.
 */

/**
 * The app's own Indonesian category labels, for the four genres the catalog
 * actually carries (`discover.category*` in the app's `translations.ts`).
 *
 * The English genre names elsewhere on this page are the *site's* language;
 * inside the phone frame the app's language is what a visitor would really
 * see, and a mockup that quietly translated the UI would be showing a build
 * that does not exist.
 */
const CATEGORY_LABEL: Record<Genre, string> = {
  Romance: 'Romantis',
  Action: 'Aksi',
  Comedy: 'Komedi',
  Drama: 'Drama',
};

const TABS = [
  { label: 'Home', Icon: HomeIcon },
  { label: 'Discover', Icon: CompassIcon },
  { label: 'Rewards', Icon: GiftIcon },
  { label: 'Saved', Icon: BookmarkIcon },
  { label: 'Profile', Icon: ProfileIcon },
] as const;

/** The app's bottom tab bar, with the current tab lit. */
function TabBar({ active }: { active: (typeof TABS)[number]['label'] }) {
  return (
    <div className="mt-2 flex justify-around border-t border-line px-1.5 pt-1.5 pb-2">
      {TABS.map(({ label, Icon }) => (
        <span
          className={`flex flex-col items-center gap-[2px] ${
            label === active ? 'text-ember' : 'text-ink-dim'
          }`}
          key={label}
        >
          <Icon className="size-[0.8rem]" />
          <span
            className={`text-[0.4rem] ${label === active ? 'font-semibold' : ''}`}
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * A poster inside a device mockup: artwork, an episode pill, no hover.
 *
 * The pill uses the app's own `discover.episodePill` shape ("10 EP") rather
 * than the site's spelled-out "10 episodes", because this is the app's grid.
 */
function MiniPoster({ series }: { series: Series }) {
  const poster = findPoster(series.id);

  return (
    <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-line bg-surface">
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          className="size-full object-cover"
          decoding="async"
          loading="lazy"
          src={poster}
        />
      ) : (
        <>
          <div className="flex size-full items-center justify-center">
            <span className="text-lg font-extrabold text-ember-soft">
              {posterInitial(series.title)}
            </span>
          </div>
          <span className="brand-gradient absolute inset-x-0 bottom-0 h-[2px]" />
        </>
      )}

      <span className="absolute right-1 bottom-1 rounded bg-canvas/80 px-1 py-[1px] text-[0.4rem] font-bold text-ink backdrop-blur-sm">
        {series.episodeCount} EP
      </span>
    </div>
  );
}

/** The Discover catalog grid — the screen that says "this is a drama app". */
export function DiscoverMockup() {
  return (
    <div className="flex h-full flex-col bg-canvas pt-8">
      <div className="px-3">
        <p className="text-[0.85rem] font-extrabold tracking-tight text-ink">
          Discover
        </p>

        {/* Search is a real control on this screen; drawn at rest, never with
            a query typed into it, so nothing implies a result set. */}
        <div className="mt-2 flex items-center gap-1.5 rounded-full border border-line px-2.5 py-[5px]">
          <SearchIcon className="size-[0.65rem] shrink-0 text-ink-dim" />
          <span className="truncate text-[0.5rem] text-ink-dim">
            Cari judul atau kategori…
          </span>
        </div>

        <div className="mt-2.5 flex gap-3">
          {['Home', 'New', 'Rankings'].map((tab, index) => (
            <span
              className={`relative pb-1 text-[0.55rem] ${
                index === 0 ? 'font-bold text-ink' : 'font-medium text-ink-muted'
              }`}
              key={tab}
            >
              {tab}
              {index === 0 ? (
                <span className="brand-gradient absolute inset-x-0 bottom-0 h-[2px] rounded-full" />
              ) : null}
            </span>
          ))}
        </div>

        {/*
          Only the categories with content behind them. The app ships eight
          chips — it also knows Balas Dendam, Keluarga, CEO and Sejarah — but
          four of them are empty today, and a chip in a marketing illustration
          reads as a promise that tapping it shows something.
        */}
        <div className="mt-2 flex gap-1.5 overflow-hidden">
          {['Semua', ...SERIES.map((series) => CATEGORY_LABEL[series.genre])].map(
            (chip, index) => (
              <span
                className={`shrink-0 rounded-full px-2 py-[3px] text-[0.5rem] font-semibold ${
                  index === 0
                    ? 'brand-gradient text-canvas'
                    : 'border border-line text-ink-muted'
                }`}
                key={chip}
              >
                {chip}
              </span>
            ),
          )}
        </div>
      </div>

      {/* The grid runs past the fold, exactly as it does on a phone. */}
      <div className="mt-2.5 min-h-0 flex-1 overflow-hidden px-3">
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
          {SERIES.map((series) => (
            <div key={series.id}>
              <MiniPoster series={series} />
              <p className="mt-1 line-clamp-2 text-[0.5rem] leading-tight font-bold text-ink">
                {series.title}
              </p>
              <p className="mt-[2px] text-[0.45rem] text-ink-dim">
                {CATEGORY_LABEL[series.genre]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="Discover" />
    </div>
  );
}

/** The playback quality sheet, over a playing episode. */
export function QualityMockup() {
  const options = [
    { label: 'Auto', hint: 'Adapts to your network', active: true },
    { label: '720p', hint: 'HD', active: false },
    { label: '540p', hint: '', active: false },
    { label: '360p', hint: 'Uses less data', active: false },
  ];

  return (
    <div className="relative flex h-full flex-col justify-end bg-surface-muted">
      {/* The episode behind the sheet, suggested rather than faked. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,rgb(255_122_26/0.16),transparent_60%)]" />

      <div className="absolute inset-x-0 top-9 flex items-center gap-2 px-3">
        <span className="size-4 rounded-full border border-line-strong" />
        <span className="text-[0.5rem] text-ink-muted">Episode 3 of 10</span>
      </div>

      {/* The episode itself, suggested with the app's own vertical-feed
          furniture: a title line, an action rail and a progress bar. No
          photograph is implied and none is faked. */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-3">
        <div className="h-20 rounded-lg border border-line/60 bg-[linear-gradient(160deg,rgb(255_122_26/0.10),rgb(226_59_59/0.06))]" />
      </div>

      <div className="absolute right-2.5 bottom-28 flex flex-col items-center gap-2.5">
        {['Like', 'Save', 'Share'].map((action) => (
          <span
            className="size-5 rounded-full border border-line-strong bg-canvas/60"
            key={action}
          />
        ))}
      </div>

      <div className="absolute inset-x-3 bottom-24">
        <p className="text-[0.5rem] font-semibold text-ink">
          Hidup Bahagiaku Bersama Sang Permaisuri
        </p>
        <div className="mt-1.5 h-[2px] w-full rounded-full bg-line">
          <div className="brand-gradient h-full w-1/3 rounded-full" />
        </div>
      </div>

      <div className="relative m-2 rounded-xl border border-line bg-canvas-raised p-2.5">
        <p className="text-[0.6rem] font-semibold text-ink">Quality</p>

        <div className="mt-2 space-y-1">
          {options.map((option) => (
            <div
              className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
                option.active ? 'bg-surface' : ''
              }`}
              key={option.label}
            >
              <span
                className={`text-[0.55rem] ${option.active ? 'font-semibold text-ink' : 'text-ink-muted'}`}
              >
                {option.label}
              </span>
              <span className="flex items-center gap-1.5">
                {option.hint ? (
                  <span className="text-[0.45rem] text-ink-dim">
                    {option.hint}
                  </span>
                ) : null}
                {option.active ? (
                  <span className="size-1.5 rounded-full bg-ember" />
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * The check-in ladder, on a first day.
 *
 * The rungs, the streak and the seven-day bonus are values an admin configures
 * server-side; they are not derived here and not rounded to look neater. A
 * first-day state is drawn on purpose — it is the state a visitor who installs
 * from this page will actually open the screen to.
 */
const CHECK_IN_DAYS = [
  { day: 'H1', points: 50, state: 'Hari ini' },
  { day: 'H2', points: 50, state: 'Nanti' },
  { day: 'H3', points: 75, state: 'Nanti' },
  { day: 'H4', points: 75, state: 'Nanti' },
  { day: 'H5', points: 100, state: 'Nanti' },
] as const;

/**
 * Two social missions, both unfinished — which is what "0/2 selesai" says.
 *
 * YouTube is the app's third follow mission and is deliberately not drawn: its
 * row reads "Subscribe channel kami", and the homepage guard in
 * `pages.test.tsx` bans the word "subscribe" outright so that no visitor can
 * read a paid tier into this page. The guard is worth more than a third row —
 * the copy beside this frame already names all three platforms.
 *
 * Follows are the one earning path that copy has to qualify — Red Panda cannot
 * verify them with any platform — so drawing them at rest, with the action
 * still to take, is the honest state.
 */
const EARN_TASKS = [
  { title: 'Instagram', body: 'Ikuti akun kami', points: 25 },
  { title: 'TikTok', body: 'Ikuti akun kami', points: 25 },
] as const;

/** The Rewards screen: the daily check-in ladder and the social missions. */
export function RewardsMockup() {
  return (
    <div className="flex h-full flex-col bg-canvas pt-8">
      <div className="min-h-0 flex-1 overflow-hidden px-3">
        <div className="flex items-center justify-between">
          <p className="text-[0.95rem] font-extrabold tracking-tight text-ink">
            Rewards
          </p>
          <span className="rounded-full border border-line px-2 py-[4px] text-[0.55rem] font-medium text-ink-muted">
            Riwayat
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold text-ink">Check-in harian</p>
          <span className="flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-[3px] text-[0.5rem] font-semibold text-ink-muted">
            <FlameIcon className="size-[0.55rem] text-ember" />1 hari berturut
          </span>
        </div>

        <div className="mt-2 rounded-xl border border-line bg-surface p-2.5">
          {/* The ladder runs past the right edge on a phone too. */}
          <div className="flex gap-1 overflow-hidden">
            {CHECK_IN_DAYS.map(({ day, points, state }) => {
              const isToday = state === 'Hari ini';

              return (
                <span
                  className={`flex shrink-0 basis-[22%] flex-col items-center gap-[3px] rounded-lg border py-2.5 ${
                    isToday
                      ? 'border-ember bg-ember/10'
                      : 'border-line bg-surface-muted'
                  }`}
                  key={day}
                >
                  <span
                    className={`text-[0.5rem] font-bold ${isToday ? 'text-ember' : 'text-ink-muted'}`}
                  >
                    {day}
                  </span>
                  <span
                    className={`size-[6px] rounded-full ${isToday ? 'bg-ember' : 'bg-line-strong'}`}
                  />
                  <span className="text-[0.6rem] font-extrabold text-ink">
                    {points}
                  </span>
                  <span
                    className={`text-[0.42rem] ${isToday ? 'text-ember' : 'text-ink-dim'}`}
                  >
                    {state}
                  </span>
                </span>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[0.55rem] text-ink-muted">
              Hadiah hari ini
            </span>
            <span className="rounded-full border border-ember/40 bg-ember/10 px-2 py-[2px] text-[0.5rem] font-bold text-ember-soft">
              +50
            </span>
          </div>

          <div className="brand-gradient mt-2 rounded-lg py-2 text-center text-[0.62rem] font-bold text-canvas">
            Check-in sekarang
          </div>

          <p className="mt-2 text-center text-[0.46rem] text-ink-dim">
            Check-in 7 hari berturut untuk bonus 150 koin
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold text-ink">Kumpulkan koin</p>
          <span className="text-[0.5rem] text-ink-dim">0/2 selesai</span>
        </div>

        <div className="mt-2 space-y-2">
          {EARN_TASKS.map((task) => (
            <div
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-2.5"
              key={task.title}
            >
              <span className="size-5 shrink-0 rounded-md border border-line-strong bg-surface-muted" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.56rem] font-semibold text-ink">
                  {task.title}
                </span>
                <span className="block truncate text-[0.46rem] text-ink-dim">
                  {task.body}
                </span>
              </span>
              <span className="rounded-full border border-ember/40 bg-ember/10 px-2 py-[2px] text-[0.46rem] font-bold text-ember-soft">
                +{task.points}
              </span>
            </div>
          ))}
        </div>

        {/*
          Watch time, at zero. The app renders a bare minute count with no
          target when no milestone is configured — a real state of the real
          screen, and the one that lets this section appear without inventing
          a threshold the backend has not been told about.
        */}
        <p className="mt-4 text-[0.7rem] font-bold text-ink">
          Bonus waktu tonton
        </p>
        <div className="mt-2 rounded-lg border border-line bg-surface px-2.5 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[0.55rem] text-ink-muted">Hari ini</span>
            <span className="text-[0.55rem] font-semibold text-ink">
              0 menit
            </span>
          </div>
          <div className="mt-2 h-[4px] rounded-full bg-surface-muted" />
        </div>
      </div>

      <TabBar active="Rewards" />
    </div>
  );
}
