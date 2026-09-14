import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import ContactForm from "@/components/site/ContactForm";
import { IconMapPin, IconClock, IconShield } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the CarSouq team in Beirut by phone, WhatsApp or email.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Talk to a person in Beirut" subtitle="Real local support for buyers, sellers, and anyone considering their first auction." />
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <div className="panel p-5">
              <h3 className="text-sm font-semibold text-ink">Support channels</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                <li>Phone · <a href="tel:+9611000111" className="font-medium text-brand-2">+961 1 000 111</a></li>
                <li>WhatsApp · <a href="https://wa.me/9613000111" className="font-medium text-brand-2">+961 3 000 111</a></li>
                <li>Email · <a href="mailto:hello@carsouq.lb" className="font-medium text-brand-2">hello@carsouq.lb</a></li>
                <li>Sellers · <a href="mailto:sell@carsouq.lb" className="font-medium text-brand-2">sell@carsouq.lb</a></li>
              </ul>
            </div>
            <div className="panel p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <IconMapPin className="h-4 w-4 text-brand-2" /> Office
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Beirut Digital District, Building 1294<br />
                Bechara El Khoury, Beirut, Lebanon
              </p>
            </div>
            <div className="panel p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <IconClock className="h-4 w-4 text-brand-2" /> Hours
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Mon–Fri 9:00–18:00 · Sat 10:00–14:00<br />
                Auction closings are supported 7 days a week.
              </p>
            </div>
            <div className="panel p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <IconShield className="h-4 w-4 text-brand-2" /> Security
              </p>
              <p className="mt-2 text-sm text-muted">
                We will never ask for payment outside the platform or for your password. Report anything suspicious to
                security@carsouq.lb.
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
