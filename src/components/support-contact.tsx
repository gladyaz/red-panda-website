import { getSupportEmail } from '@/lib/site-config';

/**
 * The one place on this site that decides how to render a support contact.
 *
 * Two pages need it — Support and Delete Account — and they cannot afford to
 * disagree: support is the deletion fallback for anyone who has lost access to
 * the app or to the sign-in method their account uses, and a page that showed
 * a mailbox while another said there was none would strand exactly the person
 * with nowhere else to go.
 *
 * When `NEXT_PUBLIC_SUPPORT_EMAIL` is unset, this renders a plain statement of
 * that fact. It never renders a placeholder address.
 */
export function SupportContact({
  unsetMessage = 'Support contact details are being finalized and will be published here.',
}: {
  /** Overridable so the deletion page can say what it means in that context. */
  unsetMessage?: string;
}) {
  const email = getSupportEmail();

  if (!email) {
    return <p className="text-ink-muted">{unsetMessage}</p>;
  }

  return (
    <p className="text-ink-muted">
      Email us at{' '}
      <a
        className="rounded-sm font-medium text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft"
        href={`mailto:${email}`}
      >
        {email}
      </a>
      .
    </p>
  );
}

/** Whether a support mailbox is configured, for callers that branch on it. */
export function hasSupportEmail(): boolean {
  return getSupportEmail() !== undefined;
}
