"use client";

import Link from "next/link";
import type { Vehicle } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { formatKm } from "@/lib/format";
import CarImage from "@/components/CarImage";
import Money from "@/components/ui/Money";
import Countdown from "@/components/ui/Countdown";
import WatchButton from "@/components/ui/WatchButton";
import ConditionMeter from "@/components/ui/ConditionMeter";
import {
  IconGauge,
  IconMapPin,
  IconCalendar,
  IconGearbox,
  IconUsers,
  IconArrowRight,
} from "@/components/ui/icons";

export default function VehicleCard({
  vehicle: v,
  layout = "grid",
}: {
  vehicle: Vehicle;
  layout?: "grid" | "list";
}) {
  const { t, locale } = useI18n();
  const ended = v.auctionStatus === "ended";
  const href = `/vehicles/${v.id}`;

  const reserveBadge = v.reserveMet ? (
    <span className="badge badge-success">{t("common.reserveMet")}</span>
  ) : (
    <span className="badge badge-warning">{t("common.reserveNotMet")}</span>
  );

  /* ---------------- list layout ---------------- */
  if (layout === "list") {
    return (
      <article className="card card-hover group overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <Link href={href} className="relative block sm:w-72 sm:shrink-0">
            <CarImage
              from={v.accentFrom}
              to={v.accentTo}
              bodyType={v.bodyType}
              seed={Number(v.id)}
              label={`${v.year} ${v.make} ${v.model}`}
              className="aspect-[16/10] w-full sm:h-full"
            />
            <div className="absolute inset-x-3 top-3 flex items-center justify-between">
              {ended ? (
                <span className="badge backdrop-blur">{t("common.ended")}</span>
              ) : (
                <Countdown endsInHours={v.endsInHours} />
              )}
              <WatchButton vehicleId={v.id} />
            </div>
          </Link>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={href} className="focus-ring">
                  <h3 className="font-display text-[1.05rem] font-bold leading-tight text-ink transition-colors group-hover:text-brand-2">
                    {v.year} {v.make} {v.model}
                  </h3>
                </Link>
                <p className="mt-0.5 text-sm text-muted">
                  {v.trim} · {v.engine !== "—" ? v.engine : v.fuel}
                </p>
              </div>
              <ConditionMeter score={v.conditionScore} showLabel={false} />
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft">
              <Meta Icon={IconGauge} value={formatKm(v.mileageKm, locale)} />
              <Meta Icon={IconGearbox} value={v.transmission} />
              <Meta Icon={IconMapPin} value={v.location} />
              <Meta Icon={IconUsers} value={`${v.bidderCount} ${t("common.bidders")}`} />
            </div>

            <div className="mt-auto flex items-end justify-between gap-3 pt-2">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">
                  {t("common.currentBid")}
                </p>
                <p className="font-display text-xl font-extrabold text-ink">
                  <Money usd={v.currentBid} />
                </p>
                <div className="mt-1.5">{reserveBadge}</div>
              </div>
              <Link href={href} className="btn btn-primary btn-sm">
                {ended ? t("cta.viewVehicle") : t("cta.placeBid")}
                <IconArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ---------------- grid layout ---------------- */
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <Link href={href} className="relative block overflow-hidden">
        <CarImage
          from={v.accentFrom}
          to={v.accentTo}
          bodyType={v.bodyType}
          seed={Number(v.id)}
          label={`${v.year} ${v.make} ${v.model}`}
          className="aspect-[16/10] w-full transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {ended ? (
            <span className="badge backdrop-blur">{t("common.ended")}</span>
          ) : (
            <Countdown endsInHours={v.endsInHours} />
          )}
          <WatchButton vehicleId={v.id} />
        </div>
        {v.featured && (
          <span className="badge badge-gold absolute bottom-3 start-3 backdrop-blur">
            ★ {t("featured.eyebrow")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <Link href={href} className="focus-ring">
              <h3 className="truncate font-display text-[1rem] font-bold leading-tight text-ink transition-colors group-hover:text-brand-2">
                {v.year} {v.make} {v.model}
              </h3>
            </Link>
            <p className="mt-0.5 truncate text-xs text-muted">{v.trim}</p>
          </div>
          <ConditionMeter score={v.conditionScore} showLabel={false} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs text-ink-soft">
          <Meta Icon={IconGauge} value={formatKm(v.mileageKm, locale)} />
          <Meta Icon={IconCalendar} value={String(v.year)} />
          <Meta Icon={IconGearbox} value={v.transmission} />
          <Meta Icon={IconMapPin} value={v.location} />
        </div>

        <div className="mt-5 flex items-end justify-between gap-2 border-t border-line pt-4">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">
              {t("common.currentBid")}
            </p>
            <p className="font-display text-xl font-extrabold text-ink">
              <Money usd={v.currentBid} />
            </p>
          </div>
          <div className="text-end">
            {reserveBadge}
            <p className="mt-1.5 text-[0.68rem] text-muted">
              {v.bidCount} {t("common.bids")}
            </p>
          </div>
        </div>

        <Link href={href} className="btn btn-primary btn-sm mt-4 w-full">
          {ended ? t("cta.viewVehicle") : t("cta.placeBid")}
        </Link>
      </div>
    </article>
  );
}

function Meta({ Icon, value }: { Icon: React.ComponentType<{ className?: string }>; value: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted" />
      <span className="truncate">{value}</span>
    </span>
  );
}
