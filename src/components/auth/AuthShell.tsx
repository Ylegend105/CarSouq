"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Logo from "@/components/site/Logo";
import ThemeToggle from "@/components/site/ThemeToggle";
import CarImage from "@/components/CarImage";
import { IconArrowLeft, IconShield, IconScan, IconGavel, IconQuote, IconStar } from "@/components/ui/icons";

const PROOF = [
  { Icon: IconScan, text: "212-point inspection on every car" },
  { Icon: IconShield, text: "Escrow-protected payments" },
  { Icon: IconGavel, text: "Transparent, timestamped bidding" },
];

export default function AuthShell({
  children,
  side = "signin",
}: {
  children: React.ReactNode;
  side?: "signin" | "signup";
}) {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      {/* Marketing copy in this panel is English-only, so it always reads left-to-right
          even when the app is in Arabic — otherwise bidi reorders strings like "212-point". */}
      <aside
        dir="ltr"
        className="relative hidden overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-2 lg:flex lg:flex-col lg:justify-between"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 12%, rgba(255,255,255,.32), transparent 42%), radial-gradient(circle at 88% 78%, rgba(255,255,255,.22), transparent 46%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 75%)",
          }}
        />

        <div className="relative p-12">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 backdrop-blur">
              <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
                <g stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 42c0-4 2-6.5 5.5-8l13-5c4-3.5 9-6 14.5-6.5 4.5-.4 8 .7 10.5 3.2" />
                  <path d="M11 42h6M27 42h12M49 42h4" />
                </g>
                <circle cx="22" cy="42.5" r="5.2" stroke="#fff" strokeWidth="4.2" />
                <circle cx="44" cy="42.5" r="5.2" stroke="#fff" strokeWidth="4.2" />
                <g transform="rotate(-20 40 18)">
                  <rect x="27" y="9" width="24" height="13" rx="4" fill="#fff" />
                  <rect x="51" y="13" width="14" height="4.6" rx="2.3" fill="#fff" />
                </g>
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl font-extrabold tracking-tight">CarSouq</span>
              <span className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/70">
                Online Car Auctions
              </span>
            </span>
          </Link>
        </div>

        <div className="relative flex flex-1 flex-col justify-center px-12">
          <div className="animate-float">
            <CarImage
              from="#ffffff"
              to="#9fd8ff"
              bodyType="Coupe"
              seed={3}
              className="aspect-[16/8] w-full rounded-[var(--radius-lg)] !bg-white/10 shadow-2xl backdrop-blur-sm"
            />
          </div>

          <figure className="mt-10 max-w-md">
            <IconQuote className="h-7 w-7 text-white/40" />
            <blockquote className="mt-3 font-display text-[1.35rem] font-semibold leading-snug text-white">
              The inspection report was more detailed than anything a dealer showed me. I bid from my phone and won —
              the car was exactly as described.
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 font-semibold text-white">
                R
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">Rami Khoury</span>
                <span className="block text-xs text-white/70">Bought a 2021 Mercedes C 300 · Beirut</span>
              </span>
              <span className="ms-auto flex gap-0.5 text-white">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </span>
            </figcaption>
          </figure>
        </div>

        <div className="relative p-12">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {PROOF.map(({ Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-2 text-xs font-medium text-white/85">
                <Icon className="h-4 w-4" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ---------- Form panel ---------- */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-brand-2"
          >
            <IconArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("auth.back")}
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-[26rem]">
            <div className="mb-8 lg:hidden">
              <Logo size="lg" />
            </div>
            {children}
          </div>
        </div>

        <p className="px-6 pb-8 text-center text-xs text-muted sm:px-10">
          {side === "signin" ? (
            <>
              {t("auth.noAccount")}{" "}
              <Link href="/signup" className="font-semibold text-brand-2 hover:underline">
                {t("auth.createOne")}
              </Link>
            </>
          ) : (
            <>
              {t("auth.haveAccount")}{" "}
              <Link href="/signin" className="font-semibold text-brand-2 hover:underline">
                {t("auth.signInLink")}
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
