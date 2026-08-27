import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, test } from 'vitest';

import { PRIVACY_DOCUMENTS } from '@/lib/privacy-content';

const REPO_ROOT = join(import.meta.dirname, '..', '..');

/**
 * Every file that becomes part of the published site, plus the config that
 * shapes it. The test directory itself is excluded: these files quote the very
 * strings the scan below looks for, and a scanner that flags its own rules
 * would be useless.
 */
function collectShippedFiles(): readonly string[] {
  const roots = [join(REPO_ROOT, 'src'), join(REPO_ROOT, 'public')];
  const files: string[] = [join(REPO_ROOT, 'next.config.ts')];

  const walk = (directory: string) => {
    for (const entry of readdirSync(directory)) {
      const path = join(directory, entry);

      if (statSync(path).isDirectory()) {
        if (entry !== '__tests__') {
          walk(path);
        }
        continue;
      }

      files.push(path);
    }
  };

  for (const root of roots) {
    walk(root);
  }

  return files;
}

const SHIPPED_FILES = collectShippedFiles();

function readShipped(path: string): string {
  return readFileSync(join(REPO_ROOT, path), 'utf8');
}

describe('app-ads.txt', () => {
  const appAdsTxt = readShipped('public/app-ads.txt');

  test('exists and is served from the site root', () => {
    expect(appAdsTxt.length).toBeGreaterThan(0);
  });

  test('declares no publisher id, real or invented', () => {
    // The record format is `<domain>, <publisher id>, DIRECT|RESELLER, <cert>`.
    // Any `pub-` token at all would be a claim about who may sell this app's
    // inventory — and Red Panda has no AdMob account yet, so every such claim
    // would be false, including a `pub-XXXXXXXXXXXXXXXX` shaped placeholder.
    expect(appAdsTxt).not.toMatch(/pub-[0-9X]{10,}/i);
    expect(appAdsTxt).not.toMatch(/\bDIRECT\b/);
    expect(appAdsTxt).not.toMatch(/\bRESELLER\b/);
  });

  test('contains only comments, so a crawler reads zero authorized sellers', () => {
    const meaningfulLines = appAdsTxt
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    expect(meaningfulLines.length).toBeGreaterThan(0);
    for (const line of meaningfulLines) {
      expect(line.startsWith('#'), `not a comment: ${line}`).toBe(true);
    }
  });

  test('tells the owner where the real line comes from', () => {
    expect(appAdsTxt).toContain('AdMob');
    expect(appAdsTxt).toContain('docs/ADMOB_APP_ADS_SETUP.md');
  });
});

describe('no development or internal address is shipped', () => {
  /**
   * The mobile repository documents this exact failure happening to it: a
   * release bundle that silently carried a stale LAN backend host because the
   * bundler cache had not been cleared. This site has no backend and no excuse
   * for carrying one, so the scan is absolute rather than advisory.
   */
  const FORBIDDEN_SUBSTRINGS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '10.0.2.2',
    '192.168.',
    '.local:',
    'http://',
    'ngrok',
  ];

  /**
   * The one permitted `http://`: the SVG XML namespace. It is an identifier the
   * format requires verbatim, not an address — nothing ever dereferences it,
   * and rewriting it to https would make the file invalid.
   */
  const XML_NAMESPACE = 'http://www.w3.org/';

  test.each(FORBIDDEN_SUBSTRINGS)('no shipped file contains %s', (needle) => {
    const offenders = SHIPPED_FILES.filter((path) =>
      readFileSync(path, 'utf8').replaceAll(XML_NAMESPACE, '').includes(needle),
    ).map((path) => relative(REPO_ROOT, path));

    expect(offenders).toEqual([]);
  });

  test('no Google Play URL is hardcoded anywhere', () => {
    // The only Play listing this site may ever link to is the one supplied at
    // build time through NEXT_PUBLIC_GOOGLE_PLAY_URL. A literal one in source
    // would be a guess.
    const offenders = SHIPPED_FILES.filter((path) =>
      /https:\/\/play\.google\.com/.test(readFileSync(path, 'utf8')),
    ).map((path) => relative(REPO_ROOT, path));

    expect(offenders).toEqual([]);
  });

  test('no backend API origin is referenced', () => {
    // This website must keep working when the Red Panda API is down, which it
    // does by never calling it. A fetch to an api host would break that.
    const offenders = SHIPPED_FILES.filter((path) => {
      const source = readFileSync(path, 'utf8');

      return /https:\/\/(api|stream)\./.test(source) || /\bfetch\(/.test(source);
    }).map((path) => relative(REPO_ROOT, path));

    expect(offenders).toEqual([]);
  });
});

describe('environment configuration', () => {
  const envExample = readShipped('.env.example');

  test('documents exactly the three public variables the site reads', () => {
    const declared = envExample
      .split('\n')
      .filter((line) => /^[A-Z_]+=/.test(line))
      .map((line) => line.split('=')[0]);

    expect(declared).toEqual([
      'NEXT_PUBLIC_SITE_URL',
      'NEXT_PUBLIC_SUPPORT_EMAIL',
      'NEXT_PUBLIC_GOOGLE_PLAY_URL',
    ]);
  });

  test('ships no value for any of them', () => {
    // A committed example value is how a placeholder domain or a stranger's
    // email address reaches production.
    for (const line of envExample.split('\n')) {
      if (/^[A-Z_]+=/.test(line)) {
        expect(line, `${line} must have an empty value`).toMatch(/=$/);
      }
    }
  });

  test('declares no variable that could hold a secret', () => {
    for (const cue of ['SECRET', 'TOKEN', 'PASSWORD', 'PRIVATE_KEY', 'API_KEY']) {
      expect(envExample).not.toContain(`${cue}=`);
    }
  });
});

describe('privacy policy structure', () => {
  test('ships an English and an Indonesian document', () => {
    expect(PRIVACY_DOCUMENTS.map((document) => document.locale)).toEqual([
      'en',
      'id',
    ]);
  });

  test('both languages carry the same sections in the same order', () => {
    // Without this, a section could be added to one language and silently
    // missing from the other — which for a legal document means an Indonesian
    // reader is shown a different policy from an English one.
    const [english, indonesian] = PRIVACY_DOCUMENTS;

    expect(indonesian.sections.map((section) => section.id)).toEqual(
      english.sections.map((section) => section.id),
    );
  });

  test('every section has a title and at least one block of content', () => {
    for (const document of PRIVACY_DOCUMENTS) {
      for (const section of document.sections) {
        expect(section.title.length, `${document.locale}/${section.id}`).toBeGreaterThan(0);
        expect(section.blocks.length, `${document.locale}/${section.id}`).toBeGreaterThan(0);
      }
    }
  });

  test('covers every category the app actually has', () => {
    const required = [
      'information-you-provide',
      'activity',
      'advertising',
      'technical',
      'on-device',
      'sharing',
      'retention',
      'deletion',
      'children',
      'security',
      'changes',
      'contact',
    ];

    for (const document of PRIVACY_DOCUMENTS) {
      const ids = document.sections.map((section) => section.id);

      for (const id of required) {
        expect(ids, `${document.locale} is missing "${id}"`).toContain(id);
      }
    }
  });
});
