import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and auction rules governing use of the CarSouq platform.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service & Auction Rules" subtitle="Last updated 1 September 2026. This is a plain-language summary followed by the full terms." />
      <section className="section">
        <div className="container-page">
          <Prose>
            <h2>1. About these terms</h2>
            <p>
              These terms are between you and CarSouq SAL, a company registered in Lebanon. By creating an account
              or placing a bid you accept them. If you do not agree, do not use the platform.
            </p>
            <h2>2. Accounts and verification</h2>
            <ul>
              <li>You must be at least 18 and provide accurate details.</li>
              <li>We verify identity and, for higher-value transactions, source of funds.</li>
              <li>You are responsible for activity on your account. Tell us immediately if it is compromised.</li>
            </ul>
            <h2>3. Bidding</h2>
            <ul>
              <li>Every bid is a binding, irrevocable offer to buy at that price plus applicable fees.</li>
              <li>The highest bid at close wins if it meets the reserve.</li>
              <li>A bid placed in the final two minutes extends the auction by two minutes.</li>
              <li>We may cancel bids or suspend accounts where we detect manipulation, non-payment history, or fraud.</li>
              <li>CarSouq does not bid on any lot and does not permit sellers or their associates to bid on their own lots.</li>
            </ul>
            <h2>4. Reserve price</h2>
            <p>
              The reserve is confidential. If bidding ends below it, the seller is not obliged to sell, but CarSouq will
              offer to introduce the highest bidder and the seller to negotiate a private sale on the platform.
            </p>
            <h2>5. Payment and completion</h2>
            <ul>
              <li>Winning buyers must pay the full invoice into CarSouq escrow within 48 hours.</li>
              <li>Funds are released to the seller after the buyer collects the vehicle and confirms it materially matches the listing, or after 3 days if no issue is raised.</li>
              <li>Non-payment may result in loss of deposit, a fee equal to the buyer&apos;s premium, and account suspension.</li>
            </ul>
            <h2>6. Vehicle condition and disclosures</h2>
            <p>
              Inspections and condition scores are opinions provided to assist your assessment, not warranties. Vehicles
              are sold as described in the listing and inspection report. You are strongly encouraged to inspect in
              person before bidding.
            </p>
            <h2>7. Fees</h2>
            <p>Fees are set out on the Fees page and shown before you bid. We may change fees prospectively with notice.</p>
            <h2>8. Liability</h2>
            <p>
              To the extent permitted by Lebanese law, CarSouq&apos;s liability arising from a transaction is limited to the
              fees we charged on that transaction. We are not party to the sale contract, which is between buyer and
              seller.
            </p>
            <h2>9. Governing law</h2>
            <p>These terms are governed by the laws of Lebanon, and the courts of Beirut have jurisdiction.</p>
            <h2>10. Contact</h2>
            <p>Questions about these terms: legal@carsouq.lb.</p>
          </Prose>
        </div>
      </section>
    </>
  );
}
