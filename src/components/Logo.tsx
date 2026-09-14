import type { SVGProps } from 'react';

interface LogoIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Minimal, abstract circular mark for CatHouse — two rounded "cat ear" tips
 * sitting above a single continuous S-shaped swoosh, inscribed in a circle.
 * Colors are wired through Tailwind's `currentColor` trick (via `stopColor`)
 * so the gradient — and the light/dark variants — are pure Tailwind classes,
 * no inline styles or JS color logic required.
 */
export function LogoIcon({ className = 'h-8 w-8', ...props }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="CatHouse"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="chLogoGradient" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" className="text-indigo-500 dark:text-indigo-400" />
          <stop offset="100%" stopColor="currentColor" className="text-violet-600 dark:text-violet-500" />
        </linearGradient>
      </defs>

      {/* Badge */}
      <circle cx="20" cy="20" r="19" fill="url(#chLogoGradient)" />
      <circle
        cx="20"
        cy="20"
        r="18.5"
        fill="none"
        strokeWidth="1"
        className="stroke-black/10 dark:stroke-white/10"
      />

      {/* Cat ears */}
      <path
        d="M11.5 15.5 Q9 7 15.5 10.5 Q17.5 12.5 15.5 16.5 Z"
        className="fill-white dark:fill-slate-50"
      />
      <path
        d="M28.5 15.5 Q31 7 24.5 10.5 Q22.5 12.5 24.5 16.5 Z"
        className="fill-white dark:fill-slate-50"
      />

      {/* Abstract "S" swoosh doubling as a cat silhouette */}
      <path
        d="M25 13c0-3-6-4-10-1s-2 8 2 8 8 3 4 6-10 1-10-2"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white dark:stroke-slate-50"
      />
    </svg>
  );
}

interface LogoProps {
  /** Extra classes on the wrapping <span>. */
  className?: string;
  /** Classes for the icon itself, controls size (defaults to h-8 w-8). */
  iconClassName?: string;
  /** Classes for the wordmark text. */
  textClassName?: string;
  /** Wordmark text. Defaults to "CatHouse". */
  text?: string;
  /** Set to false to render the icon only (e.g. compact/mobile nav). */
  showText?: boolean;
}

/**
 * `<Logo />` — icon + wordmark, ready to drop inside a `<Link>`.
 * Text color uses the project's `text-text-base` design-system token
 * (see tailwind.config.ts / globals.css) so it tracks the site's dynamic
 * theme; the icon separately adapts with its own Tailwind `dark:` classes.
 */
export default function Logo({
  className = '',
  iconClassName = 'h-8 w-8',
  textClassName = '',
  text = 'CatHouse',
  showText = true,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoIcon className={iconClassName} />
      {showText && (
        <span
          className={`font-sans text-lg font-bold tracking-tight text-text-base ${textClassName}`}
        >
          {text}
        </span>
      )}
    </span>
  );
}
