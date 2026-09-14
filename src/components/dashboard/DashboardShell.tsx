"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { IconCheck, IconArrowRight } from "@/components/ui/icons";

export interface DashSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  render: () => React.ReactNode;
}

export default function DashboardShell({
  title,
  role,
  otherHref,
  otherLabel,
  sections,
  user,
}: {
  title: string;
  role: string;
  otherHref: string;
  otherLabel: string;
  sections: DashSection[];
  user: { name: string; email: string; verified: boolean };
}) {
  const { t } = useI18n();
  const [active, setActive] = useState(sections[0].id);
  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <div>
      <div className="aurora border-b border-line">
        <div className="container-page flex flex-wrap items-end justify-between gap-4 py-10">
          <div className="animate-fade-up">
            <p className="eyebrow">
              <span className="h-px w-6 bg-gradient-to-r from-transparent to-brand-2" />
              {role}
            </p>
            <h1 className="mt-2.5 font-display text-[1.9rem] font-extrabold tracking-tight text-ink sm:text-[2.3rem]">
              {title}
            </h1>
          </div>
          <Link href={otherHref} className="btn btn-secondary btn-sm">
            {otherLabel}
            <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[256px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="panel p-3">
            <div className="flex items-center gap-3 rounded-[var(--radius-sm)] bg-gradient-to-br from-brand/10 to-brand-3/10 p-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 font-display font-extrabold text-white">
                {user.name[0]}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <span
              className={`badge mt-2.5 w-full justify-center ${user.verified ? "badge-success" : "badge-warning"}`}
            >
              {user.verified && <IconCheck className="h-3 w-3" />}
              {user.verified ? t("verify.verified") : t("verify.pending")}
            </span>

            <nav className="mt-3 space-y-0.5">
              {sections.map((s) => {
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`group relative flex w-full items-center gap-2.5 rounded-[var(--radius-xs)] px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-brand-2/10 text-brand-2"
                        : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-gradient-to-b from-brand to-brand-2 transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <s.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-start">{s.label}</span>
                    {s.badge ? (
                      <span className="badge badge-brand !px-1.5 !py-0 !text-[0.6rem]">{s.badge}</span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 lg:hidden">
            <label className="label">Section</label>
            <div className="relative">
              <select className="select" value={active} onChange={(e) => setActive(e.target.value)}>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="mb-5 font-display text-xl font-bold text-ink">{current.label}</h2>
          <div key={active} className="animate-fade-in">{current.render()}</div>
        </div>
      </div>
    </div>
  );
}

export function DashCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="panel card-hover p-5">
      <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1.5 font-display text-[1.6rem] font-extrabold leading-none text-ink">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel flex flex-col items-center gap-2 p-14 text-center">
      <p className="font-display text-base font-bold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-muted">{body}</p>
    </div>
  );
}
