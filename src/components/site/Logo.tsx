import Link from "next/link";

/**
 * CarSouq mark — a sleek coupe silhouette with an auction gavel resting on the roof.
 * Colours are theme-aware: navy in light mode, azure in dark mode.
 * Intrinsic aspect ratio is 264 × 132 (2:1), so always size it with a wide box.
 */
export function LogoMark({ className = "h-8 w-[4rem]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 264 132"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(0 12)">
        {/* body */}
        <path
          d="M16 74C16 63 22 55 33 51L76 35C88 25 102 18 118 14C136 9 156 8 172 11C188 14 202 21 213 31L235 51C243 58 246 66 245 74C244 82 238 86 230 86L214 86A21 21 0 0 0 172 86L100 86A21 21 0 0 0 58 86L30 86C21 86 16 83 16 74Z"
          fill="var(--color-surface)"
          stroke="var(--color-brand)"
          strokeWidth="9"
          strokeLinejoin="round"
        />
        {/* greenhouse */}
        <path
          d="M92 42L124 20C138 12 156 10 172 13L188 17L208 42Z"
          fill="var(--color-surface-3)"
          stroke="var(--color-brand)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* metallic speed accents */}
        <path d="M40 64L212 57L212 62L66 70Z" fill="var(--color-line-strong)" opacity="0.9" />
        <path d="M56 77L192 71L192 75L80 81Z" fill="var(--color-line-strong)" opacity="0.6" />
        {/* wheels */}
        <circle cx="79" cy="86" r="20" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="9" />
        <circle cx="193" cy="86" r="20" fill="var(--color-surface)" stroke="var(--color-brand)" strokeWidth="9" />
      </g>

      {/* gavel */}
      <g transform="rotate(-18 152 32)" paintOrder="stroke fill">
        <rect
          x="112"
          y="8"
          width="74"
          height="40"
          rx="11"
          fill="var(--color-brand)"
          stroke="var(--color-surface)"
          strokeWidth="9"
        />
        <rect x="141" y="16" width="13" height="24" rx="4" fill="var(--color-line-strong)" />
        <rect
          x="186"
          y="22"
          width="62"
          height="13"
          rx="6.5"
          fill="var(--color-brand)"
          stroke="var(--color-surface)"
          strokeWidth="9"
        />
      </g>
    </svg>
  );
}

const MARK_SIZE = {
  sm: "h-7 w-[3.5rem]",
  md: "h-8 w-[4rem]",
  lg: "h-10 w-[5rem]",
};

const WORD_SIZE = {
  sm: "text-[1.05rem]",
  md: "text-[1.28rem]",
  lg: "text-[1.6rem]",
};

/** Horizontal lockup — mark beside the wordmark. Used in the header. */
export default function Logo({
  href = "/",
  size = "md",
  className = "",
}: {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark
        className={`${MARK_SIZE[size]} shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover/logo:-translate-y-0.5 group-hover/logo:scale-105`}
      />
      <span className={`font-display font-extrabold leading-none tracking-tight text-ink ${WORD_SIZE[size]}`}>
        Car<span className="gradient-text">Souq</span>
      </span>
    </span>
  );

  if (href === null) return inner;

  return (
    <Link href={href} className="group/logo focus-ring inline-flex" aria-label="CarSouq — home">
      {inner}
    </Link>
  );
}

/** Stacked lockup — mark above the wordmark and tagline. Matches the primary brand artwork. */
export function LogoLockup({
  href = "/",
  className = "",
}: {
  href?: string | null;
  className?: string;
}) {
  const inner = (
    <span className={`inline-flex flex-col items-start ${className}`}>
      <LogoMark className="h-[3.4rem] w-[6.8rem] transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover/logo:-translate-y-0.5" />
      <span className="mt-1 font-display text-[1.8rem] font-extrabold leading-none tracking-tight text-ink">
        Car<span className="gradient-text">Souq</span>
      </span>
      <span className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-muted">
        Online Car Auctions
      </span>
    </span>
  );

  if (href === null) return inner;

  return (
    <Link href={href} className="group/logo focus-ring inline-flex" aria-label="CarSouq — home">
      {inner}
    </Link>
  );
}
