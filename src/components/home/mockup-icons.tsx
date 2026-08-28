import type { ReactNode } from 'react';

/**
 * The line icons the device mockups draw.
 *
 * Inline SVG rather than an icon package: five glyphs do not justify a runtime
 * dependency, and a static export should not ship a font just to draw a tab
 * bar. Each one is a 24-unit grid stroked with `currentColor`, so a tab turns
 * ember by changing text colour and nothing else.
 *
 * These are illustrations inside an `aria-hidden` phone frame, so none of them
 * carries a title or a role — a screen reader walking a fake tab bar would be
 * reading furniture rather than information.
 */

interface IconProps {
  readonly className?: string;
}

function Glyph({
  children,
  className = '',
}: IconProps & { readonly children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </Glyph>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </Glyph>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M3.5 11.5h17V20h-17z" />
      <path d="M2.5 7.5h19v4h-19zM12 7.5V20" />
      <path d="M12 7.5S10.5 4 8.5 4a2 2 0 0 0 0 3.5zM12 7.5S13.5 4 15.5 4a2 2 0 0 1 0 3.5z" />
    </Glyph>
  );
}

export function BookmarkIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" />
    </Glyph>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </Glyph>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Glyph>
  );
}

/** The streak chip's flame. Filled, not stroked — it reads as a badge. */
export function FlameIcon({ className = '' }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12.5 2c.6 3 2.3 4.2 3.9 6 1.5 1.7 2.6 3.4 2.6 5.7A7 7 0 0 1 5 13.7c0-2.4 1-3.9 2.4-5.4.4 1 1 1.7 1.8 2 .3-3.4 1.6-6.4 3.3-8.3" />
    </svg>
  );
}
