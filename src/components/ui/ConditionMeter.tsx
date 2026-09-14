export default function ConditionMeter({
  score,
  size = "sm",
  showLabel = true,
}: {
  score: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}) {
  const color =
    score >= 88
      ? "var(--color-success)"
      : score >= 78
        ? "var(--color-brand-2)"
        : score >= 70
          ? "var(--color-warning)"
          : "var(--color-danger)";
  const dim = size === "md" ? 46 : 36;
  const stroke = size === "md" ? 4 : 3.5;
  const r = (dim - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <span className="inline-flex shrink-0 items-center gap-2" title={`Condition ${score}/100`}>
      <span className="relative inline-grid place-items-center" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={stroke} />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - score / 100)}
            style={{ transition: "stroke-dashoffset 1.1s var(--ease-out-expo)" }}
          />
        </svg>
        <span
          className={`absolute font-bold tabular ${size === "md" ? "text-xs" : "text-[0.65rem]"}`}
          style={{ color }}
        >
          {score}
        </span>
      </span>
      {showLabel && (
        <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted">Condition</span>
      )}
    </span>
  );
}
