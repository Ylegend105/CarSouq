"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VEHICLES, MAKES, BODY_TYPES, LEBANON_LOCATIONS } from "@/lib/data";
import type { Vehicle } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import VehicleCard from "@/components/vehicle/VehicleCard";
import { VehicleGridSkeleton } from "@/components/ui/Skeleton";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import {
  IconSearch,
  IconX,
  IconChevronDown,
  IconGrid,
  IconRows,
  IconSliders,
} from "@/components/ui/icons";

type SortKey = "newest" | "priceLow" | "bidHigh" | "endingSoon" | "mileage" | "yearNew";

interface Filters {
  q: string;
  make: string;
  model: string;
  yearMin: number;
  priceMax: number;
  mileageMax: number;
  bodyType: string;
  fuel: string;
  transmission: string;
  conditionMin: number;
  location: string;
  status: string;
  endingSoon: boolean;
}

const DEFAULTS: Filters = {
  q: "",
  make: "",
  model: "",
  yearMin: 2014,
  priceMax: 60000,
  mileageMax: 160000,
  bodyType: "",
  fuel: "",
  transmission: "",
  conditionMin: 0,
  location: "",
  status: "",
  endingSoon: false,
};

const PAGE = 9;

export default function InventoryView() {
  const { t } = useI18n();
  const { addSavedSearch } = useStore();
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const [sort, setSort] = useState<SortKey>("endingSoon");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(PAGE);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => {
    setFilters((f) => ({ ...f, [k]: v }));
    setVisible(PAGE);
  };

  const models = useMemo(() => {
    const src = filters.make ? VEHICLES.filter((v) => v.make === filters.make) : VEHICLES;
    return [...new Set(src.map((v) => v.model))].sort();
  }, [filters.make]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const out = VEHICLES.filter((v) => {
      if (q && !`${v.year} ${v.make} ${v.model} ${v.trim} ${v.bodyType} ${v.location}`.toLowerCase().includes(q))
        return false;
      if (filters.make && v.make !== filters.make) return false;
      if (filters.model && v.model !== filters.model) return false;
      if (v.year < filters.yearMin) return false;
      if (v.currentBid > filters.priceMax) return false;
      if (v.mileageKm > filters.mileageMax) return false;
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false;
      if (filters.fuel && v.fuel !== filters.fuel) return false;
      if (filters.transmission && v.transmission !== filters.transmission) return false;
      if (v.conditionScore < filters.conditionMin) return false;
      if (filters.location && v.location !== filters.location) return false;
      if (filters.status && v.auctionStatus !== filters.status) return false;
      if (filters.endingSoon && (v.endsInHours > 24 || v.auctionStatus !== "live")) return false;
      return true;
    });

    const cmp: Record<SortKey, (a: Vehicle, b: Vehicle) => number> = {
      newest: (a, b) => a.listedDaysAgo - b.listedDaysAgo,
      priceLow: (a, b) => a.currentBid - b.currentBid,
      bidHigh: (a, b) => b.currentBid - a.currentBid,
      endingSoon: (a, b) => endValue(a) - endValue(b),
      mileage: (a, b) => a.mileageKm - b.mileageKm,
      yearNew: (a, b) => b.year - a.year,
    };
    return [...out].sort(cmp[sort]);
  }, [filters, sort]);

  // Brief skeleton state whenever the query changes, to exercise loading UI.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(id);
  }, [filters, sort]);

  // infinite scroll
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => (v < filtered.length ? v + PAGE : v));
        }
      },
      { rootMargin: "600px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtered.length]);

  const activeCount = countActive(filters);
  const shown = filtered.slice(0, visible);

  const FilterControls = (
    <div className="space-y-5">
      <Field label={t("filter.make")}>
        <select className="select" value={filters.make} onChange={(e) => { set("make", e.target.value); set("model", ""); }}>
          <option value="">{t("filter.anyMake")}</option>
          {MAKES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </Field>
      <Field label={t("filter.model")}>
        <select className="select" value={filters.model} onChange={(e) => set("model", e.target.value)}>
          <option value="">{t("filter.anyModel")}</option>
          {models.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </Field>
      <Field label={`${t("filter.year")} — ${filters.yearMin}+`}>
        <input type="range" min={2012} max={2024} value={filters.yearMin} onChange={(e) => set("yearMin", +e.target.value)} className="w-full accent-[var(--color-brand)]" />
      </Field>
      <Field label={`${t("filter.price")} — ≤ $${filters.priceMax.toLocaleString()}`}>
        <input type="range" min={10000} max={60000} step={1000} value={filters.priceMax} onChange={(e) => set("priceMax", +e.target.value)} className="w-full accent-[var(--color-brand)]" />
      </Field>
      <Field label={`${t("filter.mileage")} — ≤ ${filters.mileageMax.toLocaleString()} km`}>
        <input type="range" min={20000} max={160000} step={5000} value={filters.mileageMax} onChange={(e) => set("mileageMax", +e.target.value)} className="w-full accent-[var(--color-brand)]" />
      </Field>
      <Field label={t("filter.bodyType")}>
        <select className="select" value={filters.bodyType} onChange={(e) => set("bodyType", e.target.value)}>
          <option value="">{t("filter.any")}</option>
          {BODY_TYPES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("filter.fuel")}>
          <select className="select" value={filters.fuel} onChange={(e) => set("fuel", e.target.value)}>
            <option value="">{t("filter.any")}</option>
            {["Petrol", "Diesel", "Hybrid", "Electric"].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Field>
        <Field label={t("filter.transmission")}>
          <select className="select" value={filters.transmission} onChange={(e) => set("transmission", e.target.value)}>
            <option value="">{t("filter.any")}</option>
            {["Automatic", "Manual"].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label={`${t("filter.condition")} — ${filters.conditionMin || "any"}`}>
        <input type="range" min={0} max={95} step={5} value={filters.conditionMin} onChange={(e) => set("conditionMin", +e.target.value)} className="w-full accent-[var(--color-brand)]" />
      </Field>
      <Field label={t("filter.location")}>
        <select className="select" value={filters.location} onChange={(e) => set("location", e.target.value)}>
          <option value="">{t("filter.any")}</option>
          {LEBANON_LOCATIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Field>
      <Field label={t("filter.status")}>
        <select className="select" value={filters.status} onChange={(e) => set("status", e.target.value)}>
          <option value="">{t("filter.any")}</option>
          <option value="live">{t("common.live")}</option>
          <option value="upcoming">{t("common.upcoming")}</option>
          <option value="ended">{t("common.ended")}</option>
        </select>
      </Field>
      <label className="flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-xs)] border border-line-strong p-3 text-sm">
        <input type="checkbox" checked={filters.endingSoon} onChange={(e) => set("endingSoon", e.target.checked)} className="h-4 w-4 accent-[var(--color-brand)]" />
        {t("filter.endingSoon")}
      </label>

      <div className="flex gap-2">
        <button
          onClick={() => { setFilters(DEFAULTS); setVisible(PAGE); }}
          className="btn btn-ghost btn-sm flex-1"
        >
          {t("common.clearAll")}
        </button>
        <button
          onClick={() =>
            addSavedSearch({
              label: buildLabel(filters, t),
              query: "?" + new URLSearchParams(serialize(filters)).toString(),
              alerts: true,
            })
          }
          className="btn btn-secondary btn-sm flex-1"
        >
          Save search
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-page section !py-12">
      <SectionHeading
        eyebrow={t("nav.auctions")}
        title={t("discovery.title")}
        subtitle={t("discovery.subtitle")}
      />

      {/* search + toolbar */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="input ps-9"
            placeholder="Search make, model, city…"
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDrawer(true)} className="btn btn-secondary btn-sm lg:hidden">
            <IconSliders className="h-4 w-4" />
            {t("common.filters")}
            {activeCount > 0 && <span className="badge badge-brand !px-1.5 !py-0">{activeCount}</span>}
          </button>
          <div className="relative">
            <select
              className="select !py-2 !pe-8 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label={t("common.sort")}
            >
              <option value="newest">{t("sort.newest")}</option>
              <option value="priceLow">{t("sort.priceLow")}</option>
              <option value="bidHigh">{t("sort.bidHigh")}</option>
              <option value="endingSoon">{t("sort.endingSoon")}</option>
              <option value="mileage">{t("sort.mileage")}</option>
              <option value="yearNew">{t("sort.yearNew")}</option>
            </select>
          </div>
          <div className="flex gap-1 rounded-full border border-line bg-surface-2 p-1">
            {([
              { id: "grid" as const, Icon: IconGrid },
              { id: "list" as const, Icon: IconRows },
            ]).map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                aria-pressed={view === id}
                aria-label={t(`common.${id}`)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                  view === id
                    ? "bg-surface text-brand-2 shadow-[var(--shadow-xs)]"
                    : "text-muted hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t(`common.${id}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[288px_1fr]">
        <aside className="hidden lg:block">
          <div className="panel sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-5">
            <p className="mb-5 flex items-center justify-between text-sm font-bold text-ink">
              <span className="inline-flex items-center gap-2">
                <IconSliders className="h-4 w-4 text-brand-2" />
                {t("common.filters")}
              </span>
              {activeCount > 0 && <span className="badge badge-brand">{activeCount} active</span>}
            </p>
            {FilterControls}
          </div>
        </aside>

        <div>
          <p className="mb-5 text-sm text-muted">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-2" />
                {t("common.loading")}…
              </span>
            ) : (
              <>
                <span className="font-display font-extrabold text-ink">{filtered.length}</span>{" "}
                {t("common.results")}
              </>
            )}
          </p>

          {loading ? (
            <VehicleGridSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <div className="panel animate-scale-in flex flex-col items-center gap-3 p-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted">
                <IconSearch className="h-7 w-7" />
              </span>
              <h3 className="mt-1 font-display text-lg font-bold text-ink">{t("discovery.empty.title")}</h3>
              <p className="max-w-sm text-sm text-muted">{t("discovery.empty.body")}</p>
              <button
                onClick={() => {
                  setFilters(DEFAULTS);
                  setVisible(PAGE);
                }}
                className="btn btn-secondary btn-sm mt-3"
              >
                {t("common.clearAll")}
              </button>
            </div>
          ) : (
            <>
              <div className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
                {shown.map((v, i) => (
                  <Reveal key={v.id} delay={Math.min(i, 5) * 60} className={view === "grid" ? "h-full" : ""}>
                    <VehicleCard vehicle={v} layout={view} />
                  </Reveal>
                ))}
              </div>

              {visible < filtered.length && (
                <div ref={sentinel} className="mt-10 flex justify-center">
                  <button onClick={() => setVisible((x) => x + PAGE)} className="btn btn-secondary">
                    {t("discovery.loadMore")}
                    <IconChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="animate-fade-in absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <div className="animate-sheet absolute inset-y-0 end-0 w-[88%] max-w-sm overflow-y-auto border-s border-line bg-surface p-5 shadow-[var(--shadow-lift)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{t("common.filters")}</p>
              <button onClick={() => setDrawer(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-2">
                <IconX className="h-5 w-5" />
              </button>
            </div>
            {FilterControls}
            <button onClick={() => setDrawer(false)} className="btn btn-primary mt-5 w-full">
              Show {filtered.length} {t("common.results")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function endValue(v: Vehicle) {
  if (v.auctionStatus === "ended") return 1e6;
  return v.endsInHours;
}
function countActive(f: Filters) {
  let n = 0;
  if (f.make) n++;
  if (f.model) n++;
  if (f.yearMin !== DEFAULTS.yearMin) n++;
  if (f.priceMax !== DEFAULTS.priceMax) n++;
  if (f.mileageMax !== DEFAULTS.mileageMax) n++;
  if (f.bodyType) n++;
  if (f.fuel) n++;
  if (f.transmission) n++;
  if (f.conditionMin) n++;
  if (f.location) n++;
  if (f.status) n++;
  if (f.endingSoon) n++;
  if (f.q) n++;
  return n;
}
function serialize(f: Filters): Record<string, string> {
  const o: Record<string, string> = {};
  Object.entries(f).forEach(([k, v]) => {
    if (v !== "" && v !== false) o[k] = String(v);
  });
  return o;
}
function buildLabel(f: Filters, t: (k: string) => string) {
  const bits = [f.make, f.bodyType, f.location].filter(Boolean);
  if (f.endingSoon) bits.push(t("common.endingSoon"));
  return bits.length ? bits.join(" · ") : `Under $${f.priceMax.toLocaleString()}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
