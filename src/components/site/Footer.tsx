"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { LogoLockup } from "./Logo";
import { ThemeSegmented } from "./ThemeToggle";
import { HIDE_CHROME } from "./Navbar";
import { IconShield, IconScan, IconWallet, IconPhone, IconMail, IconMapPin } from "@/components/ui/icons";

export default function Footer() {
  const { t } = useI18n();
  const pathname = usePathname();
  const year = 2026;

  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("footer.marketplace"),
      links: [
        { label: t("nav.auctions"), href: "/auctions" },
        { label: t("nav.sell"), href: "/sell" },
        { label: t("nav.buyerDashboard"), href: "/dashboard/buyer" },
        { label: t("nav.sellerDashboard"), href: "/dashboard/seller" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("nav.about"), href: "/about" },
        { label: t("nav.howItWorks"), href: "/how-it-works" },
        { label: t("nav.fees"), href: "/fees" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("nav.help"), href: "/help" },
        { label: "Buyer guide", href: "/buyer-guide" },
        { label: "Seller guide", href: "/seller-guide" },
        { label: t("nav.signIn"), href: "/signin" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Auction rules", href: "/terms" },
        { label: "Anti-fraud policy", href: "/help" },
      ],
    },
  ];

  if (HIDE_CHROME.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-line bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-2/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 start-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-[0.13] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-brand-2), transparent 70%)" }}
      />

      <div className="container-page relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <LogoLockup />
            <p className="mt-5 text-sm leading-relaxed text-muted">{t("footer.tagline")}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="badge"><IconShield className="h-3.5 w-3.5 text-brand-2" /> Escrow protected</span>
              <span className="badge"><IconScan className="h-3.5 w-3.5 text-brand-2" /> 212-point inspected</span>
              <span className="badge"><IconWallet className="h-3.5 w-3.5 text-brand-2" /> USD &amp; LBP</span>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-brand-2" />
                <a href="tel:+9611000111" className="transition-colors hover:text-ink">+961 1 000 111</a>
              </li>
              <li className="flex items-center gap-2">
                <IconMail className="h-4 w-4 text-brand-2" />
                <a href="mailto:hello@carsouq.lb" className="transition-colors hover:text-ink">hello@carsouq.lb</a>
              </li>
              <li className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4 text-brand-2" />
                Beirut Digital District, Beirut
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((col) => (
              <div key={col.title}>
                <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors duration-300 hover:text-brand-2"
                      >
                        <span className="h-px w-0 bg-brand-2 transition-all duration-300 group-hover:w-3" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-line pt-7 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {year} CarSouq SAL — {t("footer.rights")}</p>
          <div className="flex flex-wrap items-center gap-5">
            <p>{t("footer.madeIn")}</p>
            <div className="w-44">
              <ThemeSegmented />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
