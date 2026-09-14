"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import Logo from "./Logo";
import LocaleCurrencyMenu from "./LocaleCurrencyMenu";
import ThemeToggle from "./ThemeToggle";
import { IconBell, IconMenu, IconX, IconGavel, IconChevronRight } from "@/components/ui/icons";

/** Routes that supply their own header/footer. */
export const HIDE_CHROME = ["/signin", "/signup"];

const NAV: { href: string; key: string }[] = [
  { href: "/auctions", key: "nav.auctions" },
  { href: "/how-it-works", key: "nav.howItWorks" },
  { href: "/sell", key: "nav.sell" },
  { href: "/fees", key: "nav.fees" },
  { href: "/help", key: "nav.help" },
];

export default function Navbar() {
  const { t } = useI18n();
  const { unreadCount } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Auth routes render their own chrome.
  if (HIDE_CHROME.some((p) => pathname.startsWith(p))) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
        scrolled ? "border-b border-line glass shadow-[var(--shadow-xs)]" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 focus-ring ${
                    active ? "text-brand-2" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t(item.key)}
                  <span
                    className={`pointer-events-none absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-brand to-brand-3 transition-transform duration-400 [transition-timing-function:var(--ease-out-expo)] ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden md:block">
            <LocaleCurrencyMenu />
          </div>
          <ThemeToggle className="hidden sm:grid" />
          <Link
            href="/dashboard/buyer"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink-soft transition-all duration-300 hover:border-brand-2/50 hover:text-brand-2 focus-ring"
            aria-label={t("dash.notifications")}
          >
            <IconBell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -end-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-danger to-danger px-1 text-[10px] font-bold text-white ring-2 ring-bg">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link href="/signin" className="btn btn-ghost btn-sm hidden md:inline-flex">
            {t("nav.signIn")}
          </Link>
          <Link href="/auctions" className="btn btn-primary btn-sm hidden sm:inline-flex">
            <IconGavel className="h-4 w-4" />
            <span className="hidden lg:inline">{t("cta.browse")}</span>
            <span className="lg:hidden">{t("nav.auctions")}</span>
          </Link>

          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-brand-2/50 lg:hidden focus-ring"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <IconX className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-line bg-bg transition-all duration-400 [transition-timing-function:var(--ease-out-expo)] lg:hidden ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="container-page space-y-1.5 py-6">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
              className={`flex items-center justify-between rounded-[var(--radius-sm)] border border-line bg-surface px-4 py-3.5 text-[15px] font-semibold text-ink transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            >
              {t(item.key)}
              <IconChevronRight className="h-4 w-4 text-muted rtl:rotate-180" />
            </Link>
          ))}

          <div className="grid grid-cols-2 gap-2 pt-4">
            <Link href="/dashboard/buyer" className="btn btn-secondary btn-sm">
              {t("nav.buyerDashboard")}
            </Link>
            <Link href="/dashboard/seller" className="btn btn-secondary btn-sm">
              {t("nav.sellerDashboard")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/signin" className="btn btn-secondary btn-sm">
              {t("nav.signIn")}
            </Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              {t("nav.register")}
            </Link>
          </div>

          <div className="flex items-center justify-between gap-2 pt-4">
            <LocaleCurrencyMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
