"use client";

import { useState } from "react";
import { MAKES, BODY_TYPES } from "@/lib/data";
import { listingAssistant, type ListingSuggestion } from "@/lib/ai";
import { useI18n } from "@/lib/i18n";
import Money from "@/components/ui/Money";
import { IconSparkles, IconCheck, IconCar } from "@/components/ui/icons";

export default function ListingAssistant() {
  const { t } = useI18n();
  const [form, setForm] = useState({
    make: "Toyota",
    model: "Land Cruiser Prado",
    year: 2019,
    mileageKm: 90000,
    condition: 85,
    bodyType: "SUV",
  });
  const [result, setResult] = useState<ListingSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(listingAssistant(form));
      setLoading(false);
    }, 800);
  };

  const upd = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="panel p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white">
            <IconCar className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink">{t("sell.assistantTitle")}</h3>
            <p className="text-xs text-muted">{t("sell.assistantSubtitle")}</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t("common.make")}</label>
              <select className="select" value={form.make} onChange={(e) => upd("make", e.target.value)}>
                {[...new Set([form.make, ...MAKES])].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">{t("common.model")}</label>
              <input className="input" value={form.model} onChange={(e) => upd("model", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t("common.year")}</label>
              <input
                type="number"
                className="input"
                value={form.year}
                min={1990}
                max={2026}
                onChange={(e) => upd("year", +e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t("common.bodyType")}</label>
              <select className="select" value={form.bodyType} onChange={(e) => upd("bodyType", e.target.value)}>
                {BODY_TYPES.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">{t("common.mileage")} — {form.mileageKm.toLocaleString()} km</label>
            <input
              type="range"
              min={0}
              max={250000}
              step={5000}
              value={form.mileageKm}
              onChange={(e) => upd("mileageKm", +e.target.value)}
              className="w-full accent-[var(--color-brand-2)]"
            />
          </div>
          <div>
            <label className="label">{t("common.conditionScore")} — {form.condition}/100</label>
            <input
              type="range"
              min={50}
              max={98}
              value={form.condition}
              onChange={(e) => upd("condition", +e.target.value)}
              className="w-full accent-[var(--color-brand-2)]"
            />
          </div>
          <button onClick={generate} disabled={loading} className="btn btn-primary w-full">
            <IconSparkles className="h-4 w-4" />
            {loading ? t("ai.thinking") : t("sell.generate")}
          </button>
        </div>
      </div>

      <div className="panel p-6">
        {!result && !loading && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted">
            <IconSparkles className="h-8 w-8 text-line-strong" />
            Fill in the details and generate a full listing draft, pricing strategy and photo plan.
          </div>
        )}
        {loading && (
          <div className="space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
            <div className="skeleton h-20 w-full" />
          </div>
        )}
        {result && (
          <div className="space-y-5 text-sm">
            <div>
              <p className="eyebrow">{t("sell.suggestedTitle")}</p>
              <p className="mt-1 font-semibold text-ink">{result.title}</p>
            </div>
            <div>
              <p className="eyebrow">{t("sell.suggestedDescription")}</p>
              <p className="mt-1 leading-relaxed text-ink-soft">{result.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-xs)] bg-surface-2 p-3">
                <p className="text-xs text-muted">{t("sell.suggestedReserve")}</p>
                <p className="text-lg font-semibold text-ink"><Money usd={result.recommendedReserve} /></p>
                <p className="text-[11px] text-muted">
                  range <Money usd={result.reserveLow} compact />–<Money usd={result.reserveHigh} compact />
                </p>
              </div>
              <div className="rounded-[var(--radius-xs)] bg-surface-2 p-3">
                <p className="text-xs text-muted">{t("sell.expectedInterest")}</p>
                <p className="text-lg font-semibold text-ink">{result.expectedInterest}</p>
                <p className="text-[11px] text-muted">{result.expectedBidders}</p>
              </div>
            </div>
            <p className="rounded-[var(--radius-xs)] bg-brand-2/8 px-3 py-2 text-xs text-ink-soft">{result.demandNote}</p>
            <div>
              <p className="eyebrow">{t("sell.photoChecklist")}</p>
              <ul className="mt-2 space-y-1.5">
                {result.photoChecklist.map((p) => (
                  <li key={p} className="flex gap-2 text-xs text-ink-soft">
                    <IconCheck className="h-3.5 w-3.5 shrink-0 text-success" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
