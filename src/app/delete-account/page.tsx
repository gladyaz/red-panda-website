import Link from 'next/link';

import { PageShell, Section } from '@/components/page-shell';
import { SupportContact } from '@/components/support-contact';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Delete your Red Panda account',
  description:
    'How to permanently delete your Red Panda account from inside the app — confirming with your password, your linked Google account or a WhatsApp code — and what happens to your data.',
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
  {
    label:
      'Confirm that it is you, the same way you sign in — with your password, with your Google account, or with a code sent to your WhatsApp number. The app asks for the one your account uses; the next box says what each one looks like.',
  },
  { label: 'Tap Hapus Akun Saya — “Delete my account”.' },
  {
    label:
      'Confirm on the dialog that appears, with Ya, Hapus Akun Saya Selamanya — “Yes, delete my account permanently”.',
  },
] as const;

/**
 * Step 5, spelled out once per sign-in method.
 *
 * Every V1 sign-in method has its own deletion proof, and each proof is a
 * fresh re-demonstration of the very factor the account signs in with — so
 * nobody is ever asked for a credential their account does not have. Which of
 * these the app shows is decided by the account, not chosen by the person.
 *
 * Source: backend `docs/ACCOUNT_DELETION.md` §2–§3 (the provider → proof map
 * and `GET /users/me/deletion/methods`), and the shipped screen in mobile
 * `src/features/account-deletion/delete-account-card.tsx`, which is where the
 * Indonesian button labels below are quoted from.
 */
const CONFIRMATION_METHODS = [
  {
    method: 'Password',
    detail:
      'Type your current Red Panda password under Password Saat Ini — “Current password”.',
  },
  {
    method: 'Google',
    detail:
      'Tap Lanjutkan dengan Google — “Continue with Google” — and sign in to Google once more. It has to be the same Google account that is linked to your Red Panda account; any other one is refused.',
  },
  {
    method: 'WhatsApp',
    detail:
      'Tap Kirim Kode Verifikasi — “Send verification code”. Red Panda sends a code on WhatsApp to the number already linked to your account, and you type it under Kode Verifikasi — “Verification code”. That code only works for deleting the account; it cannot be used to sign in.',
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
        The in-app steps come FIRST, and that ordering is the whole point of
        this page. Every Red Panda V1 sign-in method — password, Google and
        WhatsApp — has a real in-app deletion path, each confirmed with the
        same factor that account signs in with, so the route at the top is the
        one virtually every visitor can actually complete.

        This page used to lead with the opposite claim: that Google and
        WhatsApp accounts had no password, could not use the in-app route, and
        had to email support. That was true of an earlier backend and is now
        false. Put the support route first again and the majority of visitors
        would be told to wait on an email for something they can do in under a
        minute.
      */}
      <Section id="in-app" title="Delete from inside the app">
        <p>
          You can delete your account yourself, in the app, however you signed up — with an email
          address and password, with Sign in with Google, or with a WhatsApp code. You do not need
          to contact anyone.
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
        <div className="rounded-lg border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold tracking-wide text-ink-dim uppercase">
            Step 5, for each way of signing in
          </h3>
          <dl className="mt-4 space-y-4">
            {CONFIRMATION_METHODS.map((option) => (
              <div key={option.method}>
                <dt className="font-semibold text-ink">{option.method}</dt>
                <dd className="mt-1">{option.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-ink-dim">
            If your account has more than one of these — a password and Google, say — the app lets
            you choose, and any single one of them is enough.
          </p>
        </div>
        <p>
          The account is deleted as soon as you confirm. Every session on every device is signed out
          at the same moment, and the app clears its local copy of that account&rsquo;s data from the
          phone you were using.
        </p>
      </Section>

      <hr className="rule-fade my-10" />

      <Section id="cannot-use-the-app" title="If you cannot use the steps above">
        <p>
          Support is the fallback for the cases the app cannot reach: you can no longer get into Red
          Panda at all, or you have lost the sign-in method itself — the phone number your WhatsApp
          code would go to, or the Google account linked to your Red Panda account. If you can still
          open the app and sign in, use the steps above instead; they are faster and need nobody
          else.
        </p>
        <p>
          <strong className="font-semibold text-ink">Ask support to delete the account.</strong>{' '}
          Send your request from the email address on your account if you have one, and include:
        </p>
        <ul className="space-y-2.5 pl-1">
          {[
            'That you are asking for your Red Panda account to be deleted.',
            'How you sign in — with a password, with Google, or with WhatsApp.',
            'The email address, or the phone number in international format, that you sign in with.',
            'Why you cannot complete the in-app steps — for example, the phone with that WhatsApp number is gone.',
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
          <SupportContact unsetMessage="A support address for deletion requests is being finalized and will be published on this page and on the Support page. The in-app steps above work today and do not depend on it." />
        </div>
        <p className="text-sm text-ink-dim">
          Before acting on a request we have to be satisfied that it comes from the account holder,
          so you may be asked to confirm something only you would know. There is no self-service
          web form for this; a request made this way is handled by a person over email.
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
            className="rounded-sm font-medium text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft"
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
