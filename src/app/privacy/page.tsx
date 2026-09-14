import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CarSouq collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated 1 September 2026. How we handle your personal data." />
      <section className="section">
        <div className="container-page">
          <Prose>
            <h2>What we collect</h2>
            <ul>
              <li><strong>Account data:</strong> name, email, phone, and password hash.</li>
              <li><strong>Verification data:</strong> government ID, a selfie check, and — for higher-value transactions — proof of funds. Stored encrypted and access-logged.</li>
              <li><strong>Transaction data:</strong> bids, purchases, payouts, and messages with the other party.</li>
              <li><strong>Usage data:</strong> device, approximate location, and pages viewed, to keep the service secure and improve it.</li>
            </ul>
            <h2>How we use it</h2>
            <ul>
              <li>To run auctions, process payments, and complete transfers.</li>
              <li>To verify identity and prevent fraud and money laundering.</li>
              <li>To send transactional alerts (outbid, ending soon, payment) and, with your consent, saved-search and marketing emails.</li>
              <li>To meet legal and regulatory obligations in Lebanon.</li>
            </ul>
            <h2>Who we share it with</h2>
            <p>
              Payment and escrow partners, our identity-verification provider, the other party to your transaction (limited
              to what is needed to complete it), and authorities where legally required. We do not sell your data.
            </p>
            <h2>Retention</h2>
            <p>
              Transaction records are kept for the period required by Lebanese commercial and tax law. Verification
              documents are deleted after the required retention period. You can close your account at any time.
            </p>
            <h2>Your choices</h2>
            <ul>
              <li>Access, correct, or export your data from account settings or by emailing privacy@carsouq.lb.</li>
              <li>Opt out of marketing at any time — transactional alerts remain while you have active bids or listings.</li>
              <li>Manage cookies through your browser; essential cookies are required to sign in and bid.</li>
            </ul>
            <h2>Security</h2>
            <p>
              Data is encrypted in transit and at rest. Access to verification documents is restricted and logged. Report
              a concern to security@carsouq.lb.
            </p>
            <h2>Contact</h2>
            <p>Data controller: CarSouq SAL, Beirut. Email privacy@carsouq.lb.</p>
          </Prose>
        </div>
      </section>
    </>
  );
}
