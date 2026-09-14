"use client";

import { useRef, useState } from "react";
import type { Vehicle } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { assistantAnswer, conditionNarrative, SUGGESTED_QUESTIONS } from "@/lib/ai";
import { IconSparkles, IconArrowRight } from "@/components/ui/icons";

interface Msg {
  role: "user" | "ai";
  text: string;
}

export default function AIAssistantPanel({ vehicle: v }: { vehicle: Vehicle }) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: assistantAnswer(v, q) }]);
      setThinking(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }));
    }, 900);
  };

  return (
    <div className="panel ring-gradient overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line bg-gradient-to-r from-brand/10 via-brand-2/8 to-brand-3/10 p-5">
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white shadow-[var(--shadow-glow)]">
          <IconSparkles className="h-[18px] w-[18px]" />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">{t("ai.panelTitle")}</p>
          <p className="mt-0.5 text-xs text-muted">{t("ai.panelSubtitle")}</p>
        </div>
      </div>

      <div className="p-5">
        <p className="eyebrow">{t("ai.conditionSummary")}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{conditionNarrative(v)}</p>
      </div>

      <div ref={scrollRef} className="max-h-80 space-y-3 overflow-y-auto border-t border-line p-5">
        {messages.length === 0 && (
          <p className="text-xs text-muted">Ask a question below, or pick one to get started.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`animate-fade-up max-w-[88%] rounded-[var(--radius-sm)] px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === "user"
                ? "ms-auto bg-gradient-to-br from-brand to-brand-2 text-white"
                : "border border-line bg-surface-2 text-ink-soft"
            }`}
          >
            {m.text}
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brand-2"
                  style={{ animationDelay: `${d * 180}ms` }}
                />
              ))}
            </span>
            {t("ai.thinking")}
          </div>
        )}
      </div>

      <div className="border-t border-line p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={thinking}
              className="rounded-full border border-line-strong px-3 py-1.5 text-xs font-medium text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-2/50 hover:text-brand-2 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-2"
        >
          <input
            className="input"
            placeholder={t("ai.askPlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            className="btn btn-primary shrink-0 !px-4"
            aria-label={t("ai.ask")}
          >
            <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </form>
        <p className="mt-3 text-[0.68rem] leading-relaxed text-muted">{t("ai.disclaimer")}</p>
      </div>
    </div>
  );
}
