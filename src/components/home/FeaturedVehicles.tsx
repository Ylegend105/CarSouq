"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { VEHICLES } from "@/lib/data";
import VehicleCard from "@/components/vehicle/VehicleCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { IconArrowRight } from "@/components/ui/icons";

export default function FeaturedVehicles() {
  const { t } = useI18n();
  const featured = VEHICLES.filter((v) => v.featured).slice(0, 6);

  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeading
              eyebrow={t("featured.eyebrow")}
              title={t("featured.title")}
              subtitle={t("featured.subtitle")}
            />
            <Link href="/auctions" className="btn btn-secondary btn-sm">
              {t("cta.viewAll")}
              <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 90} className="h-full">
              <VehicleCard vehicle={v} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
