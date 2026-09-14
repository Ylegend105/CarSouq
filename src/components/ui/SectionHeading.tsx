export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      {eyebrow && (
        <p className="eyebrow">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-brand-2" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-[1.85rem] font-extrabold tracking-tight text-ink text-balance sm:text-[2.35rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-[1.02rem] leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}
