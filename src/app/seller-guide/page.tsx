import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Seller guide",
  description: "How to prepare, price, and sell your car at auction on CarSouq for the best result.",
};

export default function SellerGuidePage() {
  return (
    <>
      <PageHeader eyebrow="Seller guide" title="Get the best price for your car" subtitle="What we've learned from thousands of auctions about presenting and pricing a car in Lebanon." />
      <section className="section">
        <div className="container-page">
          <Prose>
            <h2>1. Prepare the car</h2>
            <ul>
              <li>Clean it properly inside and out — a detail pays for itself many times over.</li>
              <li>Gather the service book, spare key, manuals, and any receipts.</li>
              <li>Fix cheap, obvious things: a blown bulb, a missing wiper, low tyres. Leave expensive work — buyers price that in and inspectors will catch it anyway.</li>
            </ul>
            <h2>2. Let us inspect and photograph</h2>
            <p>
              The free 212-point inspection and professional photos are what make buyers bid confidently. Honest photos
              of every flaw build more trust than a spotless-looking listing that disappoints on collection.
            </p>
            <h2>3. Price the reserve realistically</h2>
            <p>
              Use the AI listing assistant for a market-based range. A reserve set slightly below what you hope for
              attracts more early bidders, and competition usually carries the price past it. A high reserve often ends
              with no sale and fewer bidders next time.
            </p>
            <h2>4. During the auction</h2>
            <ul>
              <li>Answer bidder questions quickly — response time correlates with final price.</li>
              <li>You can lower the reserve any time up to the final hour. Lowering it can trigger immediate bidding.</li>
              <li>Most bidding happens in the last 24 hours. Don&apos;t panic at a quiet start.</li>
            </ul>
            <h2>5. After it sells</h2>
            <ol>
              <li>The buyer pays into escrow within 48 hours.</li>
              <li>Arrange collection. We provide the sale contract and handle the transfer paperwork.</li>
              <li>Once the buyer confirms, your payout is released — usually within one business day, by bank transfer or OMT.</li>
            </ol>
            <h2>Commission</h2>
            <p>
              5% of the hammer price, capped at $1,500, and only charged on a completed sale. Listing, inspection, and
              photography are free. If it doesn&apos;t sell, you can relist once at no cost.
            </p>
          </Prose>
          <div className="mt-10 flex gap-3">
            <Link href="/sell" className="btn btn-primary">Start a listing</Link>
            <Link href="/dashboard/seller" className="btn btn-secondary">Seller dashboard</Link>
          </div>
        </div>
      </section>
    </>
  );
}
