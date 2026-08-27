import { SERIES, posterInitial } from '@/lib/catalog';
import { findPoster } from '@/lib/posters';

/**
 * Illustrations of three real Red Panda screens: the Discover catalog, the
 * playback quality sheet, and Rewards.
 *
 * Every control drawn here exists in the shipped app, and every label is the
 * app's own English string (`src/services/i18n/translations.ts`) or the real
 * rendition ladder. Nothing promises a feature Red Panda does not have — no
 * downloads, no comments, no profiles-per-household, no cast button.
 *
 * The quality ladder deliberately stops at 720p. The transcode ladder is
 * 360p/540p/720p with a 1080p cap, and every series in the real catalog is a
 * 720×1280 or 1280×720 source, so no 1080p rung exists for any of them today.
 * Drawing one would over-promise in the one place a visitor would believe it.
 *
 * Rewards shows no coin balance. A number there would be a fabricated account
 * state, and coins have no cash value — the structure of the screen makes the
 * point without inventing one.
 */

/** A poster inside a device mockup: no caption, no hover, just the artwork. */
function MiniPoster({ seriesId, title }: { seriesId: string; title: string }) {
  const poster = findPoster(seriesId);

  return (
    <div className="relative aspect-2/3 overflow-hidden rounded-md border border-line bg-surface">
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
              {posterInitial(title)}
            </span>
          </div>
          <span className="brand-gradient absolute inset-x-0 bottom-0 h-[2px]" />
        </>
      )}
    </div>
  );
}

/** The Discover catalog grid — the screen that says "this is a drama app". */
export function DiscoverMockup() {
  return (
    <div className="flex h-full flex-col bg-canvas px-3 pt-9 pb-3">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-bold tracking-tight text-ink">
          Discover
        </span>
        <span className="size-4 rounded-full border border-line" />
      </div>

      <div className="mt-2.5 flex gap-1.5 overflow-hidden">
        {['All', 'Romance', 'Action', 'Comedy'].map((chip, index) => (
          <span
            className={`shrink-0 rounded-full px-2 py-[3px] text-[0.55rem] font-semibold ${
              index === 0
                ? 'brand-gradient text-canvas'
                : 'bg-surface text-ink-muted'
            }`}
            key={chip}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {SERIES.map((series) => (
          <div key={series.id}>
            <MiniPoster seriesId={series.id} title={series.title} />
            <p className="mt-1 line-clamp-1 text-[0.5rem] font-semibold text-ink">
              {series.title}
            </p>
            <p className="text-[0.45rem] text-ink-dim">
              {series.genre} · {series.episodeCount} eps
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-around border-t border-line pt-2">
        {['Home', 'Discover', 'Rewards', 'Saved', 'Profile'].map(
          (tab, index) => (
            <span
              className={`text-[0.45rem] ${index === 1 ? 'font-semibold text-ember' : 'text-ink-dim'}`}
              key={tab}
            >
              {tab}
            </span>
          ),
        )}
      </div>
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

/** The Rewards screen: check-in streak, missions, and what coins are for. */
export function RewardsMockup() {
  const days = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
  const missions = [
    { label: 'Watch 3 episodes', meta: '2/3' },
    { label: 'Follow on Instagram', meta: 'Open' },
    { label: 'Follow on TikTok', meta: 'Open' },
  ];

  return (
    <div className="flex h-full flex-col bg-canvas px-3 pt-9 pb-3">
      <p className="text-[0.7rem] font-bold tracking-tight text-ink">Rewards</p>

      <div className="mt-2.5 rounded-xl border border-line bg-surface p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[0.5rem] text-ink-muted">Daily check-in</span>
          <span className="rounded-full bg-surface-muted px-1.5 py-[2px] text-[0.45rem] font-semibold text-ember">
            3-day streak
          </span>
        </div>

        <div className="mt-2 flex gap-[3px]">
          {days.map((day, index) => (
            <span
              className={`flex-1 rounded py-1 text-center text-[0.4rem] font-semibold ${
                index < 3
                  ? 'brand-gradient text-canvas'
                  : index === 3
                    ? 'border border-ember text-ember'
                    : 'bg-surface-muted text-ink-dim'
              }`}
              key={day}
            >
              {day}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[0.5rem] font-semibold text-ink-muted">
        Earn coins
      </p>
      <div className="mt-1.5 space-y-1.5">
        {missions.map((mission) => (
          <div
            className="flex items-center justify-between rounded-lg border border-line bg-surface px-2 py-1.5"
            key={mission.label}
          >
            <span className="text-[0.5rem] text-ink">{mission.label}</span>
            <span className="text-[0.45rem] font-semibold text-ink-dim">
              {mission.meta}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.5rem] font-semibold text-ink-muted">
        Redeem coins
      </p>
      <div className="mt-1.5 space-y-1.5">
        {['Skip the next ad', 'Ad-free pass · 2 hours'].map((perk) => (
          <div
            className="flex items-center justify-between rounded-lg border border-line bg-surface px-2 py-1.5"
            key={perk}
          >
            <span className="text-[0.5rem] text-ink">{perk}</span>
            <span className="brand-gradient rounded px-1.5 py-[2px] text-[0.4rem] font-bold text-canvas">
              Redeem
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
