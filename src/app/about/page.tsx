import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";
import { STATS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "CarSouq is Lebanon's premium car auction marketplace — verified vehicles, transparent bidding, and secure payments.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About CarSouq"
        title="A car auction Lebanon can actually trust"
        subtitle="We started CarSouq because buying a used car here too often meant guesswork, pressure, and no recourse. We thought the whole thing could be fairer, faster, and more transparent."
      />
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[2fr_1fr]">
          <Prose>
            <p>
              CarSouq is an online auction marketplace for cars in Lebanon. Every vehicle is independently inspected,
              every bid is public and timestamped, and every payment runs through escrow so neither side has to trust
              a stranger with cash.
            </p>
            <h2>What we believe</h2>
            <ul>
              <li><strong>Disclosure beats persuasion.</strong> A complete inspection and honest photos sell a car better than a sales pitch.</li>
              <li><strong>Transparent auctions are fairer auctions.</strong> No hidden bids, no bids placed by us, clear reserve status.</li>
              <li><strong>Money should be safe until the car changes hands.</strong> Escrow protects the buyer and guarantees the seller gets paid.</li>
              <li><strong>Local matters.</strong> Lebanese pricing context, Lebanese locations, and a team you can reach in Beirut.</li>
            </ul>
            <h2>Who uses CarSouq</h2>
            <p>
              Private buyers and sellers, franchised and independent dealers, fleet and leasing companies remarketing
              end-of-term vehicles, and diaspora buyers purchasing from abroad with a local representative for collection.
            </p>
            <h2>Regulation &amp; standards</h2>
            <p>
              CarSouq SAL is a registered auction operator. We follow anti-money-laundering identity checks on
              higher-value transactions and keep a permanent, auditable record of every auction.
            </p>
          </Prose>
          <div className="space-y-3">
            {STATS.map((s) => (
              <div key={s.label} className="panel p-5">
                <p className="font-display text-2xl font-extrabold text-ink">
                  <bdi dir="ltr">{s.value}</bdi>
                </p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
            <div className="panel p-5 text-sm text-ink-soft">
              <p className="font-semibold text-ink">Head office</p>
              <p className="mt-1">Beirut Digital District, Building 1294<br />Bechara El Khoury, Beirut, Lebanon</p>
              <p className="mt-2">+961 1 000 111 · hello@carsouq.lb</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
