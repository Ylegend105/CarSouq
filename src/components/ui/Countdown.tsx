"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

interface Props {
  endsInHours: number;
  variant?: "chip" | "inline" | "large";
  className?: string;
  onEnd?: () => void;
}

export default function Countdown({ endsInHours, variant = "chip", className = "", onEnd }: Props) {
  const { t } = useI18n();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = Date.now() + endsInHours * 3_600_000;
    let fired = false;
    const tick = () => {
      const ms = target - Date.now();
      setRemaining(ms);
      if (ms <= 0 && !fired) {
        fired = true;
        onEnd?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsInHours, onEnd]);

  if (remaining === null) {
    return <span className={`skeleton inline-block h-4 w-24 align-middle ${className}`} aria-hidden />;
  }

  const { ended, urgent, parts } = formatCountdown(remaining);

  if (ended) {
    return <span className={`badge ${variant === "large" ? "text-sm" : ""} ${className}`}>{t("common.ended")}</span>;
  }

  const seg = (n: number, unit: string) => (
    <span className="tabular-nums">
      {String(n).padStart(2, "0")}
      <span className="text-[0.7em] opacity-60">{unit}</span>
    </span>
  );

  const content = (
    <span dir="ltr" className="inline-flex items-center gap-1 tabular-nums">
      {parts.d > 0 && <>{seg(parts.d, t("common.days"))} </>}
      {seg(parts.h, t("common.hours"))} {seg(parts.m, t("common.minutes"))}
      {parts.d === 0 && <> {seg(parts.s, t("common.seconds"))}</>}
    </span>
  );

  if (variant === "large") {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold ${urgent ? "text-danger" : "text-ink"} ${className}`}>
        {urgent && <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-danger" />}
        {content}
      </span>
    );
  }

  if (variant === "inline") {
    return <span className={`font-medium ${urgent ? "text-danger" : ""} ${className}`}>{content}</span>;
  }

  return (
    <span
      className={`badge backdrop-blur ${urgent ? "badge-live" : "bg-surface/85"} ${className}`}
      title={t("common.timeLeft")}
    >
      {urgent && <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />}
      {content}
    </span>
  );
}
