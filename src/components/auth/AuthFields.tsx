"use client";

import { useId, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { IconEye, IconEyeOff, IconGoogle, IconApple } from "@/components/ui/icons";

export function Field({
  label,
  icon: Icon,
  hint,
  error,
  ...props
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute start-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted" />
        )}
        <input
          id={id}
          {...props}
          aria-invalid={Boolean(error)}
          className={`input ${Icon ? "ps-11" : ""} ${error ? "!border-danger" : ""}`}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function PasswordField({
  label,
  showStrength = false,
  value,
  error,
  ...props
}: {
  label: string;
  showStrength?: boolean;
  value: string;
  error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value">) {
  const id = useId();
  const [show, setShow] = useState(false);
  const { t } = useI18n();
  const score = strength(value);

  const labels = [t("auth.weak"), t("auth.weak"), t("auth.fair"), t("auth.good"), t("auth.strong")];
  const colors = ["var(--color-danger)", "var(--color-danger)", "var(--color-warning)", "var(--color-brand-2)", "var(--color-success)"];

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          {...props}
          aria-invalid={Boolean(error)}
          className={`input pe-11 ${error ? "!border-danger" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute end-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          {show ? <IconEyeOff className="h-[18px] w-[18px]" /> : <IconEye className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="mt-2.5">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded-full transition-all duration-500"
                style={{ background: i < score ? colors[score] : "var(--color-surface-3)" }}
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {t("auth.strength")}:{" "}
            <span className="font-semibold" style={{ color: colors[score] }}>
              {labels[score]}
            </span>
          </p>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export function strength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}

export function SocialButtons() {
  const { t } = useI18n();
  return (
    <>
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted">
          {t("auth.orContinue")}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="btn btn-secondary">
          <IconGoogle className="h-[18px] w-[18px]" />
          Google
        </button>
        <button type="button" className="btn btn-secondary">
          <IconApple className="h-[18px] w-[18px]" />
          Apple
        </button>
      </div>
    </>
  );
}

export function Checkbox({
  children,
  ...props
}: { children: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
      <input
        type="checkbox"
        {...props}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-line-strong accent-[var(--color-brand-2)]"
      />
      <span>{children}</span>
    </label>
  );
}
