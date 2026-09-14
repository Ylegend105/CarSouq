"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { IconGlobe, IconChevronDown, IconCheck } from "@/components/ui/icons";
import type { Currency } from "@/lib/types";

const CURRENCIES: { code: Currency; label: string; sub: string }[] = [
  { code: "USD", label: "USD", sub: "US Dollar" },
  { code: "LBP", label: "LBP", sub: "ليرة لبنانية" },
];

export default function LocaleCurrencyMenu({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const { currency, setCurrency } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = LOCALES.find((l) => l.code === locale)!;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink-soft transition-all duration-300 hover:border-brand-2/50 hover:text-brand-2 focus-ring"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IconGlobe className="h-4 w-4" />
        {!compact && (
          <bdi dir="ltr" className="whitespace-nowrap tabular">
            {current.short} · {currency}
          </bdi>
        )}
        <IconChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="panel animate-scale-in absolute end-0 z-50 mt-2 w-60 p-3 shadow-[var(--shadow-lift)]"
        >
          <p className="label mb-2 !mb-1.5">{t("lang.label")}</p>
          <div className="grid gap-0.5">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={`flex items-center justify-between rounded-[var(--radius-xs)] px-2.5 py-2 text-sm transition-colors duration-200 ${
                  l.code === locale
                    ? "bg-brand-2/10 font-semibold text-brand-2"
                    : "text-ink-soft hover:bg-surface-2"
                }`}
                role="menuitemradio"
                aria-checked={l.code === locale}
              >
                <span className="flex items-center gap-2">
                  <span className="w-7 text-[0.65rem] font-bold uppercase tracking-wider text-muted">{l.short}</span>
                  {l.native}
                </span>
                {l.code === locale && <IconCheck className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>

          <div className="my-3 h-px bg-line" />

          <p className="label mb-1.5">{t("currency.label")}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                }}
                className={`rounded-[var(--radius-xs)] border px-2 py-2 text-start transition-all duration-200 ${
                  c.code === currency
                    ? "border-brand-2/50 bg-brand-2/10 text-brand-2"
                    : "border-line-strong text-ink-soft hover:bg-surface-2"
                }`}
                aria-pressed={c.code === currency}
              >
                <span className="block text-sm font-bold">{c.label}</span>
                <span className="block text-[0.65rem] text-muted">{c.sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
