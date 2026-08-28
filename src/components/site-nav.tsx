'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HEADER_ROUTES, HOME_SECTIONS } from '@/lib/navigation';

const LINK_CLASS =
  'rounded-sm whitespace-nowrap text-[0.8125rem] transition-colors duration-150 hover:text-ink sm:text-sm';

/**
 * The header's link row.
 *
 * A client component for two reasons, both of which need the current path:
 * `aria-current="page"` has to know which route is open, and a section anchor
 * has to become `/#rewards` rather than `#rewards` when the visitor is on a
 * legal page — a bare fragment there would scroll the Privacy Policy to an
 * element that does not exist.
 *
 * Below `sm` the three section anchors are hidden and only Privacy and Support
 * remain. That is not an arbitrary trim: five items overflow a 375px header, and
 * a scrolled-off link is a hidden link. The anchors are the ones that can afford
 * to go — they jump to sections the visitor reaches by scrolling anyway — while
 * Privacy and Support are the two Google Play requires to be findable, so they
 * are the two that stay on screen at every width. No hamburger, no menu state,
 * no focus trap.
 */
export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav aria-label="Primary" className="min-w-0">
      <ul className="scrollbar-none -mx-1 flex items-center gap-x-4 overflow-x-auto px-1 sm:gap-x-6">
        {HOME_SECTIONS.map((section) => (
          <li className="hidden sm:block" key={section.id}>
            <a
              className={`${LINK_CLASS} text-ink-muted`}
              href={isHome ? `#${section.id}` : `/#${section.id}`}
            >
              {section.label}
            </a>
          </li>
        ))}

        {/* Separates jump links from page links without adding a tab stop. */}
        <li aria-hidden="true" className="hidden sm:block">
          <span className="block h-3.5 w-px bg-line-strong" />
        </li>

        {HEADER_ROUTES.map((route) => {
          const isActive = pathname === route.href;

          return (
            <li key={route.href}>
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={`${LINK_CLASS} ${isActive ? 'text-ink' : 'text-ink-muted'}`}
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
