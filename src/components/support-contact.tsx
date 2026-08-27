import { getSupportEmail } from '@/lib/site-config';

/**
 * The one place on this site that decides how to render a support contact.
 *
 * Three pages need it — Support, Delete Account and the Privacy Policy's
 * contact section — and the deletion page in particular cannot afford to
 * disagree with the others: for a Google-only or WhatsApp-only account, this
 * address is the ONLY route to deletion that exists. A page that showed a
 * mailbox while another said there was none would strand exactly the person
 * who needs it most.
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
