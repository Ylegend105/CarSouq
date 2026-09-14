export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl space-y-5 text-[0.97rem] leading-[1.75] text-ink-soft [&_a]:font-semibold [&_a]:text-brand-2 [&_a:hover]:underline [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[1.35rem] [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-[1.05rem] [&_h3]:font-bold [&_h3]:text-ink [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:ps-5 [&_ol]:marker:text-brand-2 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-5 [&_ul]:marker:text-brand-2">
      {children}
    </div>
  );
}
