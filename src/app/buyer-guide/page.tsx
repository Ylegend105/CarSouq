import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Buyer guide",
  description: "Everything you need to bid with confidence on CarSouq — reading an inspection, setting a limit, and collecting your car.",
};

export default function BuyerGuidePage() {
  return (
    <>
      <PageHeader eyebrow="Buyer guide" title="Bid with confidence" subtitle="A practical guide to buying a car at auction on CarSouq, written for the Lebanese market." />
      <section className="section">
        <div className="container-page">
          <Prose>
            <h2>1. Before you bid</h2>
            <ul>
              <li><strong>Verify your account.</strong> ID and a payment method unlock bidding and are required above $10,000.</li>
              <li><strong>Read the whole inspection.</strong> Look at the condition score, then the individual system ratings and the damage disclosures. Open the undercarriage photos.</li>
              <li><strong>Use the AI assistant.</strong> Ask &quot;what are common issues with this model?&quot; and &quot;how high should I bid?&quot; — it explains its reasoning.</li>
              <li><strong>Check the Deal Score.</strong> It compares the current bid to an estimated market range and shows every factor behind the number.</li>
              <li><strong>Arrange a viewing.</strong> You can inspect any car in person or send a mechanic before the auction ends.</li>
            </ul>
            <h2>2. Setting your limit</h2>
            <p>
              Decide your maximum before bidding starts and write it down. Include fees: on a $25,000 car budget about
              $1,500 in premium and documentation. Let the timer be the thing that stops you, not another bidder.
            </p>
            <h2>3. During the auction</h2>
            <ul>
              <li>Bids are binding. Every bid is confirmed before it is placed.</li>
              <li>A bid in the final 2 minutes extends the timer by 2 minutes, so there is no last-second sniping.</li>
              <li>Watch the reserve status. If it shows &quot;reserve not met&quot;, the seller can still decline at the end — but we will introduce you to negotiate.</li>
            </ul>
            <h2>4. If you win</h2>
            <ol>
              <li>Pay the invoice into CarSouq escrow within 48 hours.</li>
              <li>Book collection at the car&apos;s location, or ask us to deliver.</li>
              <li>Inspect against the report using our checklist. Cold-start it, check the VIN against the papers, test every feature.</li>
              <li>Confirm in the app. We release funds to the seller and the car is yours.</li>
            </ol>
            <h2>5. Buying from abroad</h2>
            <p>
              Diaspora buyers can bid and pay from anywhere. Appoint a local representative for collection, or ask us to
              arrange storage and export documentation.
            </p>
          </Prose>
          <div className="mt-10 flex gap-3">
            <Link href="/auctions" className="btn btn-primary">Browse live auctions</Link>
            <Link href="/fees" className="btn btn-secondary">See all fees</Link>
          </div>
        </div>
      </section>
    </>
  );
}
