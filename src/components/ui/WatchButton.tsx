"use client";

import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { IconHeart } from "@/components/ui/icons";

export default function WatchButton({
  vehicleId,
  variant = "icon",
  className = "",
}: {
  vehicleId: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { isWatched, toggleWatch, hydrated } = useStore();
  const { t } = useI18n();
  const watched = hydrated && isWatched(vehicleId);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggleWatch(vehicleId)}
        className={`btn btn-secondary ${watched ? "!border-brand-2/60 !text-brand-2" : ""} ${className}`}
        aria-pressed={watched}
      >
        <IconHeart
          className={`h-4 w-4 transition-transform duration-300 [transition-timing-function:var(--ease-spring)] ${
            watched ? "scale-110 fill-current" : ""
          }`}
        />
        {watched ? t("common.saved") : t("common.save")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatch(vehicleId);
      }}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface/85 text-ink-soft shadow-[var(--shadow-xs)] backdrop-blur transition-all duration-300 hover:scale-110 hover:border-brand-2/50 hover:text-brand-2 focus-ring ${
        watched ? "!border-brand-2/60 !text-brand-2" : ""
      } ${className}`}
      aria-label={watched ? t("common.saved") : t("common.save")}
      aria-pressed={watched}
    >
      <IconHeart
        className={`h-[18px] w-[18px] transition-transform duration-300 [transition-timing-function:var(--ease-spring)] ${
          watched ? "scale-110 fill-current" : ""
        }`}
      />
    </button>
  );
}
