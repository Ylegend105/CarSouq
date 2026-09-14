"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { VEHICLES, STATS } from "@/lib/data";
import Money from "@/components/ui/Money";
import Countdown from "@/components/ui/Countdown";
import CarImage from "@/components/CarImage";
import {
  IconShield,
  IconScan,
  IconGavel,
  IconArrowRight,
  IconTrendingUp,
  IconUsers,
  IconSparkles,
} from "@/components/ui/icons";

export default function Hero() {
  const { t, locale } = useI18n();
  const spotlight = VEHICLES.find((v) => v.id === "017") ?? VEHICLES[0];
  const runnersUp = VEHICLES.filter((v) => v.featured && v.id !== spotlight.id).slice(0, 2);

  return (
    <section className="aurora relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-page relative grid gap-14 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-28">
        {/* ---------- Copy ---------- */}
        <div className="animate-fade-up">
          <span className="badge badge-brand relative">
            <span className="relative grid h-1.5 w-1.5 place-items-center rounded-full bg-current">
              <span className="pulse-dot absolute inset-0 rounded-full bg-current" />
            </span>
            {t("hero.badge")}
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink text-balance sm:text-[3.4rem] lg:text-[3.9rem]">
            {locale === "en" ? (
              <>
                Lebanon&apos;s <span className="gradient-text">Smarter</span> Car Auction Marketplace
              </>
            ) : (
              t("hero.title")
            )}
          </h1>

          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">{t("hero.subtitle")}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/auctions" className="btn btn-primary btn-lg">
              <IconGavel className="h-[18px] w-[18px]" />
              {t("cta.browse")}
            </Link>
            <Link href="/sell" className="btn btn-secondary btn-lg">
              {t("cta.sell")}
              <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-ink-soft">
            {[
              { Icon: IconScan, key: "hero.stat1" },
              { Icon: IconShield, key: "hero.stat2" },
              { Icon: IconTrendingUp, key: "hero.stat3" },
            ].map(({ Icon, key }) => (
              <li key={key} className="inline-flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-2/10 text-brand-2">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {t(key)}
              </li>
            ))}
          </ul>

          {/* stat strip */}
          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-7 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-xl font-extrabold text-ink">
                  <bdi dir="ltr">{s.value}</bdi>
                </dt>
                <dd className="mt-0.5 text-[0.7rem] leading-tight text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Spotlight ---------- */}
        <div className="relative animate-fade-up [animation-delay:140ms]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-brand-2), transparent 65%)" }}
          />

          <div className="panel ring-gradient overflow-hidden shadow-[var(--shadow-lift)]">
            <div className="relative">
              <CarImage
                from={spotlight.accentFrom}
                to={spotlight.accentTo}
                bodyType={spotlight.bodyType}
                seed={99}
                label={`${spotlight.year} ${spotlight.make} ${spotlight.model}`}
                className="aspect-[16/9] w-full"
              />
              <span className="badge badge-live absolute start-4 top-4 backdrop-blur">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {t("common.live")}
              </span>
              <span className="badge badge-gold absolute end-4 top-4 backdrop-blur">
                <IconSparkles className="h-3 w-3" />
                Deal Score 91
              </span>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[0.95rem] font-bold text-ink">
                    {spotlight.year} {spotlight.make} {spotlight.model}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {spotlight.mileageKm.toLocaleString()} km · {spotlight.location}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">
                    {t("common.timeLeft")}
                  </p>
                  <Countdown endsInHours={spotlight.endsInHours} variant="large" />
                </div>
              </div>

              <div className="flex items-end justify-between rounded-[var(--radius-sm)] border border-line bg-surface-2 p-4">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">
                    {t("common.currentBid")}
                  </p>
                  <p className="font-display text-[1.75rem] font-extrabold leading-tight text-ink">
                    <Money usd={spotlight.currentBid} />
                  </p>
                </div>
                <div className="space-y-1 text-end text-[0.7rem] text-muted">
                  <p className="inline-flex items-center gap-1">
                    <IconGavel className="h-3 w-3" />
                    {spotlight.bidCount} {t("common.bids")}
                  </p>
                  <p className="inline-flex items-center gap-1">
                    <IconUsers className="h-3 w-3" />
                    {spotlight.bidderCount} {t("common.bidders")}
                  </p>
                </div>
              </div>

              <Link href={`/vehicles/${spotlight.id}`} className="btn btn-primary w-full">
                {t("cta.placeBid")}
                <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>

          {/* mini lots */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {runnersUp.map((v) => (
              <Link
                key={v.id}
                href={`/vehicles/${v.id}`}
                className="card card-hover flex items-center gap-3 p-2.5"
              >
                <CarImage
                  from={v.accentFrom}
                  to={v.accentTo}
                  bodyType={v.bodyType}
                  seed={Number(v.id)}
                  className="h-12 w-16 shrink-0 rounded-[var(--radius-xs)]"
                />
                <div className="min-w-0">
                  <p className="truncate text-[0.7rem] font-semibold text-ink">
                    {v.make} {v.model}
                  </p>
                  <p className="text-sm font-bold text-brand-2">
                    <Money usd={v.currentBid} compact />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
