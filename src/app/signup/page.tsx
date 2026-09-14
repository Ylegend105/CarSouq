"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import AuthShell from "@/components/auth/AuthShell";
import { Field, PasswordField, SocialButtons, Checkbox, strength } from "@/components/auth/AuthFields";
import {
  IconMail,
  IconUser,
  IconPhone,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconGavel,
  IconCar,
  IconSparkles,
} from "@/components/ui/icons";

type Role = "buyer" | "seller" | "both";

export default function SignUpPage() {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("buyer");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length < 7) next.phone = "Enter a valid Lebanese phone number.";
    if (strength(password) < 2) next.password = "Use 8+ characters with a mix of letters and numbers.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setErrors({ agree: "Please accept the terms to continue." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1000);
  };

  if (done) {
    return (
      <AuthShell side="signup">
        <div className="animate-scale-in text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/12 text-success">
            <IconCheck className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink">
            {t("auth.success")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("auth.successBody")}</p>

          <div className="panel mt-7 space-y-3 p-5 text-start">
            {[
              "Email confirmed",
              "Add a payment method to bid above $10,000",
              "Upload your ID for full verification",
            ].map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                    i === 0 ? "bg-success/15 text-success" : "bg-surface-2 text-muted"
                  }`}
                >
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                <span className={i === 0 ? "text-ink-soft" : "text-muted"}>{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href="/auctions" className="btn btn-primary">
              <IconGavel className="h-4 w-4" />
              {t("cta.browse")}
            </Link>
            <Link href="/dashboard/buyer" className="btn btn-secondary">
              {t("nav.dashboard")}
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell side="signup">
      <div className="animate-fade-up">
        {/* progress */}
        <div className="mb-7 flex items-center gap-3">
          {[1, 2].map((n) => (
            <div key={n} className="flex flex-1 items-center gap-3">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-500 ${
                  step >= n
                    ? "bg-gradient-to-br from-brand to-brand-2 text-white"
                    : "border border-line bg-surface text-muted"
                }`}
              >
                {step > n ? <IconCheck className="h-3.5 w-3.5" /> : n}
              </span>
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface-3">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-brand to-brand-2 transition-all duration-700 [transition-timing-function:var(--ease-out-expo)]"
                  style={{ width: step > n ? "100%" : step === n ? "45%" : "0%" }}
                />
              </span>
            </div>
          ))}
        </div>

        <p className="eyebrow">
          {t("auth.step")} {step} / 2
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
          {t("auth.signUp.title")}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{t("auth.signUp.subtitle")}</p>

        {step === 1 && (
          <form onSubmit={goNext} className="animate-fade-in mt-8 space-y-4" noValidate>
            <Field
              label={t("auth.fullName")}
              icon={IconUser}
              placeholder="Rami Khoury"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Field
              label={t("auth.email")}
              icon={IconMail}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Field
              label={t("auth.phone")}
              icon={IconPhone}
              type="tel"
              placeholder="+961 3 000 000"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
            <PasswordField
              label={t("auth.password")}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              showStrength
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <button type="submit" className="btn btn-primary btn-lg w-full">
              {t("auth.continue")}
              <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
            </button>

            <SocialButtons />
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submit} className="animate-fade-in mt-8 space-y-6" noValidate>
            <div>
              <p className="label">{t("auth.accountType")}</p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {(
                  [
                    { id: "buyer", label: t("auth.asBuyer"), Icon: IconGavel },
                    { id: "seller", label: t("auth.asSeller"), Icon: IconCar },
                    { id: "both", label: t("auth.asBoth"), Icon: IconSparkles },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setRole(id)}
                    aria-pressed={role === id}
                    className={`flex flex-col items-center gap-2 rounded-[var(--radius-sm)] border p-4 text-center transition-all duration-300 ${
                      role === id
                        ? "border-brand-2 bg-brand-2/8 text-brand-2 shadow-[var(--shadow-xs)]"
                        : "border-line bg-surface text-ink-soft hover:border-line-strong hover:bg-surface-2"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-semibold leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-[var(--radius-sm)] border border-line bg-surface-2 p-4">
              <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}>
                {t("auth.terms")}{" "}
                <Link href="/terms" className="font-semibold text-brand-2 hover:underline">
                  Terms
                </Link>{" "}
                ·{" "}
                <Link href="/privacy" className="font-semibold text-brand-2 hover:underline">
                  Privacy
                </Link>
              </Checkbox>
              <Checkbox defaultChecked>{t("auth.marketing")}</Checkbox>
              {errors.agree && <p className="text-xs font-medium text-danger">{errors.agree}</p>}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary btn-lg">
                <IconArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg flex-1">
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                    Creating…
                  </>
                ) : (
                  <>
                    {t("auth.signUpCta")}
                    <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
