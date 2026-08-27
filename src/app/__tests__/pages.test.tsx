import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import DeleteAccountPage from '@/app/delete-account/page';
import HomePage from '@/app/page';
import PrivacyPage from '@/app/privacy/page';
import SupportPage from '@/app/support/page';
import { SiteFooter } from '@/components/site-footer';
import { HOME_SECTIONS, SECONDARY_ROUTES } from '@/lib/navigation';

afterEach(cleanup);

const SUPPORT_EMAIL = 'support@redpanda.example';

/**
 * Vocabulary the homepage must never contain.
 *
 * Red Panda V1 has no payment, subscription, paywall or coin purchase — both
 * product repositories are explicit that the payment code paths ship disabled.
 * Copy implying otherwise would promise something the app cannot deliver, which
 * is exactly the failure a pre-launch site is most prone to.
 *
 * This blanket ban is applied to the HOMEPAGE ONLY, and deliberately so. The
 * homepage is the marketing surface and can be kept clean of these words
 * outright. The legal pages cannot: a privacy policy has to be able to say
 * "no payment information is ever collected", and a rule that flagged that
 * sentence would push a truthful policy towards a vaguer one. Those pages are
 * covered by `assertNoPaymentSurface` below, which tests for the thing that
 * actually matters — an offer to take money — rather than for a word.
 */
const FORBIDDEN_HOMEPAGE_MARKETING = [
  'premium',
  'subscription',
  'subscribe',
  'paywall',
  'checkout',
  'buy coins',
  'purchase',
  'pricing',
  'upgrade to',
];

function assertNoForbiddenMarketing(text: string, pageName: string) {
  const lowered = text.toLowerCase();

  for (const term of FORBIDDEN_HOMEPAGE_MARKETING) {
    expect(lowered, `${pageName} must not market "${term}"`).not.toContain(term);
  }
}

/**
 * Asserts a page offers no way to spend money: nothing clickable that asks for
 * it, and no price anywhere in the copy.
 *
 * This is the check that holds on every page, including the legal ones, because
 * it survives truthful sentences about the absence of payment while still
 * catching a real paid call to action if one is ever added.
 */
function assertNoPaymentSurface(container: HTMLElement, pageName: string) {
  const interactiveNames = Array.from(
    container.querySelectorAll('a, button'),
  ).map((element) => (element.textContent ?? '').toLowerCase());

  for (const name of interactiveNames) {
    for (const cue of ['subscribe', 'buy ', 'upgrade', 'checkout', 'pay now']) {
      expect(
        name,
        `${pageName} must not offer a "${cue}" action`,
      ).not.toContain(cue);
    }
  }

  const text = container.textContent ?? '';
  expect(text, `${pageName} must not quote a price`).not.toMatch(
    /(rp|idr|us\$|\$|€|£)\s?\d/i,
  );
  expect(text, `${pageName} must not quote a recurring price`).not.toMatch(
    /\d\s*(\/|per\s)\s*(month|bulan|year|tahun)/i,
  );
}

