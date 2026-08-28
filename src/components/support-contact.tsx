import { getSupportEmail, getSupportWhatsApp } from '@/lib/site-config';

/**
 * The one place on this site that decides how to render a support contact.
 *
 * Two pages need it — Support and Delete Account — and they cannot afford to
 * disagree: support is the deletion fallback for anyone who has lost access to
 * the app or to the sign-in method their account uses, and a page that showed
 * a contact while another said there was none would strand exactly the person
 * with nowhere else to go.
 *
 * Either route may be configured without the other, so all four states are
 * handled. When neither is set this renders a plain statement of that fact. It
 * never renders a placeholder address or a placeholder number.
 */

const LINK_CLASS =
  'rounded-sm font-medium text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft';

export function SupportContact({
  unsetMessage = 'Support contact details are being finalized and will be published here.',
}: {
  /** Overridable so the deletion page can say what it means in that context. */
  unsetMessage?: string;
}) {
  const email = getSupportEmail();
  const whatsApp = getSupportWhatsApp();

  if (!email && !whatsApp) {
    return <p className="text-ink-muted">{unsetMessage}</p>;
  }

  return (
    <div className="space-y-2 text-ink-muted">
      {email ? (
        <p>
          Email us at{' '}
          <a className={LINK_CLASS} href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
      ) : null}

      {whatsApp ? (
        <p>
          Or message us on WhatsApp at{' '}
          <a
            className={LINK_CLASS}
            // wa.me wants the international number with no `+` and no
            // separators, which is exactly what `getSupportWhatsApp` returns.
            href={`https://wa.me/${whatsApp}`}
            // The link leaves this site, and nothing here should hand the
            // destination a window handle or a referrer path.
            rel="noopener noreferrer"
            target="_blank"
          >
            +{whatsApp}
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
