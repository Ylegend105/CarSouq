export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="aurora relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-page relative py-16 md:py-24">
        {eyebrow && (
          <p className="eyebrow animate-fade-up">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-brand-2" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3.5 max-w-3xl font-display text-[2.1rem] font-extrabold tracking-[-0.03em] text-ink text-balance animate-fade-up sm:text-[2.9rem]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft animate-fade-up [animation-delay:100ms]">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8 animate-fade-up [animation-delay:180ms]">{children}</div>}
      </div>
    </header>
  );
}
