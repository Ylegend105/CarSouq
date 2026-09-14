"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import AuthShell from "@/components/auth/AuthShell";
import { Field, PasswordField, SocialButtons, Checkbox } from "@/components/auth/AuthFields";
import { IconMail, IconArrowRight, IconShield } from "@/components/ui/icons";

export default function SignInPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => router.push("/dashboard/buyer"), 900);
  };

  return (
    <AuthShell side="signin">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          {t("auth.signIn.title")}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{t("auth.signIn.subtitle")}</p>

        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <Field
            label={t("auth.email")}
            icon={IconMail}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div>
            <PasswordField
              label={t("auth.password")}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <Checkbox defaultChecked>{t("auth.remember")}</Checkbox>
              <Link href="/help" className="shrink-0 text-xs font-semibold text-brand-2 hover:underline">
                {t("auth.forgot")}
              </Link>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
            {loading ? (
              <>
                <Spinner /> Signing in…
              </>
            ) : (
              <>
                {t("auth.signInCta")}
                <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
              </>
            )}
          </button>
        </form>

        <SocialButtons />

        <p className="mt-7 flex items-start gap-2 rounded-[var(--radius-xs)] border border-line bg-surface-2 px-3.5 py-3 text-[0.7rem] leading-relaxed text-muted">
          <IconShield className="mt-px h-4 w-4 shrink-0 text-brand-2" />
          CarSouq will never ask for your password by phone or email. Payments always go through platform escrow.
        </p>
      </div>
    </AuthShell>
  );
}

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
  );
}
