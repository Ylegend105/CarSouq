"use client";

import { useI18n } from "@/lib/i18n";
import { TESTIMONIALS } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { IconStar, IconQuote } from "@/components/ui/icons";

export default function Testimonials() {
  const { t } = useI18n();

  return (
    <section className="section border-y border-line bg-surface">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={t("testimonials.eyebrow")} title={t("testimonials.title")} align="center" />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((tm, i) => (
            <Reveal key={tm.name} delay={i * 80}>
              <figure className="card card-hover relative flex h-full flex-col p-6">
                <IconQuote className="absolute end-5 top-5 h-7 w-7 text-line-strong" />
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <IconStar key={s} className={`h-4 w-4 ${s < tm.rating ? "fill-current" : "opacity-25"}`} />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                  “{tm.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-xs font-bold text-white">
                    {tm.name[0]}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink">{tm.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {tm.role} · {tm.city}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-muted">
            <span>Trusted by dealers in Beirut, Jounieh, Tripoli &amp; Zahlé</span>
            <span className="hidden h-1 w-1 rounded-full bg-line-strong sm:inline" />
            <span>Payments via bank transfer, OMT &amp; Whish</span>
            <span className="hidden h-1 w-1 rounded-full bg-line-strong sm:inline" />
            <span>Registered auction operator — Ministry of Economy &amp; Trade</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
