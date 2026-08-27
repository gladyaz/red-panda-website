import { QualityMockup, RewardsMockup } from '@/components/home/app-mockups';
import { PhoneFrame } from '@/components/home/phone-frame';
import { SectionHeading } from '@/components/home/section-heading';

/**
 * Two asymmetric feature sections: playback, then Rewards.
 *
 * They alternate side so the page has a rhythm rather than two identical rows,
 * and each pairs its copy with the app screen it is actually describing.
 */

const PLAYBACK_POINTS = [
  {
    title: 'Auto quality by default',
    body: 'Red Panda starts at a quality your connection can carry and moves up or down as it changes, so an episode keeps playing instead of stalling.',
  },
  {
    title: 'Or choose it yourself',
    body: 'Pick a fixed rendition in Playback Settings when you would rather control the data an episode uses. Higher rungs appear only for sources that have them.',
  },
  {
    title: 'Picks up where you stopped',
    body: 'Your position in every series is remembered, so the next time you open it the episode resumes rather than restarting.',
  },
];

export function Playback() {
  return (
    <section aria-labelledby="features-heading" id="features">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Built for mobile"
            id="features-heading"
            title="Smooth on the connection you actually have"
          >
            Red Panda streams adaptively over HLS. It is built for a phone on
            mobile data, not for a desk.
          </SectionHeading>

          <dl className="mt-9 space-y-7">
            {PLAYBACK_POINTS.map((point) => (
              <div key={point.title}>
                <dt className="text-base font-semibold text-ink">
                  {point.title}
                </dt>
                <dd className="mt-1.5 text-base/7 text-ink-muted text-pretty">
                  {point.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <PhoneFrame
          caption="Illustration of playback quality settings"
          className="lg:order-first"
        >
          <QualityMockup />
        </PhoneFrame>
      </div>
    </section>
  );
}

/**
 * Rewards.
 *
 * The three earning paths and the two perks are the real V1 loop. What is
 * deliberately absent is as important as what is here: no coin purchase, no
 * subscription, no premium tier, no cash value, and no claim that a follow is
 * verified. The social line says outright that Red Panda cannot check — because
 * no platform offers a way to, and the backend's own contract says so.
 */
const EARN = [
  {
    step: 'Check in',
    body: 'Open Rewards once a day. The streak builds as long as you keep coming back.',
  },
  {
    step: 'Watch',
    body: 'Watch missions count the episodes you get through in a reward day.',
  },
  {
    step: 'Follow',
    body: 'Follow Red Panda on Instagram, TikTok or YouTube, then confirm in the app. Each platform pays once.',
  },
];

export function Rewards() {
  return (
    <section aria-labelledby="rewards-heading" id="rewards">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <PhoneFrame caption="Illustration of the Rewards screen">
          <RewardsMockup />
        </PhoneFrame>

        <div>
          <SectionHeading
            eyebrow="Rewards"
            id="rewards-heading"
            title={
              <>
                Watch. Earn. <span className="brand-text">Repeat.</span>
              </>
            }
          >
            Coins are earned, never bought — there is nothing to buy in Red Panda
            V1. You spend them on fewer ads.
          </SectionHeading>

          <ol className="mt-9 space-y-6">
            {EARN.map((item, index) => (
              <li className="flex gap-4" key={item.step}>
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-xs font-bold text-ember"
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-base font-semibold text-ink">{item.step}</p>
                  <p className="mt-1 text-base/7 text-ink-muted text-pretty">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-line bg-surface p-5">
            <p className="text-sm font-semibold text-ink">
              What coins are for
            </p>
            <p className="mt-2 text-sm/6 text-ink-muted">
              Two perks: skip the next ad, or an ad-free pass for two hours.
              That is the whole list.
            </p>
          </div>

          <p className="mt-5 text-sm/6 text-ink-dim">
            Social missions pay out when you confirm in the app that you
            followed. Red Panda cannot check this with Instagram, TikTok or
            YouTube — no platform offers a way to verify it — so the reward is
            based on your confirmation.
          </p>
        </div>
      </div>
    </section>
  );
}
