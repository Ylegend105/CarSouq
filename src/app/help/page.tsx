import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import FAQAccordion from "@/components/site/FAQAccordion";
import Reveal from "@/components/ui/Reveal";
import { FAQ } from "@/lib/data";
import { IconShield, IconFileText, IconGavel, IconWallet, IconPhone } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers about bidding, payments, inspections, verification and anti-fraud on CarSouq.",
};

const TOPICS = [
  {
    icon: IconGavel,
    title: "Bidding & auctions",
    body: "Increments, timer extensions, reserve status, and what a binding bid means.",
  },
  {
    icon: IconWallet,
    title: "Payments & escrow",
    body: "How to pay, accepted methods, refunds, and when sellers are paid.",
  },
  {
    icon: IconFileText,
    title: "Inspections & documents",
    body: "What the 212-point check covers and how to read the report.",
  },
  {
    icon: IconShield,
    title: "Verification & safety",
    body: "Identity checks, seller verification, and how we handle anti-fraud.",
  },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help Center"
        title="How can we help?"
        subtitle="Browse common questions, or reach our Beirut-based support team by phone, WhatsApp or email."
      >
        <div className="flex flex-wrap gap-3">
          <a href="tel:+9611000111" className="btn btn-secondary btn-sm">
            <IconPhone className="h-4 w-4" />
            +961 1 000 111
          </a>
          <a href="https://wa.me/9613000111" className="btn btn-secondary btn-sm">
            WhatsApp
          </a>
          <Link href="/contact" className="btn btn-primary btn-sm">
            Contact support
          </Link>
        </div>
      </PageHeader>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map((topic, i) => (
              <Reveal key={topic.title} delay={i * 70}>
                <div className="panel card-hover h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-gradient-to-br from-brand/12 to-brand-3/12 text-brand-2">
                    <topic.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[0.95rem] font-bold text-ink">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{topic.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h2 className="mt-16 font-display text-2xl font-bold text-ink">Frequently asked</h2>
            <div className="mt-6">
              <FAQAccordion items={FAQ} />
            </div>
          </Reveal>

          <Reveal>
            <div className="panel ring-gradient mt-10 p-7">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-danger/10 text-danger">
                  <IconShield className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[0.95rem] font-bold text-ink">Anti-fraud notice</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    CarSouq never asks you to pay outside the platform. All payments go into CarSouq escrow — never
                    transfer money directly to a seller or to anyone claiming to be CarSouq staff. We do not place
                    bids on behalf of sellers, and we monitor every auction for bid manipulation. If something feels
                    wrong, stop and contact us before paying.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
