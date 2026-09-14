import { USD_TO_LBP } from "./data";
import type { Currency, Locale } from "./types";

const LOCALE_TAG: Record<Locale, string> = {
  en: "en-LB",
  ar: "ar-LB",
  fr: "fr-LB",
};

export function formatMoney(
  usd: number,
  currency: Currency,
  locale: Locale = "en",
  opts: { compact?: boolean } = {},
): string {
  const value = currency === "USD" ? usd : Math.round(usd * USD_TO_LBP);
  const tag = LOCALE_TAG[locale] ?? "en-LB";
  if (opts.compact && Math.abs(value) >= 1000) {
    const nf = new Intl.NumberFormat(tag, {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return currency === "USD" ? `$${nf.format(value)}` : `${nf.format(value)} LBP`;
  }
  const nf = new Intl.NumberFormat(tag, { maximumFractionDigits: 0 });
  return currency === "USD" ? `$${nf.format(value)}` : `${nf.format(value)} LBP`;
}

export function formatNumber(n: number, locale: Locale = "en"): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale] ?? "en-LB").format(n);
}

export function formatKm(km: number, locale: Locale = "en"): string {
  return `${formatNumber(km, locale)} km`;
}

/** Human countdown from a millisecond delta. */
export function formatCountdown(ms: number): {
  ended: boolean;
  urgent: boolean;
  parts: { d: number; h: number; m: number; s: number };
} {
  const ended = ms <= 0;
  const clamped = Math.max(0, ms);
  const s = Math.floor(clamped / 1000);
  return {
    ended,
    urgent: !ended && clamped < 60 * 60 * 1000,
    parts: {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    },
  };
}

export function relativeTime(minutesAgo: number, locale: Locale = "en"): string {
  const rtf = new Intl.RelativeTimeFormat(LOCALE_TAG[locale] ?? "en", {
    numeric: "auto",
  });
  if (minutesAgo < 60) return rtf.format(-Math.round(minutesAgo), "minute");
  if (minutesAgo < 60 * 24) return rtf.format(-Math.round(minutesAgo / 60), "hour");
  return rtf.format(-Math.round(minutesAgo / (60 * 24)), "day");
}

/** Minimum next bid increment based on current price (USD). */
export function bidIncrement(current: number): number {
  if (current < 5000) return 100;
  if (current < 15000) return 250;
  if (current < 30000) return 500;
  if (current < 60000) return 1000;
  return 2000;
}

export function minNextBid(current: number): number {
  return current + bidIncrement(current);
}

export interface FeeBreakdown {
  hammer: number;
  premium: number;
  documentation: number;
  transfer: number;
  total: number;
}

export function computeFees(hammer: number, includeTransfer = true): FeeBreakdown {
  const premium = Math.min(1800, Math.max(300, Math.round(hammer * 0.045)));
  const documentation = 150;
  const transfer = includeTransfer ? 220 : 0;
  return {
    hammer,
    premium,
    documentation,
    transfer,
    total: hammer + premium + documentation + transfer,
  };
}
