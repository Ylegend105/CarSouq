import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import FAQAccordion from "@/components/site/FAQAccordion";
import { FAQ } from "@/lib/data";
import { IconSearch, IconScan, IconGavel, IconShield, IconWallet, IconCheck } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "How it works",
  description: "How buying and selling at auction works on CarSouq — inspection, bidding, escrow, and collection.",
};

const BUYER = [
  { icon: IconSearch, title: "Find a car", body: "Filter by make, model, budget, mileage, body type and location. Read the full inspection and ask the AI assistant anything." },
  { icon: IconShield, title: "Verify once", body: "Confirm your identity and add a payment method. Takes a few minutes and unlocks bidding on every auction." },
  { icon: IconGavel, title: "Bid in real time", body: "Set your maximum or bid manually. We confirm every bid before it's placed. Bids in the last 2 minutes extend the timer." },
  { icon: IconWallet, title: "Pay and collect", body: "Pay into escrow within 48 hours. Collect the car with our checklist, confirm it matches, and we release funds." },
];

const SELLER = [
  { icon: IconScan, title: "List and inspect", body: "Submit the car in minutes. We run a free 212-point inspection and professional photos at your location or ours." },
  { icon: IconGavel, title: "7-day auction", body: "Verified bidders compete. Set a private reserve and adjust it any time before the final hour." },
  { icon: IconCheck, title: "Accept the result", body: "If the reserve is met, it sells. If not, we introduce you to the top bidder to negotiate." },
  { icon: IconWallet, title: "Get paid", body: "Buyer pays into escrow. Once they collect and confirm, your payout lands within one business day." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From browsing to keys in hand"
        subtitle="CarSouq is a timed online auction with an inspection on every car and escrow on every payment. Here's the full flow for buyers and sellers."
      />

      <section className="section">
        <div className="container-page space-y-14">
          {[
            { label: "For buyers", steps: BUYER, cta: { href: "/auctions", text: "Browse live auctions" } },
            { label: "For sellers", steps: SELLER, cta: { href: "/sell", text: "Sell your car" } },
          ].map((group) => (
            <div key={group.label}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-ink">{group.label}</h2>
                <Link href={group.cta.href} className="btn btn-secondary btn-sm">{group.cta.text}</Link>
              </div>
              <ol className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {group.steps.map((s, i) => (
                  <li key={i} className="panel p-5">
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white">
                        <s.icon className="h-4 w-4" />
                      </span>
                      <span className="text-3xl font-semibold text-line-strong">0{i + 1}</span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="section border-t border-line bg-surface">
        <div className="container-page">
          <h2 className="text-xl font-semibold text-ink">Common questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQ} />
          </div>
        </div>
      </section>
    </>
  );
}
