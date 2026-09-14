"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { VEHICLES } from "@/lib/data";
import Money from "@/components/ui/Money";
import Countdown from "@/components/ui/Countdown";
import CarImage from "@/components/CarImage";
import { IconArrowRight } from "@/components/ui/icons";

export default function LiveAuctionStrip() {
  const { t } = useI18n();
  const live = VEHICLES.filter((v) => v.auctionStatus === "live").sort((a, b) => a.endsInHours - b.endsInHours);
  const loop = [...live, ...live];

  return (
    <section className="border-b border-line bg-surface py-7">
      <div className="container-page flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute inset-0 rounded-full bg-danger" />
            <span className="pulse-dot absolute inset-0 rounded-full bg-danger" />
          </span>
          <h2 className="text-sm font-bold text-ink">{t("strip.title")}</h2>
          <span className="hidden text-xs text-muted sm:inline">— {t("strip.subtitle")}</span>
        </div>
        <Link
          href="/auctions"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-brand-2 transition-colors hover:text-brand"
        >
          {t("cta.viewAll")}
          <IconArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </Link>
      </div>

      <div className="fade-edges-x relative mt-5 overflow-hidden">
        <div className="marquee-track flex w-max gap-3">
          {loop.map((v, i) => (
            <Link
              key={`${v.id}-${i}`}
              href={`/vehicles/${v.id}`}
              className="card card-hover flex w-[19rem] shrink-0 items-center gap-3 p-3"
            >
              <CarImage
                from={v.accentFrom}
                to={v.accentTo}
                bodyType={v.bodyType}
                seed={Number(v.id)}
                className="h-16 w-[5.5rem] shrink-0 rounded-[var(--radius-xs)]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-ink">
                  {v.year} {v.make} {v.model}
                </p>
                <p className="font-display text-[0.95rem] font-extrabold text-brand-2">
                  <Money usd={v.currentBid} compact />
                </p>
                <Countdown endsInHours={v.endsInHours} variant="inline" className="text-[0.68rem]" />
              </div>
              <span className="btn btn-primary btn-xs shrink-0">{t("cta.placeBid")}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
