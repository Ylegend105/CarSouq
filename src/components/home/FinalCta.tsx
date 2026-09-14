"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/Reveal";
import { IconGavel, IconArrowRight, IconCheck } from "@/components/ui/icons";

export default function FinalCta() {
  const { t } = useI18n();
  const points = ["Free inspection for sellers", "No fee if it doesn't sell", "Escrow on every payment"];

  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-brand via-brand to-brand-2 px-6 py-16 text-center text-white sm:px-12 sm:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-35"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 18% 18%, rgba(255,255,255,0.4), transparent 42%), radial-gradient(circle at 86% 76%, rgba(255,255,255,0.28), transparent 46%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.13]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
                maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 20%, transparent 72%)",
              }}
            />

            <div className="relative">
              <h2 className="font-display text-[2.1rem] font-extrabold tracking-tight text-balance sm:text-[2.9rem]">
                {t("finalCta.title")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.02rem] leading-relaxed text-white/85">
                {t("finalCta.subtitle")}
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link href="/auctions" className="btn btn-white btn-lg">
                  <IconGavel className="h-[18px] w-[18px]" />
                  {t("cta.browse")}
                </Link>
                <Link
                  href="/signup"
                  className="btn btn-lg border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                >
                  {t("nav.register")}
                  <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>

              <ul className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-2.5 text-xs font-medium text-white/80">
                {points.map((p) => (
                  <li key={p} className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-3.5 w-3.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