describe('homepage', () => {
  test('renders the hero', () => {
    // Arrange & Act
    render(<HomePage />);

    // Assert
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Stories worth another episode');

    // The brand is no longer inside the h1 — it moved to the wordmark in the
    // header and the badge above the headline. Assert it is still on the page.
    expect(screen.getByText('Short drama · Free to watch')).toBeTruthy();
  });

  test('renders every major section, each with a heading', () => {
    render(<HomePage />);

    for (const title of [
      'Now on Red Panda',
      'Smooth on the connection you actually have',
      'Four things, done properly',
      'Your next story is waiting',
    ]) {
      screen.getByRole('heading', { level: 2, name: title });
    }

    // The Rewards heading is split across spans for the gradient word.
    expect(
      screen.getByRole('heading', { level: 2, name: /Watch\. Earn\. Repeat\./ }),
    ).toBeTruthy();
  });

  test('every header jump link points at a section that exists', () => {
    const { container } = render(<HomePage />);

    // A header link to a missing anchor scrolls nowhere and reads as broken
    // rather than as absent, so the two lists have to stay in step.
    for (const section of HOME_SECTIONS) {
      expect(
        container.querySelector(`#${section.id}`),
        `no element with id="${section.id}"`,
      ).toBeTruthy();
    }
  });

  test('shows a non-clickable status, not a store link, while the listing does not exist', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_PLAY_URL', '');

    const { container } = render(<HomePage />);

    // Two CTAs by design: the hero and the closing section.
    expect(screen.getAllByText('Coming to Google Play')).toHaveLength(2);

    // The decisive assertion: nothing on the page points anywhere near a store.
    const hrefs = Array.from(container.querySelectorAll('a[href]')).map(
      (anchor) => anchor.getAttribute('href') ?? '',
    );
    expect(hrefs.some((href) => href.includes('play.google.com'))).toBe(false);
    expect(
      hrefs.every((href) => href.startsWith('/') || href.startsWith('#')),
    ).toBe(true);
  });

  test('becomes a real Play link once a genuine listing URL is configured', () => {
    const listing =
      'https://play.google.com/store/apps/details?id=com.spark.redpanda';
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_PLAY_URL', listing);

    render(<HomePage />);

    const links = screen.getAllByRole('link', {
      name: /Get it on Google Play/,
    });
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.getAttribute('href')).toBe(listing);
    }
    expect(screen.queryByText('Coming to Google Play')).toBeNull();
  });

  test('ignores a Play URL that is not actually on play.google.com', () => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_PLAY_URL', 'https://example.com/get-the-app');

    render(<HomePage />);

    expect(screen.getAllByText('Coming to Google Play')).toHaveLength(2);
  });

  test('offers no iOS download, which Red Panda V1 does not have', () => {
    const { container } = render(<HomePage />);
    const text = (container.textContent ?? '').toLowerCase();

    for (const cue of ['app store', 'ios', 'iphone', 'testflight']) {
      expect(text).not.toContain(cue);
    }
  });

  test('markets no paid tier of any kind', () => {
    const { container } = render(<HomePage />);

    assertNoForbiddenMarketing(container.textContent ?? '', 'The homepage');
    assertNoPaymentSurface(container, 'The homepage');
  });
});

describe('navigation', () => {
  test('the footer links to all three secondary routes', () => {
    render(<SiteFooter />);

    const nav = screen.getByRole('navigation', { name: 'Legal and support' });
    const hrefs = within(nav)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));

    expect(hrefs).toEqual(SECONDARY_ROUTES.map((route) => route.href));
  });

  test('the footer names no legal entity that does not exist', () => {
    const { container } = render(<SiteFooter />);
    const text = container.textContent ?? '';

    expect(text).toContain('© 2026 Red Panda');
    for (const suffix of ['Inc', 'Ltd', 'LLC', 'PT ', 'GmbH', 'Pte']) {
      expect(text).not.toContain(suffix);
    }
  });
});

