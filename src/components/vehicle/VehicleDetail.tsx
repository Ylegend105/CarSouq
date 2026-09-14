"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { BidRecord, Vehicle } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { formatKm, minNextBid } from "@/lib/format";
import Money from "@/components/ui/Money";
import ConditionMeter from "@/components/ui/ConditionMeter";
import Reveal from "@/components/ui/Reveal";
import VehicleGallery from "./VehicleGallery";
import BidPanel from "./BidPanel";
import StickyBidBar from "./StickyBidBar";
import AIAssistantPanel from "./AIAssistantPanel";
import { MarketValueCard, DealScoreCard, RecommendationsCard } from "./AiInsights";
import VehicleCard from "./VehicleCard";
import {
  IconGauge,
  IconCalendar,
  IconMapPin,
  IconFuel,
  IconGearbox,
  IconCheck,
  IconShield,
  IconFileText,
  IconDownload,
  IconInfo,
  IconChevronDown,
  IconChevronRight,
} from "@/components/ui/icons";

const TABS = ["overview", "specs", "inspection", "history", "disclosures", "documents"] as const;
type Tab = (typeof TABS)[number];

export default function VehicleDetail({
  vehicle,
  related,
}: {
  vehicle: Vehicle;
  related: Vehicle[];
}) {
  const car = vehicle;
  const { t, locale } = useI18n();
  const { bids: myBids } = useStore();
  const ended = car.auctionStatus === "ended";

  const myBidForCar = myBids.find((b) => b.vehicleId === car.id);
  const initialBid = Math.max(car.currentBid, myBidForCar?.amount ?? 0);

  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bidCount, setBidCount] = useState(car.bidCount + (myBidForCar ? 1 : 0));
  const [bidderCount, setBidderCount] = useState(car.bidderCount + (myBidForCar ? 1 : 0));
  const [youWinning, setYouWinning] = useState(Boolean(myBidForCar));
  const [history, setHistory] = useState<BidRecord[]>(() => {
    const base = [...car.bids];
    if (myBidForCar && myBidForCar.amount >= car.currentBid) {
      base.unshift({ id: "me", bidder: "You", amount: myBidForCar.amount, minutesAgo: 1 });
    }
    return base.sort((a, b) => b.amount - a.amount);
  });
  const [tab, setTab] = useState<Tab>("overview");

  const handleBid = (amount: number) => {
    setCurrentBid(amount);
    setBidCount((c) => c + 1);
    if (!youWinning) setBidderCount((c) => c + 1);
    setYouWinning(true);
    setHistory((h) =>
      [
        { id: `me-${Date.now()}`, bidder: "You", amount, minutesAgo: 0 },
        ...h.filter((x) => x.bidder !== "You" || x.amount > amount),
      ].sort((a, b) => b.amount - a.amount),
    );
  };

  const specs = useMemo(
    () => [
      { label: t("common.make"), value: car.make },
      { label: t("common.model"), value: `${car.model} ${car.trim}` },
      { label: t("common.year"), value: String(car.year) },
      { label: t("common.bodyType"), value: car.bodyType },
      { label: "Engine", value: car.engine },
      { label: "Drivetrain", value: car.drivetrain },
      { label: t("common.transmission"), value: car.transmission },
      { label: t("common.fuel"), value: car.fuel },
      { label: t("common.mileage"), value: formatKm(car.mileageKm, locale) },
      { label: "Exterior", value: car.exteriorColor },
      { label: "Interior", value: car.interiorColor },
      { label: "VIN", value: car.vin },
      { label: "Title status", value: car.titleStatus },
      { label: t("common.location"), value: car.location },
    ],
    [car, t, locale],
  );

  const quickFacts = [
    { Icon: IconGauge, value: formatKm(car.mileageKm, locale) },
    { Icon: IconCalendar, value: String(car.year) },
    { Icon: IconFuel, value: car.fuel },
    { Icon: IconGearbox, value: car.transmission },
    { Icon: IconMapPin, value: car.location },
  ];

  return (
    <div className="pb-28 lg:pb-0">
      {/* ---------- Header ---------- */}
      <div className="aurora border-b border-line">
        <div className="container-page pb-8 pt-7">
          <nav className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="transition-colors hover:text-brand-2">
              {t("brand.name")}
            </Link>
            <IconChevronRight className="h-3 w-3 rtl:rotate-180" />
            <Link href="/auctions" className="transition-colors hover:text-brand-2">
              {t("nav.auctions")}
            </Link>
            <IconChevronRight className="h-3 w-3 rtl:rotate-180" />
            <span className="truncate text-ink-soft">
              {car.year} {car.make} {car.model}
            </span>
          </nav>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0 animate-fade-up">
              <h1 className="font-display text-[1.75rem] font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
                {car.year} {car.make} {car.model}{" "}
                <span className="gradient-text">{car.trim}</span>
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {quickFacts.map(({ Icon, value }) => (
                  <span
                    key={value}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-2.5 py-1 text-xs font-medium text-ink-soft"
                  >
                    <Icon className="h-3.5 w-3.5 text-brand-2" />
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 animate-fade-up [animation-delay:120ms]">
              {car.seller.verified && (
                <span className="badge badge-brand">
                  <IconShield className="h-3.5 w-3.5" />
                  {t("vehicle.verifiedSeller")}
                </span>
              )}
              <div className="rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2">
                <ConditionMeter score={car.conditionScore} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Main grid ---------- */}
      <div className="container-page mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0">
          <VehicleGallery vehicle={car} />

          {/* tabs */}
          <div className="mt-8 flex gap-1.5 overflow-x-auto rounded-full border border-line bg-surface-2 p-1.5 hide-scrollbar">
            {TABS.map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[0.82rem] font-semibold transition-all duration-300 ${
                  tab === tb
                    ? "bg-surface text-brand-2 shadow-[var(--shadow-xs)]"
                    : "text-muted hover:text-ink"
                }`}
              >
                {t(`vehicle.${tb}`)}
              </button>
            ))}
          </div>

          <div className="py-7">
            {tab === "overview" && (
              <div className="animate-fade-in space-y-8">
                <p className="text-[0.95rem] leading-relaxed text-ink-soft">{car.description}</p>
                <div>
                  <h3 className="text-sm font-bold text-ink">{t("vehicle.highlights")}</h3>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {car.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2.5 rounded-[var(--radius-xs)] border border-line bg-surface px-3 py-2.5 text-sm text-ink-soft"
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
                          <IconCheck className="h-3 w-3" />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">{t("vehicle.equipment")}</h3>
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {car.options.map((o) => (
                      <span key={o} className="badge">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "specs" && (
              <dl className="animate-fade-in grid gap-x-10 sm:grid-cols-2">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-4 border-b border-line py-3 text-sm"
                  >
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="text-end font-semibold text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {tab === "inspection" && (
              <div className="animate-fade-in">
                <div className="ring-gradient flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] bg-surface-2 p-5">
                  <div>
                    <p className="text-sm font-bold text-ink">{car.inspection.inspectedBy}</p>
                    <p className="mt-0.5 text-xs text-muted">Inspected {car.inspection.inspectedOn}</p>
                  </div>
                  <ConditionMeter score={car.inspection.overall} size="md" showLabel={false} />
                </div>
                <ul className="mt-6 space-y-4">
                  {car.inspection.items.map((it) => {
                    const rating = Math.max(0, Math.min(100, it.rating));
                    return (
                      <li key={it.area}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-ink-soft">{it.area}</span>
                          <span className="tabular text-muted">{rating}/100</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full rounded-full transition-[width] duration-1000 [transition-timing-function:var(--ease-out-expo)]"
                            style={{
                              width: `${rating}%`,
                              background:
                                rating >= 85
                                  ? "var(--color-success)"
                                  : rating >= 75
                                    ? "var(--color-brand-2)"
                                    : "var(--color-warning)",
                            }}
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-muted">{it.note}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {tab === "history" && (
              <div className="animate-fade-in space-y-7">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Owners" value={String(car.owners)} />
                  <Stat label="Service history" value={car.serviceHistory} />
                  <Stat label="Accident-free" value={car.accidentFree ? "Yes" : "Disclosed"} />
                  <Stat label="Title" value={car.titleStatus} />
                </div>
                <ol className="relative space-y-6 border-s-2 border-line ps-6">
                  {car.history.map((h, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -start-[1.92rem] top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 ring-4 ring-bg" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-2">{h.date}</p>
                      <p className="mt-0.5 text-sm font-semibold text-ink">{h.label}</p>
                      <p className="mt-0.5 text-sm text-ink-soft">{h.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {tab === "disclosures" && (
              <div className="animate-fade-in space-y-3">
                <p className="flex items-start gap-2.5 rounded-[var(--radius-xs)] border border-brand-2/25 bg-brand-2/8 px-3.5 py-3 text-xs leading-relaxed text-ink-soft">
                  <IconInfo className="mt-px h-4 w-4 shrink-0 text-brand-2" />
                  Every known cosmetic and mechanical issue is disclosed here and photographed in the full gallery.
                </p>
                {car.damages.map((d) => (
                  <div
                    key={d.panel}
                    className="flex items-start justify-between gap-4 rounded-[var(--radius-xs)] border border-line bg-surface p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{d.panel}</p>
                      <p className="mt-0.5 text-sm text-ink-soft">{d.note}</p>
                    </div>
                    <span
                      className={`badge shrink-0 ${
                        d.severity === "None"
                          ? "badge-success"
                          : d.severity === "Minor"
                            ? ""
                            : "badge-warning"
                      }`}
                    >
                      {d.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {tab === "documents" && (
              <ul className="animate-fade-in space-y-2.5">
                {car.documents.map((doc) => (
                  <li
                    key={doc.name}
                    className="group flex items-center justify-between rounded-[var(--radius-xs)] border border-line bg-surface p-3.5 text-sm transition-all duration-300 hover:border-brand-2/40 hover:bg-surface-2"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-xs)] bg-brand-2/10 text-brand-2">
                        <IconFileText className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block font-semibold text-ink">{doc.name}</span>
                        <span className="block text-xs text-muted">
                          {doc.type} · {doc.size}
                        </span>
                      </span>
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors group-hover:bg-brand-2/10 group-hover:text-brand-2">
                      <IconDownload className="h-4 w-4" />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <FeesTerms currentBid={currentBid} />
        </div>

        {/* ---------- Sticky sidebar ---------- */}
        <div className="lg:sticky lg:top-24 lg:h-fit lg:space-y-4">
          <div id="bid-panel" className="scroll-mt-24">
            <BidPanel
              vehicle={car}
              currentBid={currentBid}
              bidCount={bidCount}
              bidderCount={bidderCount}
              bids={history}
              youWinning={youWinning}
              ended={ended}
              onBid={handleBid}
            />
          </div>
          <div className="mt-4 space-y-4 lg:mt-0">
            <MarketValueCard vehicle={car} currentBid={currentBid} />
            <DealScoreCard vehicle={car} />
          </div>
        </div>
      </div>

      {/* ---------- AI + recommendations ---------- */}
      <Reveal className="container-page mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <AIAssistantPanel vehicle={car} />
        <RecommendationsCard vehicle={car} />
      </Reveal>

      {/* ---------- Seller ---------- */}
      <Reveal className="container-page mt-8">
        <div className="panel ring-gradient flex flex-wrap items-center justify-between gap-5 p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-2 font-display text-xl font-extrabold text-white">
              {car.seller.name[0]}
            </span>
            <div>
              <p className="flex flex-wrap items-center gap-2 text-[0.95rem] font-bold text-ink">
                {car.seller.name}
                {car.seller.verified && (
                  <span className="badge badge-brand">
                    <IconShield className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {car.seller.type} · ★ {car.seller.rating} · {car.seller.salesCount} sales on CarSouq
              </p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs text-muted">
            <IconShield className="h-4 w-4 text-brand-2" />
            Identity, business registration and bank details verified by CarSouq.
          </p>
        </div>
      </Reveal>

      {/* ---------- After you win ---------- */}
      <Reveal className="container-page mt-12">
        <h2 className="font-display text-xl font-bold text-ink">{t("vehicle.afterWin")}</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {["1", "2", "3"].map((n, i) => (
            <li key={n} className="panel card-hover p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t(`vehicle.afterWin.${n}`)}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* ---------- Related ---------- */}
      <Reveal className="container-page section">
        <h2 className="font-display text-xl font-bold text-ink">{t("vehicle.related")}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <VehicleCard key={r.id} vehicle={r} />
          ))}
        </div>
      </Reveal>

      <StickyBidBar currentBid={currentBid} endsInHours={car.endsInHours} ended={ended} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-xs)] border border-line bg-surface p-3.5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function FeesTerms({ currentBid }: { currentBid: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  const next = minNextBid(currentBid);

  return (
    <div className="panel mt-2 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5 text-start transition-colors hover:bg-surface-2"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-ink">{t("vehicle.feesTitle")}</span>
        <IconChevronDown
          className={`h-4 w-4 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="animate-fade-in space-y-4 border-t border-line p-5 text-sm text-ink-soft">
          <ul className="space-y-2.5">
            <li className="flex justify-between gap-4">
              <span>Buyer&apos;s premium</span>
              <span className="text-end font-semibold text-ink">4.5% of hammer (min $300, max $1,800)</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Documentation fee</span>
              <span className="font-semibold text-ink">$150</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>Registration transfer &amp; mécanique</span>
              <span className="font-semibold text-ink">$220 (optional)</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{t("vehicle.minNextBid")}</span>
              <span className="font-semibold text-ink">
                <Money usd={next} />
              </span>
            </li>
          </ul>
          <p className="rounded-[var(--radius-xs)] bg-surface-2 px-3.5 py-3 text-xs leading-relaxed">
            Bids are binding. Payment into CarSouq escrow is due within 48 hours of winning. Funds are released to
            the seller only after you collect the vehicle and confirm it matches this listing. If the reserve is not
            met, we introduce the top bidder and the seller to negotiate.
          </p>
          <p className="flex items-start gap-2 text-xs text-muted">
            <IconShield className="mt-px h-3.5 w-3.5 shrink-0 text-brand-2" />
            Anti-fraud: we monitor for bid manipulation and never place bids on a seller&apos;s behalf.
          </p>
        </div>
      )}
    </div>
  );
}
