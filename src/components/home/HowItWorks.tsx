"use client";

import { useI18n } from "@/lib/i18n";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { IconSearch, IconGavel, IconCheck } from "@/components/ui/icons";

export default function HowItWorks() {
  const { t } = useI18n();
  const steps = [
    { icon: IconSearch, key: "1" },
    { icon: IconGavel, key: "2" },
    { icon: IconCheck, key: "3" },
  ];

  return (
    <section className="section">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={t("how.eyebrow")} title={t("how.title")} align="center" />
        </Reveal>

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* connector */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[16%] top-[3.4rem] hidden h-px md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-brand-2) 45%, transparent), transparent)",
            }}
          />
          {steps.map(({ icon: Icon, key }, i) => (
            <Reveal key={key} as="li" delay={i * 120} className="relative">
              <div className="panel card-hover h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white shadow-[var(--shadow-glow)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[2.6rem] font-extrabold leading-none text-line-strong">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{t(`how.${key}.title`)}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{t(`how.${key}.body`)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
