'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';

import {
  LINK_TOKENS,
  PRIVACY_DOCUMENTS,
  type PolicyBlock,
  type PolicyDocument,
} from '@/lib/privacy-content';

/**
 * Renders one line of policy copy, turning any `[[token]]` into a real link.
 *
 * A split on the token pattern, not `dangerouslySetInnerHTML`: the copy stays
 * plain strings that a test can assert on, and no markup from the content
 * module can ever reach the DOM unparsed.
 */
function PolicyText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[a-z-]+\]\])/);

  return (
    <>
      {parts.map((part, index) => {
        const href = LINK_TOKENS[part as keyof typeof LINK_TOKENS];

        if (!href) {
          return <Fragment key={index}>{part}</Fragment>;
        }

        return (
          <Link
            className="rounded-sm font-medium text-ember-soft underline decoration-ember-soft/40 underline-offset-4 transition-colors duration-150 hover:decoration-ember-soft"
            href={href}
            key={index}
          >
            {href === '/delete-account' ? 'Delete Account' : 'Support'}
          </Link>
        );
      })}
    </>
  );
}

function PolicyBlocks({ blocks }: { blocks: readonly PolicyBlock[] }) {
  return (
    <>
      {blocks.map((block, index) =>
        block.kind === 'paragraph' ? (
          <p key={index}>
            <PolicyText text={block.text} />
          </p>
        ) : (
          <ul className="space-y-2.5 pl-1" key={index}>
            {block.items.map((item) => (
              <li className="flex gap-3" key={item}>
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] size-1 shrink-0 rounded-full bg-line-strong"
                />
                <span>
                  <PolicyText text={item} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

function PolicyBody({ document }: { document: PolicyDocument }) {
  return (
    <div lang={document.locale}>
      <p className="text-sm text-ink-dim">{document.lastUpdatedLabel}</p>
      <p className="mt-4 text-base/7 text-ink-muted text-pretty">{document.intro}</p>

      {document.sections.map((section) => (
        <section
          aria-labelledby={`${document.locale}-${section.id}`}
          className="mt-10"
          key={section.id}
        >
          <h2
            className="text-xl font-semibold tracking-tight text-ink"
            id={`${document.locale}-${section.id}`}
          >
            {section.title}
          </h2>
          <div className="mt-3 space-y-3 text-base/7 text-ink-muted">
            <PolicyBlocks blocks={section.blocks} />
          </div>
        </section>
      ))}
    </div>
  );
}

/**
 * The Privacy Policy, with its English/Indonesian switch.
 *
 * The only interactive element on the page, and the reason this one component
 * is a client component while the rest of the site is not. Indonesian is the
 * Red Panda app's own default language, so an Indonesian reader is the typical
 * reader here — not an afterthought — and the switch has to be visible without
 * scrolling.
 *
 * Both documents live in the same statically-rendered HTML; the switch only
 * chooses which one is shown. `lang` moves with it, so a screen reader
 * pronounces each language correctly.
 */
export function PrivacyPolicyDocument() {
  const [locale, setLocale] = useState<PolicyDocument['locale']>('en');
  const active =
    PRIVACY_DOCUMENTS.find((document) => document.locale === locale) ??
    PRIVACY_DOCUMENTS[0];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {active.title}
      </h1>

      <div
        aria-label="Policy language"
        className="mt-6 inline-flex rounded-full border border-line bg-surface p-1"
        role="group"
      >
        {PRIVACY_DOCUMENTS.map((document) => {
          const isActive = document.locale === active.locale;

          return (
            <button
              aria-pressed={isActive}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-surface-raised text-ink'
                  : 'text-ink-muted hover:text-ink'
              }`}
              key={document.locale}
              lang={document.locale}
              onClick={() => setLocale(document.locale)}
              type="button"
            >
              {document.label}
            </button>
          );
        })}
      </div>

      <hr className="rule-fade my-10" />

      <PolicyBody document={active} />
    </div>
  );
}
