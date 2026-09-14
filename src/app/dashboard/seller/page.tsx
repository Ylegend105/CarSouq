"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { VEHICLES } from "@/lib/data";
import { dealScore } from "@/lib/ai";
import DashboardShell, { DashCard, type DashSection } from "@/components/dashboard/DashboardShell";
import Money from "@/components/ui/Money";
import Countdown from "@/components/ui/Countdown";
import CarImage from "@/components/CarImage";
import {
  IconGauge,
  IconCar,
  IconTrendingUp,
  IconUsers,
  IconWallet,
  IconSparkles,
  IconBell,
  IconGavel,
} from "@/components/ui/icons";

const MY_LISTINGS = ["002", "007", "010", "015"];

export default function SellerDashboard() {
  const { t } = useI18n();
  const listings = VEHICLES.filter((v) => MY_LISTINGS.includes(v.id));
  const totalBids = listings.reduce((s, v) => s + v.bidCount, 0);
  const totalWatchers = listings.reduce((s, v) => s + v.bidderCount * 3 + 8, 0);
  const projected = listings.reduce((s, v) => s + Math.max(v.currentBid, v.reservePrice), 0);

  const sections: DashSection[] = [
    {
      id: "overview",
      label: t("dash.overview"),
      icon: IconGauge,
      render: () => (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashCard label={t("dash.listings")} value={listings.length} hint="live now" />
            <DashCard label="Total bids" value={totalBids} hint="across your lots" />
            <DashCard label="Watchers" value={totalWatchers} hint="following your cars" />
            <DashCard label="Projected proceeds" value={<Money usd={projected} compact />} hint="if reserves clear" />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">{t("dash.performance")}</h3>
            <div className="panel divide-line">
              {listings.map((v) => {
                const pct = Math.min(100, Math.round((v.currentBid / v.reservePrice) * 100));
                return (
                  <div key={v.id} className="flex items-center gap-4 p-4">
                    <CarImage from={v.accentFrom} to={v.accentTo} bodyType={v.bodyType} seed={Number(v.id)} className="h-14 w-20 shrink-0 rounded-[var(--radius-xs)]" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/vehicles/${v.id}`} className="text-sm font-medium text-ink hover:text-brand-2">
                        {v.year} {v.make} {v.model}
                      </Link>
                      <div className="mt-1.5 h-1.5 rounded-full bg-line">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: pct >= 100 ? "var(--color-success)" : "var(--color-brand)" }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        <Money usd={v.currentBid} /> of <Money usd={v.reservePrice} /> reserve · {pct}%
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-end text-xs text-muted sm:block">
                      <Countdown endsInHours={v.endsInHours} variant="inline" />
                      <p>{v.bidCount} bids</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "listings",
      label: t("dash.listings"),
      icon: IconCar,
      badge: listings.length,
      render: () => (
        <div className="space-y-4">
          <Link href="/sell" className="btn btn-primary btn-sm">+ New listing</Link>
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="p-3 text-start">Vehicle</th>
                  <th className="p-3 text-start">Current bid</th>
                  <th className="p-3 text-start">Reserve</th>
                  <th className="p-3 text-start">Status</th>
                  <th className="p-3 text-start">Ends</th>
                </tr>
              </thead>
              <tbody className="divide-line">
                {listings.map((v) => (
                  <tr key={v.id}>
                    <td className="p-3 font-medium text-ink">{v.year} {v.make} {v.model}</td>
                    <td className="p-3 tabular-nums text-ink-soft"><Money usd={v.currentBid} /></td>
                    <td className="p-3 tabular-nums text-ink-soft"><Money usd={v.reservePrice} /></td>
                    <td className="p-3">
                      <span className={`badge ${v.reserveMet ? "badge-success" : "badge-warning"}`}>
                        {v.reserveMet ? "Reserve met" : "Below reserve"}
                      </span>
                    </td>
                    <td className="p-3"><Countdown endsInHours={v.endsInHours} variant="inline" className="text-xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "interest",
      label: t("dash.bidderInterest"),
      icon: IconUsers,
      render: () => (
        <div className="grid gap-4 sm:grid-cols-2">
          {listings.map((v) => (
            <div key={v.id} className="panel p-4">
              <p className="text-sm font-semibold text-ink">{v.year} {v.make} {v.model}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div><p className="text-lg font-semibold text-ink">{v.bidderCount}</p><p className="text-[11px] text-muted">bidders</p></div>
                <div><p className="text-lg font-semibold text-ink">{v.bidderCount * 3 + 8}</p><p className="text-[11px] text-muted">watchers</p></div>
                <div><p className="text-lg font-semibold text-ink">{280 + Number(v.id) * 41}</p><p className="text-[11px] text-muted">views</p></div>
              </div>
              <p className="mt-3 text-xs text-muted">
                Peak interest {v.endsInHours < 12 ? "now — final hours" : "expected in the last 24 hours"}.
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "reserve",
      label: "Reserve controls",
      icon: IconGavel,
      render: () => (
        <div className="space-y-4">
          <p className="text-sm text-muted">Adjust reserves up to the final hour. Lowering a reserve can trigger immediate bidding.</p>
          {listings.map((v) => (
            <div key={v.id} className="panel flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-ink">{v.year} {v.make} {v.model}</p>
                <p className="text-xs text-muted">Current bid <Money usd={v.currentBid} /></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Reserve</span>
                <input className="input !w-32 tabular-nums" defaultValue={v.reservePrice} />
                <button className="btn btn-secondary btn-sm">Update</button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "offers",
      label: t("dash.offers"),
      icon: IconWallet,
      render: () => (
        <div className="panel divide-line">
          {[
            { v: "2020 Porsche Macan", buyer: "bidder_2290", amount: 43800, note: "Post-auction offer — reserve was $45,000" },
            { v: "2017 Nissan Patrol", buyer: "bidder_8123", amount: 31000, note: "Direct offer, subject to inspection" },
          ].map((o) => (
            <div key={o.v} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium text-ink">{o.v}</p>
                <p className="text-xs text-muted">{o.buyer} · {o.note}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink"><Money usd={o.amount} /></span>
                <button className="btn btn-secondary btn-sm">Decline</button>
                <button className="btn btn-primary btn-sm">Accept</button>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "payouts",
      label: t("dash.payouts"),
      icon: IconTrendingUp,
      render: () => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <DashCard label="Cleared" value={<Money usd={38400} />} hint="last 90 days" />
            <DashCard label="In escrow" value={<Money usd={24800} />} hint="buyer collecting" />
            <DashCard label="Next payout" value="1 business day" />
          </div>
          <div className="panel divide-line text-sm">
            {[
              { d: "2026-09-05", v: "2019 BMW 320i", amt: 22100, status: "Paid" },
              { d: "2026-08-22", v: "2021 Kia Sportage", amt: 16300, status: "Paid" },
              { d: "Pending", v: "2020 BMW 330i", amt: 23600, status: "In escrow" },
            ].map((p) => (
              <div key={p.v} className="flex items-center justify-between p-4">
                <span className="text-ink-soft">{p.v}</span>
                <span className="flex items-center gap-4">
                  <span className="text-xs text-muted">{p.d}</span>
                  <span className="tabular-nums text-ink"><Money usd={p.amt} /></span>
                  <span className={`badge ${p.status === "Paid" ? "badge-success" : "badge-warning"}`}>{p.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "ai",
      label: "AI recommendations",
      icon: IconSparkles,
      render: () => (
        <div className="space-y-3">
          {listings.map((v) => {
            const ds = dealScore(v);
            return (
              <div key={v.id} className="panel p-4">
                <p className="text-sm font-semibold text-ink">{v.year} {v.make} {v.model}</p>
                <ul className="mt-2 space-y-1.5 text-xs text-ink-soft">
                  <li className="flex gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-2" />
                    {v.reserveMet
                      ? "Reserve is met — no action needed. Let the timer run."
                      : `Consider lowering the reserve by ~$${Math.round((v.reservePrice - v.currentBid) / 2).toLocaleString()} to spark competition.`}
                  </li>
                  <li className="flex gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-2" />
                    Buyer-side Deal Score is {ds.score}/100 ({ds.verdict}) — {ds.score >= 75 ? "attractive to buyers, expect late bidding" : "add photos of the service book to lift confidence"}.
                  </li>
                  <li className="flex gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-2" />
                    Add a short walk-around video — listings with video get ~22% more bids in this segment.
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: "notifications",
      label: t("dash.notifications"),
      icon: IconBell,
      render: () => (
        <div className="panel divide-line text-sm">
          {[
            { t: "New high bid on 2020 Porsche Macan", b: "$41,200 from bidder_2290 · reserve $45,000", tone: "badge-brand" },
            { t: "2017 Nissan Patrol ends in 15 hours", b: "Reserve not yet met — 24 watchers", tone: "badge-warning" },
            { t: "Document requested — 2022 Land Cruiser", b: "A bidder asked for the customs clearance paper", tone: "badge-brand" },
            { t: "Payout cleared — 2019 BMW 320i", b: "$22,100 transferred to your account ending 4471", tone: "badge-success" },
          ].map((n) => (
            <div key={n.t} className="flex gap-3 p-4">
              <span className={`badge ${n.tone} h-fit shrink-0`}>alert</span>
              <div>
                <p className="font-medium text-ink">{n.t}</p>
                <p className="text-xs text-ink-soft">{n.b}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      title={t("dash.seller.title")}
      role={t("nav.dashboard")}
      otherHref="/dashboard/buyer"
      otherLabel={t("nav.buyerDashboard")}
      sections={sections}
      user={{ name: "Cedars Auto Gallery", email: "sales@cedarsauto.lb", verified: true }}
    />
  );
}
