import Link from 'next/link';

import { SECONDARY_ROUTES } from '@/lib/navigation';
import { COPYRIGHT_YEAR, SITE_NAME } from '@/lib/site-config';

/**
 * The footer carries the same three links as the header, in words.
 *
 * No company name appears here. Red Panda has no registered legal entity
 * recorded anywhere in this project's repositories, and a copyright line
 * naming one that does not exist would be a false claim in the one place a
 * reader is most likely to trust it.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <nav aria-label="Legal and support">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {SECONDARY_ROUTES.map((route) => (
              <li key={route.href}>
                <Link
                  className="rounded-sm text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
                  href={route.href}
                >
                  {route.href === '/privacy' ? 'Privacy Policy' : route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-ink-dim">
          © {COPYRIGHT_YEAR} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
