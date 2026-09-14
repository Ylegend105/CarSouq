"use client";

import { useI18n } from "@/lib/i18n";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { IconScan, IconShield, IconGavel, IconMapPin } from "@/components/ui/icons";

export default function TrustSignals() {
  const { t } = useI18n();
  const items = [
    { icon: IconScan, key: "1" },
    { icon: IconShield, key: "2" },
    { icon: IconGavel, key: "3" },
    { icon: IconMapPin, key: "4" },
  ];

  return (
    <section className="section relative border-y border-line bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.55]"
        style={{
          background: "radial-gradient(60% 100% at 50% 0%, color-mix(in srgb, var(--color-brand-2) 12%, transparent), transparent 70%)",
        }}
      />
      <div className="container-page relative">
        <Reveal>
          <SectionHeading eyebrow={t("trust.eyebrow")} title={t("trust.title")} align="center" />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, key }, i) => (
            <Reveal key={key} delay={i * 90}>
              <div className="group card card-hover h-full p-7">
                <span className="relative grid h-12 w-12 place-items-center rounded-[var(--radius-sm)] bg-gradient-to-br from-brand/12 to-brand-3/12 text-brand-2 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] group-hover:scale-110">
                  <Icon className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-5 font-display text-[1.02rem] font-bold text-ink">
                  {t(`trust.${key}.title`)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{t(`trust.${key}.body`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
