import { describe, expect, test, vi } from 'vitest';

import {
  absoluteUrl,
  getGooglePlayUrl,
  getSiteUrl,
  getSupportEmail,
} from '@/lib/site-config';

/**
 * These four getters are the site's entire trust boundary. Everything else on
 * the site renders whatever they return, so a bad value getting past them is
 * the one way this site can end up showing a broken link or a fabricated one.
 */
describe('getSiteUrl', () => {
  test('returns the origin for an absolute https URL', () => {
    // Arrange
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com');

    // Act & Assert
    expect(getSiteUrl()).toBe('https://example.com');
  });

  test('strips a trailing slash so callers can join with a path', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com/');

    expect(absoluteUrl('/privacy')).toBe('https://example.com/privacy');
  });

  test.each([
    ['an http origin', 'http://example.com'],
    ['a relative path', '/privacy'],
    ['a bare hostname', 'example.com'],
    ['an empty value', ''],
  ])('rejects %s', (_label, value) => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', value);

    expect(getSiteUrl()).toBeUndefined();
  });

  test('absoluteUrl returns undefined when the site URL is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');

    expect(absoluteUrl('/privacy')).toBeUndefined();
  });
});

describe('getSupportEmail', () => {
  test('returns a well-formed address', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', 'support@redpanda.example');

    expect(getSupportEmail()).toBe('support@redpanda.example');
  });

  test('trims surrounding whitespace from the environment value', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', '  support@redpanda.example  ');

    expect(getSupportEmail()).toBe('support@redpanda.example');
  });

  test.each([
    ['an unset value', ''],
    ['a value with no @', 'support.redpanda.example'],
    ['a value with no dotted domain', 'support@localhost'],
    ['a value containing a space', 'support @redpanda.example'],
    ['two @ signs', 'a@b@c.example'],
  ])('returns undefined for %s', (_label, value) => {
    vi.stubEnv('NEXT_PUBLIC_SUPPORT_EMAIL', value);

    expect(getSupportEmail()).toBeUndefined();
  });
});

describe('getGooglePlayUrl', () => {
  test('accepts a real Google Play listing URL', () => {
    const listing =
      'https://play.google.com/store/apps/details?id=com.spark.redpanda';
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_PLAY_URL', listing);

    expect(getGooglePlayUrl()).toBe(listing);
  });

  test.each([
    ['an unset value', ''],
    ['a non-Play https URL', 'https://example.com/download'],
    ['a look-alike host', 'https://play.google.com.evil.example/store'],
    ['an http Play URL', 'http://play.google.com/store/apps/details?id=x'],
  ])('returns undefined for %s', (_label, value) => {
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_PLAY_URL', value);

    expect(getGooglePlayUrl()).toBeUndefined();
  });
});
