import Link from 'next/link';

import { PageShell, Section } from '@/components/page-shell';
import { SupportContact } from '@/components/support-contact';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Delete your Red Panda account',
  description:
    'How to permanently delete your Red Panda account and what happens to your data, including the route for accounts that signed in with Google or WhatsApp.',
  path: '/delete-account',
});

/**
 * The in-app steps, taken from the shipped screens rather than described from
 * memory.
 *
 * The Data & Privacy screen's own copy is Indonesian in every app language, so
 * the button labels below are quoted in Indonesian with an English gloss —
 * that is what a person actually sees on the screen, and a translated label
 * they cannot find would make these steps useless.
 */
const IN_APP_STEPS = [
  { label: 'Open Red Panda and sign in to the account you want to delete.' },
  { label: 'Go to the Profile tab.' },
  { label: 'Tap Data & Privacy.' },
  { label: 'Scroll to Hapus Akun — “Delete Account”.' },
  { label: 'Enter your password under Password Saat Ini — “Current password”.' },
  { label: 'Tap Hapus Akun Saya — “Delete my account”.' },
  {
    label:
      'Confirm on the dialog that appears, with Ya, Hapus Akun Saya Selamanya — “Yes, delete my account permanently”.',
  },
] as const;

export default function DeleteAccountPage() {
  return (
    <PageShell
      intro={
        <>
          Deleting your Red Panda account is <strong className="font-semibold text-ink">immediate
          and permanent</strong>. There is no grace period, no confirmation window and no way to
          undo it or recover the account afterwards.
        </>
      }
      title="Delete your Red Panda account"
    >
      {/*
        The Google/WhatsApp section comes FIRST, before the in-app steps, and
        that ordering is the whole point of this page. Red Panda V1 ships
        Google and WhatsApp sign-in; neither creates a password, and the
        deletion endpoint requires one. For those accounts this page is not a
        Play Store formality — it is the only deletion route that exists. Put
        the in-app steps first and the people who need this page most would
        read a procedure they cannot complete.
      */}
      <Section id="no-password" title="If you signed in with Google or WhatsApp">
        <p>
          Accounts created with Sign in with Google or with a WhatsApp one-time code do not have a
          password. Deleting an account from inside the app requires you to re-enter your password,
          so those accounts cannot use the in-app route — the app tells you this instead of showing
          you a password box you cannot fill in.
        </p>
        <p>
          <strong className="font-semibold text-ink">Request deletion by contacting support.</strong>{' '}
          Send your request from the email address on your account if you have one, and include:
        </p>
        <ul className="space-y-2.5 pl-1">
          {[
            'That you are asking for your Red Panda account to be deleted.',
            'How you sign in — Google or WhatsApp.',
            'The Google email address, or the phone number in international format, that you sign in with.',
          ].map((item) => (
            <li className="flex gap-3" key={item}>
              <span
                aria-hidden="true"
                className="mt-[0.7em] size-1 shrink-0 rounded-full bg-line-strong"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-lg border border-line bg-surface p-5">
          <SupportContact unsetMessage="A support address for deletion requests is being finalized and will be published on this page and on the Support page. Until it is, the in-app route below is the only way to delete an account." />
        </div>
        <p className="text-sm text-ink-dim">
          Before acting on a request we have to be satisfied that it comes from the account holder,
          so you may be asked to confirm something only you would know. There is no self-service
          web form for this yet; every request is handled by a person over email.
        </p>
      </Section>

      <hr className="rule-fade my-10" />

      <Section id="in-app" title="Delete from inside the app">
        <p>
          If your account has a password — because you registered with an email address and password
          — you can delete it yourself, without contacting anyone:
        </p>
        <ol className="mt-1 space-y-3">
          {IN_APP_STEPS.map((step, index) => (
            <li className="flex gap-4" key={step.label}>
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong text-xs font-semibold text-ink-muted"
              >
                {index + 1}
              </span>
              <span>{step.label}</span>
            </li>
          ))}
        </ol>
        <p>
          The account is deleted as soon as you confirm. Every session on every device is signed out
          at the same moment, and the app clears its local copy of that account&rsquo;s data from the
          phone you were using.
        </p>
      </Section>

      <hr className="rule-fade my-10" />

      <Section id="what-is-deleted" title="What deletion removes">
        <p>All of the following is deleted permanently:</p>
        <ul className="space-y-2.5 pl-1">
          {[
            'Your account record — your email address if you have one, your display name, and the date the account was created.',
            'Every sign-in method attached to the account: your Google account identifier, your phone number, and your password.',
            'Every session, on every device.',
            'The videos you liked and the videos you saved.',
            'Your watch progress for every series.',
            'Your coin balance and your entire rewards history — daily check-ins, watch missions, social missions, redemptions and any ad perks you were holding.',
            'Your content access records.',
          ].map((item) => (
            <li className="flex gap-3" key={item}>
              <span
                aria-hidden="true"
                className="mt-[0.7em] size-1 shrink-0 rounded-full bg-line-strong"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="what-is-kept" title="What is kept, and why">
        <p>
          Two kinds of record survive deletion. Both have every link to you removed in the same
          operation that deletes the account, and both are then deleted on a fixed schedule.
        </p>
        <ul className="space-y-2.5 pl-1">
          {[
            'App usage and crash events keep the event itself but lose the reference to your account. They are deleted after 180 days.',
            'Security audit records — a sign-in succeeded, an account was locked, an account was deleted — are stripped down to the type of event and the time it happened. The account reference, the hashed IP address, the device identification string and every other detail are erased. What remains is deleted after 2 years.',
          ].map((item) => (
            <li className="flex gap-3" key={item}>
              <span
                aria-hidden="true"
                className="mt-[0.7em] size-1 shrink-0 rounded-full bg-line-strong"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          These exist so that abuse of the service can still be detected and investigated after an
          account is gone. Neither can be traced back to you once your account is deleted.
        </p>
      </Section>

      <Section id="before-you-delete" title="Before you delete">
        <p>
          You can take a copy of your data with you first. In the app, open{' '}
          <span className="text-ink">Profile → Data &amp; Privacy → Ekspor Data Saya</span> (“Export
          my data”) to see your profile, sign-in methods, likes and saves, watch progress and app
          usage events. Do this before deleting — once the account is gone the export is gone with
          it.
        </p>
        <p>
          Uninstalling Red Panda does <strong className="font-semibold text-ink">not</strong> delete
          your account. It only removes the app and its local data from that phone.
        </p>
        <p>
          For the full picture of what Red Panda stores and for how long, see the{' '}
          <Link
            className="rounded-sm font-medium text-ember-text underline decoration-ember-text/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-text"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </Section>
    </PageShell>
  );
}
