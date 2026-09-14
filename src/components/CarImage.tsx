import type { BodyType } from "@/lib/types";

interface Props {
  from: string;
  to: string;
  bodyType?: BodyType;
  seed?: number;
  label?: string;
  className?: string;
}

/** Body-specific silhouettes, drawn on a 400 × 220 canvas. */
const SHAPES: Record<string, { body: string; glass: string; wheels: [number, number]; r: number }> = {
  SUV: {
    body: "M52 150c-8-4-12-14-10-24l4-18c2-10 9-17 19-20l38-11 30-25c9-8 21-12 33-12h62c13 0 25 5 34 14l26 26 36 10c11 3 18 11 19 22l1 14c1 10-6 18-16 18h-19a30 30 0 0 0-60 0h-90a30 30 0 0 0-60 0Z",
    glass: "M112 84 141 60c6-5 13-8 21-8h54c8 0 16 3 22 9l24 23Z",
    wheels: [130, 262],
    r: 29,
  },
  Pickup: {
    body: "M40 150c-8-4-12-14-10-24l4-16c2-10 9-17 19-20l34-10 26-22c8-7 18-11 29-11h52c12 0 20 8 20 20v40h122c10 0 17 7 17 17v14c0 8-6 12-14 12h-14a30 30 0 0 0-60 0h-86a30 30 0 0 0-60 0Z",
    glass: "M104 82 128 60c5-5 12-8 19-8h44c6 0 10 4 10 10v20Z",
    wheels: [118, 274],
    r: 29,
  },
  Van: {
    body: "M44 150c-9-3-14-13-12-24l6-30c2-12 10-21 22-24l40-10 22-16c8-6 17-9 27-9h84c14 0 25 11 25 25v70c0 8-5 14-13 14h-16a30 30 0 0 0-60 0h-84a30 30 0 0 0-60 0Z",
    glass: "M110 80 132 62c5-4 11-6 17-6h48v24Z",
    wheels: [124, 258],
    r: 29,
  },
  Coupe: {
    body: "M48 148c-10-4-16-14-14-25l3-15c2-11 10-19 21-22l52-15 40-24c12-7 26-11 40-11h34c17 0 33 6 46 17l34 30 27 9c11 4 17 13 17 24v11c0 9-6 15-15 15h-22a29 29 0 0 0-58 0h-84a29 29 0 0 0-58 0Z",
    glass: "M138 82 178 58c8-5 17-7 26-7h24c10 0 20 4 28 11l24 20Z",
    wheels: [134, 272],
    r: 28,
  },
  Convertible: {
    body: "M48 148c-10-4-16-14-14-25l3-15c2-11 10-19 21-22l52-15 40-20c12-6 26-9 40-9h34c17 0 33 6 46 17l34 30 27 9c11 4 17 13 17 24v11c0 9-6 15-15 15h-22a29 29 0 0 0-58 0h-84a29 29 0 0 0-58 0Z",
    glass: "M146 76 182 60c8-4 16-6 24-6h26l6 22Z",
    wheels: [134, 272],
    r: 28,
  },
  Hatchback: {
    body: "M52 150c-10-4-15-14-13-24l3-15c2-11 10-19 21-22l46-13 36-26c10-7 21-10 33-10h48c14 0 27 5 37 15l40 40 22 7c10 3 16 12 16 22v10c0 9-6 14-15 14h-20a29 29 0 0 0-58 0h-88a29 29 0 0 0-58 0Z",
    glass: "M126 84 158 60c7-5 15-8 24-8h44c8 0 16 3 22 9l26 23Z",
    wheels: [130, 266],
    r: 28,
  },
  Sedan: {
    body: "M46 148c-10-4-16-14-14-25l3-14c2-11 10-19 21-22l54-15 42-22c11-6 23-9 35-9h40c16 0 31 6 43 17l32 29 26 8c11 4 18 13 18 24v11c0 9-6 15-15 15h-21a29 29 0 0 0-58 0h-86a29 29 0 0 0-58 0Z",
    glass: "M136 82 172 58c8-5 17-8 26-8h32c10 0 19 4 27 11l23 21Z",
    wheels: [132, 270],
    r: 28,
  },
};

/**
 * Studio-style vehicle visual — theme-aware, dependency-free, no network requests.
 * The silhouette varies by body type; the palette comes from the listing's accent pair.
 */
export default function CarImage({
  from,
  to,
  bodyType = "Sedan",
  seed = 1,
  label,
  className = "",
}: Props) {
  const shape = SHAPES[bodyType] ?? SHAPES.Sedan;
  const uid = `${seed}-${bodyType.replace(/\s/g, "")}`;
  const angle = 96 + (seed % 6) * 14;

  return (
    <div
      className={`relative overflow-hidden bg-surface-2 ${className}`}
      role="img"
      aria-label={label ?? `${bodyType} photograph`}
    >
      <svg viewBox="0 0 400 220" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`bg-${uid}`} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
            <stop offset="0%" stopColor={from} stopOpacity="0.28" />
            <stop offset="55%" stopColor={to} stopOpacity="0.16" />
            <stop offset="100%" stopColor={to} stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor={to} />
            <stop offset="55%" stopColor={from} />
            <stop offset="100%" stopColor={from} stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id={`spot-${uid}`} cx="0.5" cy="0.15" r="0.75">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* studio backdrop */}
        <rect width="400" height="220" fill={`url(#bg-${uid})`} />
        <rect width="400" height="220" fill={`url(#spot-${uid})`} opacity="0.55" />

        {/* floor shadow */}
        <ellipse cx="200" cy="176" rx="152" ry="16" fill={from} opacity="0.18" />
        <ellipse cx="200" cy="172" rx="108" ry="9" fill={from} opacity="0.22" />

        <g transform="translate(0 6)">
          {/* body */}
          <path d={shape.body} fill={`url(#body-${uid})`} />
          {/* glass */}
          <path d={shape.glass} fill={`url(#glass-${uid})`} />
          {/* belt-line highlight */}
          <path
            d="M60 122c90-12 190-12 282 0"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M76 138c80-8 168-8 246 0"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.16"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* wheels */}
          {shape.wheels.map((cx, i) => (
            <g key={i}>
              <circle cx={cx} cy="150" r={shape.r} fill="#10151d" />
              <circle cx={cx} cy="150" r={shape.r * 0.5} fill="#e8ecf2" />
              <circle cx={cx} cy="150" r={shape.r * 0.2} fill="#98a4b4" />
            </g>
          ))}
          {/* lights */}
          <rect x="340" y="118" width="16" height="10" rx="4" fill="#fffbe8" opacity="0.95" />
          <rect x="42" y="120" width="11" height="9" rx="4" fill="#ffd9d9" opacity="0.9" />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/5" />
    </div>
  );
}
