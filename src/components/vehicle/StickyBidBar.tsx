"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import Money from "@/components/ui/Money";
import Countdown from "@/components/ui/Countdown";
import { IconGavel } from "@/components/ui/icons";

export default function StickyBidBar({
  currentBid,
  endsInHours,
  ended,
}: {
  currentBid: number;
  endsInHours: number;
  ended: boolean;
}) {
  const [show, setShow] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line glass p-3 shadow-[0_-8px_28px_-16px_rgba(0,0,0,.45)] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container-page flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted">
            {t("common.currentBid")}
          </p>
          <p className="font-display text-[1.05rem] font-extrabold leading-tight text-ink">
            <Money usd={currentBid} />
          </p>
        </div>
        {!ended && <Countdown endsInHours={endsInHours} variant="inline" className="shrink-0 text-xs" />}
        <a
          href="#bid-panel"
          className="btn btn-primary btn-sm shrink-0"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("bid-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <IconGavel className="h-4 w-4" />
          {ended ? t("cta.viewVehicle") : t("vehicle.placeBidCta")}
        </a>
      </div>
    </div>
  );
}
