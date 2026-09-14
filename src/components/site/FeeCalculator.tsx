"use client";

import { useState } from "react";
import { computeFees } from "@/lib/format";
import Money from "@/components/ui/Money";

export default function FeeCalculator() {
  const [hammer, setHammer] = useState(25000);
  const [transfer, setTransfer] = useState(true);
  const fees = computeFees(hammer, transfer);

  return (
    <div className="panel p-6">
      <h3 className="text-sm font-semibold text-ink">Buyer cost calculator</h3>
      <label className="label mt-4">Hammer price — <Money usd={hammer} /></label>
      <input
        type="range"
        min={5000}
        max={80000}
        step={500}
        value={hammer}
        onChange={(e) => setHammer(+e.target.value)}
        className="w-full accent-[var(--color-brand-2)]"
      />
      <label className="mt-3 flex items-center gap-2.5 text-sm text-ink-soft">
        <input type="checkbox" checked={transfer} onChange={(e) => setTransfer(e.target.checked)} className="h-4 w-4 accent-[var(--color-brand-2)]" />
        Include registration transfer &amp; mécanique ($220)
      </label>

      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <Row label="Hammer price" value={<Money usd={fees.hammer} />} />
        <Row label="Buyer's premium (4.5%)" value={<Money usd={fees.premium} />} />
        <Row label="Documentation fee" value={<Money usd={fees.documentation} />} />
        {transfer && <Row label="Registration transfer" value={<Money usd={fees.transfer} />} />}
        <div className="border-t border-line pt-2">
          <Row label="Total to pay" value={<Money usd={fees.total} />} strong />
        </div>
      </dl>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "font-semibold text-ink" : "text-ink-soft"}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