describe('privacy page', () => {
  test('renders the policy with its expected headings', () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacy Policy' }),
    ).toBeTruthy();

    for (const title of [
      'What this policy covers',
      'Information you provide',
      'Advertising',
      'Technical and device information',
      'How long this is kept',
      'Deleting your account',
      'Security',
      'Contact',
    ]) {
      screen.getByRole('heading', { level: 2, name: title });
    }
  });

  test('offers both languages and switches between them', async () => {
    const { container } = render(<PrivacyPage />);

    const indonesian = screen.getByRole('button', { name: 'Bahasa Indonesia' });
    expect(indonesian.getAttribute('aria-pressed')).toBe('false');

    indonesian.click();

    // React 19 flushes this synchronously for a discrete click event.
    await Promise.resolve();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Kebijakan Privasi' }),
    ).toBeTruthy();
    expect(container.querySelector('[lang="id"]')).toBeTruthy();
  });

  test('never claims a social follow is verified, in either language', async () => {
    const { container } = render(<PrivacyPage />);

    /**
     * Affirmative claim shapes only. A phrase that could appear inside a
     * truthful DENIAL ("not a verified follow") is deliberately absent from
     * this list — banning it would push the copy towards vagueness to satisfy
     * a test, which is the opposite of the point. Every entry below asserts
     * that verification happens, and none of them can be part of a denial.
     */
    const AFFIRMATIVE_VERIFICATION_CLAIMS = [
      'we verify',
      'red panda verifies',
      'follow is verified',
      'automatically verified',
      'verified by instagram',
      'verified by tiktok',
      'verified by youtube',
      'kami memverifikasi',
      'red panda memverifikasi',
      'diverifikasi secara otomatis',
    ];

    const assertHonest = (required: string) => {
      const text = (container.textContent ?? '').toLowerCase();

      for (const claim of AFFIRMATIVE_VERIFICATION_CLAIMS) {
        expect(text).not.toContain(claim);
      }

      // The denial must be present, not merely the claim absent.
      expect(text).toContain(required);
    };

    assertHonest('cannot and does not check whether you actually followed');

    screen.getByRole('button', { name: 'Bahasa Indonesia' }).click();
    await Promise.resolve();

    assertHonest('tidak bisa dan tidak memeriksa apakah kamu benar-benar');
  });

  test('makes no absolute security or certification claim', () => {
    const { container } = render(<PrivacyPage />);
    const text = (container.textContent ?? '').toLowerCase();

    for (const claim of [
      'end-to-end encryption',
      'end-to-end encrypted',
      'gdpr certified',
      'iso 27001',
      'fully encrypted',
      'completely secure',
      'guarantee your data',
    ]) {
      expect(text).not.toContain(claim);
    }

    expect(text).toContain('no online service can guarantee absolute security');
  });
});

describe('delete account page', () => {
  test('renders the expected headings', () => {
    render(<DeleteAccountPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Delete your Red Panda account',
      }),
    ).toBeTruthy();

    for (const title of [
      'If you signed in with Google or WhatsApp',
      'Delete from inside the app',
      'What deletion removes',
      'What is kept, and why',
    ]) {
      screen.getByRole('heading', { level: 2, name: title });
    }
  });

  test('states plainly that no support address exists yet, rather than showing one', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', '');

    const { container } = render(<DeleteAccountPage />);

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(container.textContent).toContain(
      'A support address for deletion requests is being finalized',
    );
  });

  test('renders a real mailto link once the support address is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', SUPPORT_EMAIL);

    render(<DeleteAccountPage />);

    const link = screen.getByRole('link', { name: SUPPORT_EMAIL });
    expect(link.getAttribute('href')).toBe(`mailto:${SUPPORT_EMAIL}`);
  });

  test('does not offer a deletion form it cannot honour', () => {
    const { container } = render(<DeleteAccountPage />);

    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.textContent).toContain('no self-service web form');
  });
});

describe('support page', () => {
  test('renders every required topic as a heading', () => {
    render(<SupportPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Support' }),
    ).toBeTruthy();

    for (const title of [
      'Account & Login',
      'WhatsApp OTP',
      'Google Login',
      'Playback',
      'Rewards',
      'Delete Account',
      'Contact Support',
    ]) {
      screen.getByRole('heading', { level: 2, name: title });
    }
  });

  test('says the contact details are being finalized when none are configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', '');

    const { container } = render(<SupportPage />);

    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(container.textContent).toContain(
      'Support contact details are being finalized',
    );
  });

  test('renders the configured address as a mailto link', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', SUPPORT_EMAIL);

    render(<SupportPage />);

    expect(
      screen.getByRole('link', { name: SUPPORT_EMAIL }).getAttribute('href'),
    ).toBe(`mailto:${SUPPORT_EMAIL}`);
  });

  test('describes coins as earned, never bought', () => {
    const { container } = render(<SupportPage />);

    expect(container.textContent).toContain('Coins are earned, never bought');
    assertNoPaymentSurface(container, 'The support page');
  });
});

describe('no page offers a way to spend money', () => {
  test.each([
    ['privacy', <PrivacyPage key="privacy" />],
    ['delete account', <DeleteAccountPage key="delete" />],
  ])('the %s page has no payment surface', (name, element) => {
    const { container } = render(element);

    assertNoPaymentSurface(container, `The ${name} page`);
  });
});
