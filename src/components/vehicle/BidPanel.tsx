"use client";

import { useState } from "react";
import type { BidRecord, Vehicle } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { bidIncrement, computeFees, minNextBid, relativeTime } from "@/lib/format";
import Money from "@/components/ui/Money";
import Countdown from "@/components/ui/Countdown";
import WatchButton from "@/components/ui/WatchButton";
import {
  IconGavel,
  IconCheck,
  IconUsers,
  IconShield,
  IconShare,
  IconX,
} from "@/components/ui/icons";

interface Props {
  vehicle: Vehicle;
  currentBid: number;
  bidCount: number;
  bidderCount: number;
  bids: BidRecord[];
  youWinning: boolean;
  ended: boolean;
  onBid: (amount: number) => void;
}

export default function BidPanel({
  vehicle: v,
  currentBid,
  bidCount,
  bidderCount,
  bids,
  youWinning,
  ended,
  onBid,
}: Props) {
  const { t, locale } = useI18n();
  const min = minNextBid(currentBid);
  const inc = bidIncrement(currentBid);
  const [amount, setAmount] = useState(min);
  const [stage, setStage] = useState<"idle" | "confirm" | "success">("idle");
  const [showAllBids, setShowAllBids] = useState(false);
  const reserveMet = currentBid >= v.reservePrice;

  const effAmount = Math.max(amount, min);
  const fees = computeFees(effAmount);
  const shownBids = showAllBids ? bids : bids.slice(0, 4);

  return (
    <div className="panel ring-gradient overflow-hidden shadow-[var(--shadow-soft)]">
      {/* ---- header ---- */}
      <div className="border-b border-line bg-gradient-to-br from-surface-2 to-surface p-5">
        <div className="flex items-center justify-between">
          <span className={`badge ${ended ? "" : "badge-live"}`}>
            {!ended && <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />}
            {ended ? t("common.ended") : t("common.live")}
          </span>
          <div className="flex items-center gap-1.5">
            <WatchButton vehicleId={v.id} />
            <ShareButton title={`${v.year} ${v.make} ${v.model}`} />
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">
              {t("common.currentBid")}
            </p>
            <p className="font-display text-[2.1rem] font-extrabold leading-none tracking-tight text-ink">
              <Money usd={currentBid} />
            </p>
          </div>
          <div className="shrink-0 text-end">
            <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">
              {t("common.timeLeft")}
            </p>
            <Countdown endsInHours={v.endsInHours} variant="large" className="text-[1.05rem]" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {reserveMet ? (
            <span className="badge badge-success">
              <IconCheck className="h-3 w-3" />
              {t("common.reserveMet")}
            </span>
          ) : (
            <span className="badge badge-warning">{t("common.reserveNotMet")}</span>
          )}
          <span className="badge">
            <IconUsers className="h-3.5 w-3.5" />
            {bidderCount} {t("common.bidders")}
          </span>
          <span className="badge">
            {bidCount} {t("common.bids")}
          </span>
        </div>

        {youWinning && !ended && (
          <p className="animate-scale-in mt-4 flex items-center gap-2 rounded-[var(--radius-xs)] border border-success/25 bg-success/10 px-3.5 py-2.5 text-xs font-bold text-success">
            <IconCheck className="h-4 w-4" /> {t("vehicle.youAreHighest")}
          </p>
        )}
      </div>

      {/* ---- controls ---- */}
      {!ended && (
        <div className="space-y-4 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="label !mb-0">{t("vehicle.minNextBid")}</span>
              <span className="text-sm font-bold text-brand-2">
                <Money usd={min} />
              </span>
            </div>

            <div className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                  $
                </span>
                <input
                  type="number"
                  className="input ps-7 text-[0.95rem] font-bold tabular"
                  value={effAmount}
                  min={min}
                  step={inc}
                  onChange={(e) => setAmount(Math.max(min, Number(e.target.value) || min))}
                  aria-label={t("vehicle.customBid")}
                />
              </div>
              <button
                onClick={() => setAmount(effAmount + inc)}
                className="btn btn-secondary btn-sm !px-3.5"
                aria-label="Increase bid"
              >
                +<Money usd={inc} compact />
              </button>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[0, 1, 3].map((k) => {
                const val = min + k * inc;
                const active = effAmount === val;
                return (
                  <button
                    key={k}
                    onClick={() => setAmount(val)}
                    className={`rounded-full border px-2 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      active
                        ? "border-brand-2 bg-brand-2/10 text-brand-2"
                        : "border-line-strong text-ink-soft hover:bg-surface-2"
                    }`}
                  >
                    <Money usd={val} compact />
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={() => setStage("confirm")} className="btn btn-primary btn-lg w-full">
            <IconGavel className="h-[18px] w-[18px]" />
            {t("vehicle.placeBidCta")} · <Money usd={effAmount} />
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center text-[0.68rem] leading-relaxed text-muted">
            <IconShield className="h-3.5 w-3.5 shrink-0 text-brand-2" />
            Binding bid · buyer&apos;s premium <Money usd={fees.premium} /> applies on win
          </p>
        </div>
      )}

      {/* ---- history ---- */}
      <div className="border-t border-line p-5">
        <p className="mb-3 text-sm font-bold text-ink">{t("vehicle.bidHistory")}</p>
        <ul className="divide-line text-sm">
          {shownBids.map((b, i) => (
            <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${i === 0 ? "bg-success" : "bg-line-strong"}`}
                />
                <span className={`truncate ${b.bidder === "You" ? "font-bold text-brand-2" : "text-ink-soft"}`}>
                  {b.bidder}
                </span>
                {b.auto && <span className="badge !px-1.5 !py-0 !text-[0.6rem]">auto</span>}
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="font-bold tabular text-ink">
                  <Money usd={b.amount} />
                </span>
                <span className="w-[4.5rem] text-end text-[0.68rem] text-muted">
                  {relativeTime(b.minutesAgo, locale)}
                </span>
              </span>
            </li>
          ))}
        </ul>
        {bids.length > 4 && (
          <button
            onClick={() => setShowAllBids((s) => !s)}
            className="mt-3 text-xs font-bold text-brand-2 transition-colors hover:text-brand"
          >
            {showAllBids ? "Show less" : `Show all ${bids.length} bids`}
          </button>
        )}
      </div>

      {/* ---- confirm ---- */}
      {stage === "confirm" && (
        <Modal onClose={() => setStage("idle")}>
          <h3 className="font-display text-xl font-bold text-ink">{t("vehicle.confirmTitle")}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{t("vehicle.confirmBody")}</p>

          <div className="mt-5 space-y-2.5 rounded-[var(--radius-sm)] border border-line bg-surface-2 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {v.year} {v.make} {v.model}
            </p>
            <Row label={t("vehicle.placeBidCta")} value={<Money usd={effAmount} />} strong />
            <Row label="Buyer's premium (4.5%)" value={<Money usd={fees.premium} />} />
            <Row label="Documentation fee" value={<Money usd={fees.documentation} />} />
            <Row label="Registration transfer" value={<Money usd={fees.transfer} />} />
            <div className="border-t border-line pt-2.5">
              <Row label="Total if you win" value={<Money usd={fees.total} />} strong />
            </div>
          </div>

          <div className="mt-6 flex gap-2.5">
            <button onClick={() => setStage("idle")} className="btn btn-secondary flex-1">
              {t("vehicle.cancel")}
            </button>
            <button
              onClick={() => {
                onBid(effAmount);
                setStage("success");
              }}
              className="btn btn-primary flex-1"
            >
              {t("vehicle.confirmButton")} <Money usd={effAmount} />
            </button>
          </div>
        </Modal>
      )}

      {/* ---- success ---- */}
      {stage === "success" && (
        <Modal onClose={() => setStage("idle")}>
          <div className="flex flex-col items-center text-center">
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-success/12 text-success">
              <IconCheck className="h-8 w-8" />
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-ink">{t("vehicle.bidPlaced")}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{t("vehicle.bidPlacedBody")}</p>
            <p className="mt-4 font-display text-3xl font-extrabold text-ink">
              <Money usd={effAmount} />
            </p>
            <button onClick={() => setStage("idle")} className="btn btn-primary mt-6 w-full">
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? "font-bold text-ink" : "text-ink-soft"}`}>
      <span>{label}</span>
      <span className="tabular">{value}</span>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <div className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="panel animate-sheet relative z-10 w-full max-w-md p-6 shadow-[var(--shadow-lift)]">
        <button
          onClick={onClose}
          className="absolute end-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          aria-label="Close"
        >
          <IconX className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          if (navigator.share) {
            await navigator.share({ title, url: window.location.href });
          } else {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }
        } catch {}
      }}
      className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/85 text-ink-soft shadow-[var(--shadow-xs)] backdrop-blur transition-all duration-300 hover:scale-110 hover:border-brand-2/50 hover:text-brand-2 focus-ring"
      aria-label="Share"
    >
      {copied ? (
        <IconCheck className="h-[18px] w-[18px] text-success" />
      ) : (
        <IconShare className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
