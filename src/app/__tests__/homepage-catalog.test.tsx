import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import HomePage from '@/app/page';
import { SERIES } from '@/lib/catalog';

afterEach(cleanup);

describe('the catalog rail', () => {
  test('shows every real series, by its real title', () => {
    // Arrange & Act
    render(<HomePage />);
    const rail = screen.getByRole('heading', {
      level: 2,
      name: 'Now on Red Panda',
    }).closest('section')!;

    // Assert
    for (const series of SERIES) {
      expect(
        within(rail).getAllByText(series.title).length,
        `${series.title} is missing from the rail`,
      ).toBeGreaterThan(0);
    }
  });

  test('invents no drama that is not in the catalog', () => {
    const { container } = render(<HomePage />);

    // Every poster caption on the page has to be a title the backend actually
    // serves. This is the assertion that would fail if somebody padded the rail
    // with a plausible-sounding drama to make it look fuller.
    const captions = Array.from(container.querySelectorAll('figcaption p'))
      .map((node) => node.textContent?.trim() ?? '')
      .filter((text) => !/^\d+ episodes$/.test(text));

    const realTitles = new Set<string>(SERIES.map((series) => series.title));

    for (const caption of captions) {
      expect(realTitles.has(caption), `"${caption}" is not a real series`).toBe(
        true,
      );
    }
    expect(captions.length).toBe(SERIES.length);
  });

  test('states the real episode count for each series', () => {
    const { container } = render(<HomePage />);

    // Every series in the catalog has exactly ten episodes.
    const counts = Array.from(container.querySelectorAll('figcaption p'))
      .map((node) => node.textContent?.trim() ?? '')
      .filter((text) => /episodes$/.test(text));

    expect(counts).toEqual(SERIES.map((series) => `${series.episodeCount} episodes`));
  });

  test('quotes no rating, view count or ranking', () => {
    const { container } = render(<HomePage />);
    const text = container.textContent ?? '';

    // The backend records a seeded `likeCount` and nothing else that could
    // support any of these. A streaming site is exactly where invented
    // engagement numbers look most natural and are most misleading.
    const FABRICATED_METRICS: readonly [string, RegExp][] = [
      ['a star rating', /\d(\.\d)?\s*(★|\/\s*5|stars?\b)/i],
      // Each metric pattern must START with a digit. `[\d.,]+` alone also
      // matches a bare comma, which made "check-ins, watching and social
      // missions" read as a view count.
      ['a view count', /\d[\d.,]*\s*[KMB]?\s*(views|watching|viewers)/i],
      ['a ranking', /#\s*\d+\b|\bno\.\s*\d+|\btop\s+\d+\b/i],
      ['a download count', /\d[\d.,]*\s*[KMB]?\+?\s*(downloads|installs)/i],
      ['a user count', /\d[\d.,]*\s*[KMB]\+?\s*(users|fans|members)/i],
    ];

    for (const [label, pattern] of FABRICATED_METRICS) {
      expect(text, `The homepage must not quote ${label}`).not.toMatch(pattern);
    }
  });

  test('does not send a poster anywhere, because there is no web player', () => {
    const { container } = render(<HomePage />);

    // A tile that navigated nowhere — or worse, to a store page pretending to
    // be an episode — would be a promise the product cannot keep.
    for (const figure of container.querySelectorAll('figure')) {
      expect(figure.querySelector('a')).toBeNull();
      expect(figure.closest('a')).toBeNull();
    }
  });

  test('lists only genres that have content behind them', () => {
    render(<HomePage />);

    const genreList = screen
      .getByRole('heading', { level: 3, name: 'Browse by genre' })
      .closest('div')!;
    const rendered = within(genreList)
      .getAllByRole('listitem')
      .map((item) => item.textContent?.trim());

    expect(rendered).toEqual(['Romance', 'Action', 'Comedy', 'Drama']);

    // The four the app knows but has no series for must not appear.
    const text = genreList.textContent ?? '';
    for (const empty of ['Revenge', 'Family', 'CEO', 'Historical']) {
      expect(text, `${empty} has no content behind it`).not.toContain(empty);
    }
  });
});

describe('imagery', () => {
  test('every image carries alt text', () => {
    const { container } = render(<HomePage />);
    const images = container.querySelectorAll('img');

    for (const image of images) {
      // Decorative images inside the device mockups and the CTA backdrop take
      // alt="" deliberately; what must never happen is a missing attribute,
      // which a screen reader reads as the file name.
      expect(
        image.hasAttribute('alt'),
        `<img src="${image.getAttribute('src')}"> has no alt attribute`,
      ).toBe(true);
    }
  });

  test('every poster image names the series it belongs to', () => {
    const { container } = render(<HomePage />);

    for (const figure of container.querySelectorAll('figure')) {
      const image = figure.querySelector('img');

      // The fallback tile renders no <img> at all, which is the correct state
      // while `public/posters/` is empty — this only applies once artwork lands.
      if (image) {
        expect(image.getAttribute('alt')).toMatch(/^Cover art for .+/);
      }
    }
  });

  test('loads no image from a third-party host', () => {
    const { container } = render(<HomePage />);

    // Series covers live in a private R2 bucket behind expiring presigned URLs,
    // so any absolute image URL here would either be broken or borrowed.
    for (const image of container.querySelectorAll('img')) {
      expect(image.getAttribute('src') ?? '').toMatch(/^\/posters\//);
    }
  });
});

describe('rewards copy', () => {
  test('never offers a way to acquire coins with money', () => {
    render(<HomePage />);
    const rewards = screen
      .getByRole('heading', { level: 2, name: /Watch\. Earn\. Repeat\./ })
      .closest('section')!;
    const text = (rewards.textContent ?? '').toLowerCase();

    for (const offer of [
      'buy coins',
      'coin pack',
      'top up',
      'top-up',
      'premium',
      'subscription',
      'vip',
      'cash',
      'withdraw',
      'real money',
    ]) {
      expect(text, `Rewards must not mention "${offer}"`).not.toContain(offer);
    }

    expect(text).toContain('coins are earned, never bought');
  });

  test('says outright that a social follow is not verified', () => {
    render(<HomePage />);
    const rewards = screen
      .getByRole('heading', { level: 2, name: /Watch\. Earn\. Repeat\./ })
      .closest('section')!;
    const text = (rewards.textContent ?? '').toLowerCase();

    // No platform exposes a "did user X follow page Y" check, and the backend
    // contract says so. The denial has to be present, not merely the claim
    // absent.
    expect(text).toContain('red panda cannot check this');
    expect(text).toContain('no platform offers a way to verify it');

    for (const claim of [
      'we verify',
      'verified follow',
      'follow is verified',
      'automatically verified',
    ]) {
      expect(text).not.toContain(claim);
    }
  });

  test('describes only the two perks that exist', () => {
    render(<HomePage />);
    const rewards = screen
      .getByRole('heading', { level: 2, name: /Watch\. Earn\. Repeat\./ })
      .closest('section')!;

    expect(rewards.textContent).toContain('skip the next ad');
    expect(rewards.textContent).toContain('ad-free pass for two hours');
  });
});

describe('responsive structure', () => {
  test('the poster rail is the only horizontally scrolling region', () => {
    const { container } = render(<HomePage />);

    // A second scroll container is the usual source of an accidental
    // horizontal page overflow on mobile.
    const rails = container.querySelectorAll('.rail');
    expect(rails).toHaveLength(1);
  });

  test('no element declares a fixed pixel width wider than a small phone', () => {
    const { container } = render(<HomePage />);

    // jsdom does not lay out, so this checks the static source of overflow:
    // a hardcoded width in an inline style. Real overflow is verified in the
    // browser at 375px.
    for (const element of container.querySelectorAll<HTMLElement>('[style]')) {
      const width = element.style.width;

      if (width.endsWith('px')) {
        expect(
          Number.parseInt(width, 10),
          `${element.tagName} pins width to ${width}`,
        ).toBeLessThanOrEqual(320);
      }
    }
  });
});
