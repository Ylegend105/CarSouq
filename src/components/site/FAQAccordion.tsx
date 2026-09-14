"use client";

import { useState } from "react";
import { IconChevronDown } from "@/components/ui/icons";

export default function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-line panel overflow-hidden">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={isOpen ? "bg-surface-2/50" : ""}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-start transition-colors hover:bg-surface-2"
              aria-expanded={isOpen}
            >
              <span className={`text-[0.92rem] font-bold transition-colors ${isOpen ? "text-brand-2" : "text-ink"}`}>
                {it.q}
              </span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-400 [transition-timing-function:var(--ease-out-expo)] ${
                  isOpen ? "rotate-180 border-brand-2/40 bg-brand-2/10 text-brand-2" : "border-line text-muted"
                }`}
              >
                <IconChevronDown className="h-4 w-4" />
              </span>
            </button>
            <div
              className="grid transition-all duration-400 [transition-timing-function:var(--ease-out-expo)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
