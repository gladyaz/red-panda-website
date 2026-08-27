import type { ReactNode } from 'react';

/**
 * A CSS device frame.
 *
 * Deliberately not a stock iPhone photograph: a real handset image would put
 * another company's industrial design on this page, and the render would date
 * the site the moment the hardware changes. This is a rounded rectangle, a
 * hairline bezel and a speaker pill — enough for a visitor to read "phone"
 * instantly, and nothing more. No 3D transform, no perspective tilt, no
 * reflection.
 *
 * The frame is `aria-hidden` and every mockup inside it carries a visible
 * caption instead. What is inside is an illustration of the Red Panda app, not
 * a screenshot, and a screen reader walking a fake UI tree would be reading out
 * furniture rather than information.
 */
export function PhoneFrame({
  children,
  caption,
  className = '',
}: {
  children: ReactNode;
  /** Stated plainly beneath the frame, so nothing here reads as a screenshot. */
  caption: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        aria-hidden="true"
        className="relative mx-auto w-full max-w-[16.5rem] rounded-[2.25rem] border border-line-strong bg-canvas-raised p-2 shadow-[0_2rem_4rem_-1.5rem_rgb(0_0_0/0.9)] sm:max-w-[17.5rem]"
      >
        {/* Speaker pill. The one piece of hardware detail the frame needs. */}
        <div className="absolute top-3.5 left-1/2 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-line" />

        <div className="aspect-[9/19] overflow-hidden rounded-[1.75rem] bg-canvas">
          {children}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-dim">{caption}</p>
    </div>
  );
}
