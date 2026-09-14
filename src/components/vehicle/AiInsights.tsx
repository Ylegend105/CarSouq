"use client";

import { useState } from "react";
import type { Vehicle } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { dealScore, marketValue, recommendations } from "@/lib/ai";
import Money from "@/components/ui/Money";
import CarImage from "@/components/CarImage";
import Link from "next/link";
import { IconSparkles, IconChevronDown, IconTrendingUp } from "@/components/ui/icons";

export function MarketValueCard({ vehicle: v, currentBid }: { vehicle: Vehicle; currentBid: number }) {
  const { t } = useI18n();
  const mv = marketValue(v);
  const span = mv.high - mv.low;
  const pos = Math.min(100, Math.max(0, ((currentBid - mv.low) / span) * 100));

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2">
        <IconSparkles className="h-4 w-4 text-brand-2" />
        <h3 className="text-sm font-bold text-ink">{t("ai.marketValue")}</h3>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted">{t("ai.marketValueRange")}</p>
          <p className="font-display text-xl font-extrabold text-ink">
            <Money usd={mv.low} /> – <Money usd={mv.high} />
          </p>
        </div>
        <span className="badge badge-brand">{t("ai.confidence")}: {mv.confidence}</span>
      </div>

      <div className="mt-4">
        <div className="relative h-2 rounded-full bg-gradient-to-r from-success/40 via-warning/40 to-danger/40">
          <span
            className="absolute -top-1 h-4 w-1 -translate-x-1/2 rounded-full bg-ink"
            style={{ insetInlineStart: `${pos}%` }}
            title="Current bid position"
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span><Money usd={mv.low} compact /></span>
          <span className="font-semibold text-ink">Current bid <Money usd={currentBid} compact /></span>
          <span><Money usd={mv.high} compact /></span>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {mv.drivers.map((d, i) => (
          <li key={i} className="flex gap-2 text-xs text-ink-soft">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-2" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DealScoreCard({ vehicle: v }: { vehicle: Vehicle }) {
  const { t } = useI18n();
  const ds = dealScore(v);
  const [open, setOpen] = useState(false);
  const color =
    ds.score >= 82
      ? "var(--color-success)"
      : ds.score >= 70
        ? "var(--color-brand-2)"
        : ds.score >= 55
          ? "var(--color-warning)"
          : "var(--color-danger)";
  const r = 34;
  const c = 2 * Math.PI * r;

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2">
        <IconTrendingUp className="h-4 w-4 text-brand-2" />
        <h3 className="text-sm font-bold text-ink">{t("ai.dealScore")}</h3>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="relative grid h-[84px] w-[84px] shrink-0 place-items-center">
          <svg width="84" height="84" className="-rotate-90">
            <circle cx="42" cy="42" r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth="7" />
            <circle
              cx="42"
              cy="42"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - ds.score / 100)}
            />
          </svg>
          <span className="absolute font-display text-xl font-extrabold text-ink">{ds.score}</span>
        </span>
        <div>
          <p className="text-sm font-bold" style={{ color }}>{ds.verdict}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{ds.summary}</p>
        </div>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 flex w-full items-center justify-between rounded-[var(--radius-xs)] bg-surface-2 px-3 py-2 text-xs font-semibold text-ink-soft"
        aria-expanded={open}
      >
        {t("ai.dealScoreWhy")}
        <IconChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {ds.factors.map((f) => (
            <li key={f.label} className="text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-ink-soft">{f.label}</span>
                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                    f.impact > 0
                      ? "bg-success/12 text-success"
                      : f.impact < 0
                        ? "bg-danger/12 text-danger"
                        : "bg-surface-2 text-muted"
                  }`}
                >
                  {f.impact > 0 ? "+" : ""}
                  {f.impact} pts
                </span>
              </div>
              <p className="mt-1 text-muted">{f.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RecommendationsCard({ vehicle: v }: { vehicle: Vehicle }) {
  const { t } = useI18n();
  const { similar, betterValue } = recommendations(v);
  const effectiveBetter = betterValue.length ? betterValue : similar;
  const [tab, setTab] = useState<"similar" | "better">("better");
  const list = tab === "similar" ? similar : effectiveBetter;

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2">
        <IconSparkles className="h-4 w-4 text-brand-2" />
        <h3 className="text-sm font-bold text-ink">{t("ai.recommendations")}</h3>
      </div>
      <div className="mt-3 flex gap-1.5">
        <TabBtn active={tab === "better"} onClick={() => setTab("better")}>{t("ai.betterValue")}</TabBtn>
        <TabBtn active={tab === "similar"} onClick={() => setTab("similar")}>{t("ai.similar")}</TabBtn>
      </div>
      <ul className="mt-3 space-y-2">
        {list.length === 0 && <li className="text-xs text-muted">Nothing closely comparable is live right now.</li>}
        {list.map((r) => (
          <li key={r.id}>
            <Link href={`/vehicles/${r.id}`} className="card card-hover flex items-center gap-3 p-2">
              <CarImage from={r.accentFrom} to={r.accentTo} bodyType={r.bodyType} seed={Number(r.id)} className="h-12 w-16 shrink-0 rounded-[var(--radius-xs)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-ink">{r.year} {r.make} {r.model}</p>
                <p className="text-xs text-muted">{r.mileageKm.toLocaleString()} km · condition {r.conditionScore}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-brand-2"><Money usd={r.currentBid} compact /></span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-[var(--radius-xs)] bg-surface-2 px-3 py-2 text-[11px] text-muted">
        Personalised auction alerts: we&apos;ll email you when a closer match to your searches goes live.
      </p>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "bg-gradient-to-r from-brand to-brand-2 text-white shadow-[var(--shadow-xs)]"
          : "bg-surface-2 text-ink-soft hover:bg-surface-3"
      }`}
    >
      {children}
    </button>
  );
}
