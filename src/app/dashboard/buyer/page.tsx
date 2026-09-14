"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { VEHICLES, getVehicle } from "@/lib/data";
import { relativeTime } from "@/lib/format";
import DashboardShell, { DashCard, EmptyState, type DashSection } from "@/components/dashboard/DashboardShell";
import VehicleCard from "@/components/vehicle/VehicleCard";
import Money from "@/components/ui/Money";
import Countdown from "@/components/ui/Countdown";
import {
  IconGauge,
  IconHeart,
  IconGavel,
  IconClock,
  IconCheck,
  IconWallet,
  IconSearch,
  IconBell,
  IconShield,
} from "@/components/ui/icons";

export default function BuyerDashboard() {
  const { t } = useI18n();
  const { watchlist, bids, savedSearches, removeSavedSearch, markAllRead, unreadCount, hydrated } = useStore();

  const watched = VEHICLES.filter((v) => watchlist.includes(v.id));
  const activeBids = bids
    .map((b) => ({ b, v: getVehicle(b.vehicleId)! }))
    .filter((x) => Boolean(x.v));
  const won = VEHICLES.filter((v) => v.auctionStatus === "ended").slice(0, 1);

  const sections: DashSection[] = [
    {
      id: "overview",
      label: t("dash.overview"),
      icon: IconGauge,
      render: () => (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashCard label={t("dash.watched")} value={hydrated ? watched.length : "—"} hint="vehicles" />
            <DashCard label={t("dash.activeBids")} value={hydrated ? activeBids.length : "—"} hint="live auctions" />
            <DashCard label={t("dash.won")} value={won.length} hint="awaiting payment" />
            <DashCard label={t("dash.alerts")} value={unreadCount} hint="unread" />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">{t("dash.activeBids")}</h3>
              <Link href="/auctions" className="text-xs font-semibold text-brand-2 hover:underline">{t("cta.viewAll")}</Link>
            </div>
            {hydrated && activeBids.length ? (
              <div className="panel divide-line">
                {activeBids.map(({ b, v }) => (
                  <div key={v.id} className="flex items-center justify-between gap-3 p-4">
                    <Link href={`/vehicles/${v.id}`} className="min-w-0 text-sm font-medium text-ink hover:text-brand-2">
                      {v.year} {v.make} {v.model}
                    </Link>
                    <div className="flex shrink-0 items-center gap-4 text-sm">
                      <span className="text-ink-soft tabular-nums"><Money usd={b.amount} /></span>
                      <span className="badge badge-success"><IconCheck className="h-3 w-3" />Highest</span>
                      <Countdown endsInHours={v.endsInHours} variant="inline" className="hidden text-xs sm:inline" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No active bids" body="Place a bid on a live auction and it will show up here with its status." />
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">{t("dash.notifications")}</h3>
              <button onClick={markAllRead} className="text-xs font-semibold text-brand-2 hover:underline">Mark all read</button>
            </div>
            <NotificationList />
          </div>
        </div>
      ),
    },
    {
      id: "watched",
      label: t("dash.watched"),
      icon: IconHeart,
      badge: hydrated ? watched.length : undefined,
      render: () =>
        hydrated && watched.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {watched.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <EmptyState title="Your watchlist is empty" body="Tap the heart on any vehicle to save it and get alerts as its auction progresses." />
        ),
    },
    {
      id: "bids",
      label: t("dash.activeBids"),
      icon: IconGavel,
      render: () =>
        hydrated && activeBids.length ? (
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="p-3 text-start">Vehicle</th>
                  <th className="p-3 text-start">Your bid</th>
                  <th className="p-3 text-start">Status</th>
                  <th className="p-3 text-start">Ends</th>
                </tr>
              </thead>
              <tbody className="divide-line">
                {activeBids.map(({ b, v }) => (
                  <tr key={v.id}>
                    <td className="p-3">
                      <Link href={`/vehicles/${v.id}`} className="font-medium text-ink hover:text-brand-2">
                        {v.year} {v.make} {v.model}
                      </Link>
                    </td>
                    <td className="p-3 tabular-nums text-ink-soft"><Money usd={b.amount} /></td>
                    <td className="p-3"><span className="badge badge-success">Highest bidder</span></td>
                    <td className="p-3"><Countdown endsInHours={v.endsInHours} variant="inline" className="text-xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No active bids" body="When you bid on a live auction, track it here." />
        ),
    },
    {
      id: "history",
      label: t("dash.bidHistory"),
      icon: IconClock,
      render: () => (
        <div className="panel divide-line">
          {[
            { v: "2020 BMW 330i M Sport", amount: 24800, when: "Outbid", tone: "danger" },
            { v: "2021 Mercedes-Benz C 300", amount: 26900, when: "Won", tone: "success" },
            { v: "2019 VW Golf GTI", amount: 17800, when: "Outbid", tone: "danger" },
            { v: "2022 Hyundai Tucson", amount: 20500, when: "Reserve not met", tone: "muted" },
          ].map((r) => (
            <div key={r.v} className="flex items-center justify-between p-4 text-sm">
              <span className="text-ink-soft">{r.v}</span>
              <span className="flex items-center gap-3">
                <span className="tabular-nums text-ink"><Money usd={r.amount} /></span>
                <span
                  className={`badge ${r.tone === "success" ? "badge-success" : r.tone === "danger" ? "badge-live" : ""}`}
                >
                  {r.when}
                </span>
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "won",
      label: t("dash.won"),
      icon: IconCheck,
      render: () =>
        won.length ? (
          <div className="space-y-4">
            {won.map((v) => (
              <div key={v.id} className="panel flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-sm font-semibold text-ink">{v.year} {v.make} {v.model}</p>
                  <p className="text-xs text-muted">Hammer <Money usd={v.currentBid} /> · won 2 days ago</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge badge-warning">Payment due</span>
                  <button className="btn btn-primary btn-sm">Pay into escrow</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No won auctions yet" body="Auctions you win will appear here with collection and payment steps." />
        ),
    },
    {
      id: "payments",
      label: t("dash.payments"),
      icon: IconWallet,
      render: () => (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <DashCard label="Escrow balance" value={<Money usd={0} />} />
            <DashCard label="Due now" value={<Money usd={18900} />} hint="2016 Chevrolet Tahoe" />
            <DashCard label="Lifetime spend" value={<Money usd={51700} />} />
          </div>
          <div className="panel divide-line text-sm">
            {[
              { d: "2026-09-04", label: "Buyer's premium — C 300", amt: 1211 },
              { d: "2026-09-04", label: "Hammer price — C 300", amt: 26900 },
              { d: "2026-08-19", label: "Documentation fee — Tucson", amt: 150 },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between p-4">
                <span className="text-ink-soft">{p.label}</span>
                <span className="flex items-center gap-4">
                  <span className="text-xs text-muted">{p.d}</span>
                  <span className="tabular-nums text-ink"><Money usd={p.amt} /></span>
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted">Paid by bank transfer, OMT or Whish. Card payments available for fees under $2,000.</p>
        </div>
      ),
    },
    {
      id: "searches",
      label: t("dash.savedSearches"),
      icon: IconSearch,
      render: () => (
        <div className="space-y-3">
          {savedSearches.map((s) => (
            <div key={s.id} className="panel flex items-center justify-between gap-3 p-4">
              <div>
                <Link href={`/auctions${s.query}`} className="text-sm font-medium text-ink hover:text-brand-2">
                  {s.label}
                </Link>
                <p className="text-xs text-muted">{s.alerts ? "Email alerts on" : "Alerts off"}</p>
              </div>
              <button onClick={() => removeSavedSearch(s.id)} className="btn btn-ghost btn-sm">Remove</button>
            </div>
          ))}
          {savedSearches.length === 0 && (
            <EmptyState title="No saved searches" body="Save a filter set from the auctions page to get alerts on new matches." />
          )}
        </div>
      ),
    },
    {
      id: "alerts",
      label: t("dash.alerts"),
      icon: IconBell,
      badge: unreadCount || undefined,
      render: () => (
        <div className="space-y-3">
          <button onClick={markAllRead} className="btn btn-secondary btn-sm">Mark all read</button>
          <NotificationList showAll />
        </div>
      ),
    },
    {
      id: "verification",
      label: t("dash.verification"),
      icon: IconShield,
      render: () => (
        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <IconShield className="h-6 w-6 text-brand-2" />
            <div>
              <p className="text-sm font-semibold text-ink">Identity verification</p>
              <p className="text-xs text-muted">Required to place bids above $10,000</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["Email confirmed", true],
              ["Phone (+961) confirmed", true],
              ["Government ID uploaded", true],
              ["Selfie check", false],
              ["Payment method on file", false],
            ].map(([label, done]) => (
              <li key={label as string} className="flex items-center gap-2 text-ink-soft">
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full ${done ? "bg-success/15 text-success" : "bg-surface-2 text-muted"}`}
                >
                  <IconCheck className="h-3 w-3" />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary btn-sm mt-5">{t("verify.action")}</button>
        </div>
      ),
    },
  ];

  return (
    <DashboardShell
      title={t("dash.buyer.title")}
      role={t("nav.dashboard")}
      otherHref="/dashboard/seller"
      otherLabel={t("nav.sellerDashboard")}
      sections={sections}
      user={{ name: "Rami Khoury", email: "rami.khoury@example.lb", verified: true }}
    />
  );
}

function NotificationList({ showAll = false }: { showAll?: boolean }) {
  const { notifications } = useStore();
  const { locale } = useI18n();
  const list = showAll ? notifications : notifications.slice(0, 4);
  const tone: Record<string, string> = {
    outbid: "badge-live",
    ending: "badge-warning",
    won: "badge-success",
    document: "badge-brand",
    payment: "badge-warning",
  };
  return (
    <div className="panel divide-line">
      {list.map((n) => (
        <div key={n.id} className={`flex gap-3 p-4 ${n.read ? "" : "bg-brand/[0.03]"}`}>
          <span className={`badge ${tone[n.kind]} h-fit shrink-0`}>{n.kind}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">{n.title}</p>
            <p className="text-xs text-ink-soft">{n.body}</p>
            <p className="mt-0.5 text-[11px] text-muted">{relativeTime(n.minutesAgo, locale)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
