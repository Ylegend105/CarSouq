import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import FeeCalculator from "@/components/site/FeeCalculator";
import Prose from "@/components/site/Prose";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Fees",
  description: "Clear, capped fees for buyers and sellers on CarSouq. No surprises at checkout.",
};

const BUYER_FEES = [
  ["Buyer's premium", "4.5% of hammer price", "Min $300 · max $1,800"],
  ["Documentation fee", "$150 flat", "Contract, transfer of title paperwork"],
  ["Registration transfer & mécanique", "$220", "Optional — we handle it end to end"],
  ["Delivery within Lebanon", "From $90", "Optional — quoted by distance"],
  ["Storage", "$8 / day after 7 days", "First 7 days free"],
];

const SELLER_FEES = [
  ["Listing fee", "Free", "Including inspection and photography"],
  ["Seller commission", "5% of hammer price", "Capped at $1,500 · only on a completed sale"],
  ["Unsold lot", "$0", "Relist once for free"],
  ["Reserve change", "Free", "Any time up to the final hour"],
];

export default function FeesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Fees that are capped and shown upfront"
        subtitle="You see the full cost before you bid. Sellers only pay when a car actually sells."
      />

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-12">
            <Reveal>
              <h2 className="font-display text-xl font-bold text-ink">Buyer fees</h2>
              <FeeTable rows={BUYER_FEES} />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display text-xl font-bold text-ink">Seller fees</h2>
              <FeeTable rows={SELLER_FEES} />
            </Reveal>
            <Reveal delay={120}>
              <Prose>
                <h3>How the buyer&apos;s premium works</h3>
                <p>
                  The premium is 4.5% of the hammer price, with a floor of $300 and a ceiling of $1,800. On a $25,000
                  car that is $1,125; on a $60,000 car it is capped at $1,800. It covers escrow, dispute handling, and
                  the platform.
                </p>
                <h3>When money moves</h3>
                <ol>
                  <li>You win — an invoice for hammer price plus fees is issued.</li>
                  <li>You pay into CarSouq escrow within 48 hours.</li>
                  <li>You collect and confirm the car matches its listing.</li>
                  <li>We release the net amount to the seller, usually within one business day.</li>
                </ol>
              </Prose>
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <FeeCalculator />
          </div>
        </div>
      </section>
    </>
  );
}

function FeeTable({ rows }: { rows: string[][] }) {
  return (
    <div className="panel mt-5 overflow-hidden">
      <table className="w-full text-sm">
        <tbody className="divide-line">
          {rows.map((r) => (
            <tr key={r[0]} className="transition-colors hover:bg-surface-2">
              <td className="p-4 font-semibold text-ink">{r[0]}</td>
              <td className="whitespace-nowrap p-4 font-bold tabular text-brand-2">{r[1]}</td>
              <td className="p-4 text-xs text-muted">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
