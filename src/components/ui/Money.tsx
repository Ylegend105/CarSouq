"use client";

import { formatMoney } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

/**
 * Renders a USD amount in the viewer's selected currency + locale.
 * Server and first client paint use defaults (USD / en); the value
 * updates after hydration if a stored preference differs.
 */
export default function Money({
  usd,
  compact = false,
  className = "",
}: {
  usd: number;
  compact?: boolean;
  className?: string;
}) {
  const { locale } = useI18n();
  const { currency } = useStore();
  return (
    <span className={className} suppressHydrationWarning>
      {formatMoney(usd, currency, locale, { compact })}
    </span>
  );
}
