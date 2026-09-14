"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import PageHeader from "@/components/site/PageHeader";
import ListingAssistant from "@/components/seller/ListingAssistant";
import { IconScan, IconGavel, IconWallet, IconCheck, IconShield } from "@/components/ui/icons";

export default function SellPage() {
  const { t } = useI18n();

  const steps = [
    { icon: IconScan, title: "1 · List & inspect", body: "Submit your car in minutes. We schedule a free 212-point inspection at your location or ours." },
    { icon: IconGavel, title: "2 · 7-day auction", body: "Verified bidders compete in real time. Set a private reserve and adjust it any time before the last hour." },
    { icon: IconWallet, title: "3 · Get paid fast", body: "Buyer pays into escrow. Once they collect and confirm, your payout lands within one business day." },
  ];

  return (
    <>
      <PageHeader eyebrow={t("nav.sell")} title={t("sell.title")} subtitle={t("sell.subtitle")}>
        <div className="flex flex-wrap gap-3">
          <a href="#assistant" className="btn btn-primary">
            {t("sell.generate")}
          </a>
          <Link href="/seller-guide" className="btn btn-secondary">
            Read the seller guide
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-success" /> Free inspection &amp; photography</span>
          <span className="inline-flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-success" /> No fee if it doesn&apos;t sell</span>
          <span className="inline-flex items-center gap-1.5"><IconCheck className="h-4 w-4 text-success" /> 5% seller commission, capped at $1,500</span>
        </div>
      </PageHeader>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="panel card-hover p-7">
                <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-sm)] bg-gradient-to-br from-brand/12 to-brand-3/12 text-brand-2">
                  <s.icon className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-5 font-display text-[1.02rem] font-bold text-ink">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="assistant" className="section scroll-mt-20 border-t border-line bg-surface">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-brand-2" />
              AI listing assistant
            </p>
            <h2 className="mt-3 font-display text-[1.85rem] font-extrabold tracking-tight text-ink sm:text-[2.35rem]">
              Draft your listing and pricing strategy in seconds
            </h2>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">
              Our assistant suggests a title, description, a realistic reserve range for the Lebanese market, a photo
              checklist, and how much bidder interest to expect.
            </p>
          </div>
          <div className="mt-8">
            <ListingAssistant />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="panel flex flex-wrap items-center justify-between gap-6 p-8">
            <div className="max-w-md">
              <IconShield className="h-6 w-6 text-brand-2" />
              <h3 className="mt-3 text-lg font-semibold text-ink">Verified sellers sell for more</h3>
              <p className="mt-2 text-sm text-muted">
                Complete seller verification once — ID, ownership proof, and bank details. Verified listings attract
                more bidders and clear faster.
              </p>
            </div>
            <Link href="/dashboard/seller" className="btn btn-primary">
              {t("nav.sellerDashboard")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
