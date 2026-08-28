import Link from 'next/link';

import { PageShell, Section } from '@/components/page-shell';
import { SupportContact } from '@/components/support-contact';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Support',
  description:
    'Help with Red Panda: signing in with Google or WhatsApp, playback and video quality, rewards and coins, deleting your account, and how to reach us.',
  path: '/support',
});

const TOPICS = [
  { id: 'account', label: 'Account & Login' },
  { id: 'whatsapp', label: 'WhatsApp OTP' },
  { id: 'google', label: 'Google Login' },
  { id: 'playback', label: 'Playback' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'delete', label: 'Delete Account' },
  { id: 'contact', label: 'Contact Support' },
] as const;

/** A bulleted list, matching the one the policy and deletion pages use. */
function Points({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5 pl-1">
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <span
            aria-hidden="true"
            className="mt-[0.7em] size-1 shrink-0 rounded-full bg-line-strong"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SupportPage() {
  return (
    <PageShell
      intro="Answers to the questions Red Panda gets asked most, and how to reach a person when they do not cover it."
      title="Support"
    >
      <nav aria-label="On this page" className="mb-12">
        <h2 className="text-sm font-semibold tracking-wide text-ink-dim uppercase">
          On this page
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {TOPICS.map((topic) => (
            <li key={topic.id}>
              <a
                className="rounded-sm text-sm text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-ink hover:decoration-ink-muted"
                href={`#${topic.id}-heading`}
              >
                {topic.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id="account" title="Account & Login">
        <p>
          You do not need an account to watch Red Panda. Browsing the catalogue and playing episodes
          both work as a guest.
        </p>
        <p>
          Signing in is what makes your activity follow you between devices. Red Panda V1 offers two
          ways in: Sign in with Google, and a one-time code sent over WhatsApp.
        </p>
        <Points
          items={[
            'Once you are signed in, your likes, saved series, watch progress and coin balance are stored on your account rather than only on that phone.',
            'You can be signed in on more than one device at a time. Signing out ends the session on that device only.',
            'If you are signed out unexpectedly, sign in again — the session on that device may have expired or been ended.',
          ]}
        />
      </Section>

      <Section id="whatsapp" title="WhatsApp OTP">
        <p>
          Enter your phone number and Red Panda sends a six-digit code to that number on WhatsApp.
          Enter the code to finish signing in.
        </p>
        <Points
          items={[
            'You can type your number with a leading 0, with a + and the country code, or with 00 and the country code. All three are accepted.',
            'The code is short-lived and can only be used once. If it is rejected, request a new one rather than retrying the old code.',
            'A rejected code always shows the same message, whether it was wrong, expired or already used. That is deliberate: a more specific message would help somebody guessing at a number that is not theirs.',
            'You can request a new code once a minute, and a limited number of times per hour for the same number. Wait for the countdown rather than repeating the request.',
            'If the message does not arrive at all, check that the number is the one your WhatsApp account uses, and that you have a connection.',
          ]}
        />
      </Section>

      <Section id="google" title="Google Login">
        <p>
          Sign in with Google uses the Google account already on your Android device — there is no
          separate Red Panda password to remember, and Red Panda never sees your Google password.
        </p>
        <Points
          items={[
            'Red Panda receives the account identifier Google issues, and your email address only when Google confirms that address is verified.',
            'If you sign in with Google using the same verified email address as an existing Red Panda account, you will be asked to confirm before the two are linked.',
            'If sign-in fails on the Google screen itself, the problem is usually the Google account on the device rather than Red Panda; try again, or pick a different account.',
          ]}
        />
      </Section>

      <Section id="playback" title="Playback">
        <p>
          Red Panda streams adaptively: it starts at a quality your connection can carry and moves
          up or down as the connection changes, so an episode keeps playing rather than stalling.
        </p>
        <Points
          items={[
            'Auto is the default. You can choose a fixed quality yourself in Playback Settings if you would rather control the data an episode uses.',
            'If playback stalls, leave it on Auto — a fixed high quality on a weak connection is the most common cause of buffering.',
            'Every episode in Red Panda V1 is free to watch. Playback is supported by full-screen ads shown between episodes.',
            'Subtitles are part of the video itself, so they cannot be switched off separately.',
            'If an episode will not play at all, check your connection first. Red Panda shows a clear error with a Retry action rather than spinning indefinitely.',
          ]}
        />
      </Section>

      <Section id="rewards" title="Rewards">
        <p>
          Rewards is Red Panda&rsquo;s coin programme. Coins are earned, never bought — there is
          nothing to buy in Red Panda V1.
        </p>
        <p>You earn coins three ways:</p>
        <Points
          items={[
            'Daily check-in — open Rewards and check in once per reward day.',
            'Watch missions — watch a number of different episodes within a reward day.',
            'Social missions — follow Red Panda on Instagram, TikTok or YouTube. Each platform pays once per account.',
          ]}
        />
        <p>And you spend them on ad perks:</p>
        <Points
          items={[
            'Skip the next ad — skips one full-screen ad. Use it within 24 hours of redeeming it.',
            'Ad-free pass — no full-screen ads for two hours.',
          ]}
        />
        <p className="text-sm text-ink-dim">
          A social mission pays out when you confirm in the app that you followed the account. Red
          Panda cannot check this with Instagram, TikTok or YouTube — no platform offers a way to
          verify it — so the reward is based on your confirmation.
        </p>
      </Section>

      <Section id="delete" title="Delete Account">
        <p>
          You can delete your Red Panda account permanently, and you can do it yourself inside the
          app whichever way you sign in. Red Panda asks you to confirm with the method your account
          already uses: your current password, a fresh sign-in with your linked Google account, or a
          verification code sent to your linked WhatsApp number.
        </p>
        <p>
          Contact support only if you cannot get into the app at all, or you have lost the sign-in
          method itself — the phone that receives your WhatsApp code, or your Google account.
        </p>
        <p>
          Full steps, and exactly what is deleted, are on the{' '}
          <Link
            className="rounded-sm font-medium text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft"
            href="/delete-account"
          >
            Delete Account
          </Link>{' '}
          page.
        </p>
      </Section>

      <Section id="contact" title="Contact Support">
        <div className="rounded-lg border border-line bg-surface p-5">
          <SupportContact />
        </div>
        <p>
          Red Panda has no support ticket system. Messages are read and answered by a person, so
          please describe what happened, what you expected, and the phone and Android version you
          are using.
        </p>
        <p>
          For questions about what data Red Panda holds, read the{' '}
          <Link
            className="rounded-sm font-medium text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft"
            href="/privacy"
          >
            Privacy Policy
          </Link>{' '}
          first — it may already answer them.
        </p>
      </Section>
    </PageShell>
  );
}
