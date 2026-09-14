"use client";

import { useState } from "react";
import type { Vehicle } from "@/lib/types";
import CarImage from "@/components/CarImage";
import { useI18n } from "@/lib/i18n";
import { IconRotate, IconCamera, IconChevronRight } from "@/components/ui/icons";

const SHOTS = ["Front 3/4", "Rear 3/4", "Interior", "Dashboard", "Engine bay", "Wheels"];

export default function VehicleGallery({ vehicle: v }: { vehicle: Vehicle }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"photos" | "360">("photos");
  const [angle, setAngle] = useState(2);

  return (
    <div>
      <div className="panel overflow-hidden">
        <div className="relative aspect-[16/10] w-full bg-surface-2">
          {mode === "photos" ? (
            <CarImage
              key={active}
              from={v.accentFrom}
              to={v.accentTo}
              bodyType={v.bodyType}
              seed={Number(v.id) * 10 + active}
              label={`${v.year} ${v.make} ${v.model} — ${SHOTS[active]}`}
              className="animate-fade-in h-full w-full"
            />
          ) : (
            <div
              className="h-full w-full cursor-ew-resize select-none"
              onPointerMove={(e) => {
                if (e.buttons === 1) setAngle((a) => (a + Math.sign(e.movementX) + 8) % 8);
              }}
            >
              <CarImage
                from={v.accentFrom}
                to={v.accentTo}
                bodyType={v.bodyType}
                seed={200 + angle}
                className="h-full w-full"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-1.5">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/85 text-brand-2 backdrop-blur">
                  <IconRotate className="h-4 w-4" />
                </span>
                <span className="rounded-full border border-line bg-surface/85 px-3 py-1 text-[0.68rem] font-medium text-muted backdrop-blur">
                  {t("vehicle.360.placeholder")}
                </span>
              </div>
            </div>
          )}

          <div className="absolute inset-x-4 top-4 flex items-center justify-between">
            <span className="badge bg-surface/85 backdrop-blur">
              {active + 1} / {SHOTS.length}
            </span>
            <div className="flex gap-1.5">
              <ModeBtn active={mode === "photos"} onClick={() => setMode("photos")} Icon={IconCamera}>
                Photos
              </ModeBtn>
              <ModeBtn active={mode === "360"} onClick={() => setMode("360")} Icon={IconRotate}>
                {t("vehicle.360")}
              </ModeBtn>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-2">
        {SHOTS.map((s, i) => {
          const isActive = active === i && mode === "photos";
          return (
            <button
              key={s}
              onClick={() => {
                setMode("photos");
                setActive(i);
              }}
              className={`relative overflow-hidden rounded-[var(--radius-xs)] border transition-all duration-300 ${
                isActive
                  ? "border-brand-2 ring-2 ring-brand-2/25"
                  : "border-line opacity-70 hover:opacity-100"
              }`}
              title={s}
              aria-label={s}
            >
              <CarImage
                from={v.accentFrom}
                to={v.accentTo}
                bodyType={v.bodyType}
                seed={Number(v.id) * 10 + i}
                className="aspect-square w-full"
              />
            </button>
          );
        })}
      </div>

      <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
        <IconChevronRight className="h-3.5 w-3.5 text-brand-2 rtl:rotate-180" />
        {SHOTS[active]} — 48 high-resolution photos in the full gallery
      </p>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`badge backdrop-blur transition-all duration-300 ${
        active ? "badge-brand" : "bg-surface/85 hover:text-ink"
      }`}
      aria-pressed={active}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
