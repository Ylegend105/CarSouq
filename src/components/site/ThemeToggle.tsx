"use client";

import { useTheme } from "@/lib/theme";
import { IconSun, IconMoon } from "@/components/ui/icons";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-line bg-surface text-ink-soft transition-all duration-300 hover:border-brand-2/50 hover:text-brand-2 focus-ring ${className}`}
    >
      <IconSun
        className={`absolute h-[18px] w-[18px] transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
          isDark ? "translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
        }`}
      />
      <IconMoon
        className={`absolute h-[18px] w-[18px] transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
          isDark ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-6 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}

export function ThemeSegmented() {
  const { mode, setMode } = useTheme();
  const opts = [
    { id: "light" as const, label: "Light", Icon: IconSun },
    { id: "dark" as const, label: "Dark", Icon: IconMoon },
    { id: "system" as const, label: "Auto", Icon: SystemGlyph },
  ];
  return (
    <div className="flex gap-1 rounded-full border border-line bg-surface-2 p-1">
      {opts.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => setMode(id)}
          aria-pressed={mode === id}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
            mode === id
              ? "bg-surface text-brand-2 shadow-[var(--shadow-xs)]"
              : "text-muted hover:text-ink"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

function SystemGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}
