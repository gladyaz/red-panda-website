'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SECONDARY_ROUTES } from '@/lib/navigation';

/**
 * The header's link row.
 *
 * The only client component in the site chrome, and it exists for exactly one
 * reason: `aria-current="page"` needs to know which route is open, and that is
 * only knowable in the browser on a statically rendered site. Everything else
 * about the header stays on the server.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 sm:gap-x-7">
        {SECONDARY_ROUTES.map((route) => {
          const isActive = pathname === route.href;

          return (
            <li key={route.href}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-sm text-sm transition-colors duration-150 hover:text-ink ${
                  isActive ? 'text-ink' : 'text-ink-muted'
                }`}
                href={route.href}
              >
                {route.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
