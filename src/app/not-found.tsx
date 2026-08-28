import Link from 'next/link';

import { SECONDARY_ROUTES } from '@/lib/navigation';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="text-xs font-semibold tracking-[0.22em] text-ember-soft uppercase">404</p>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        This page does not exist.
      </h1>
      <p className="mt-4 text-base/7 text-ink-muted">
        The Red Panda website has four pages. Here they are:
      </p>
      <ul className="mt-6 space-y-2.5">
        {[{ href: '/', label: 'Home' }, ...SECONDARY_ROUTES].map((route) => (
          <li key={route.href}>
            <Link
              className="rounded-sm text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft"
              href={route.href}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
