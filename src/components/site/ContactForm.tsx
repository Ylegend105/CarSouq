"use client";

import { useState } from "react";
import { IconCheck } from "@/components/ui/icons";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="panel flex flex-col items-center gap-2 p-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-success/12 text-success">
          <IconCheck className="h-6 w-6" />
        </span>
        <h3 className="text-base font-semibold text-ink">Message sent</h3>
        <p className="max-w-sm text-sm text-muted">
          Thanks — our Beirut team will reply within one business day. For anything urgent, call +961 1 000 111.
        </p>
        <button onClick={() => setSent(false)} className="btn btn-secondary btn-sm mt-2">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="panel space-y-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="cf-name">Full name</label>
          <input id="cf-name" required className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" required className="input" placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="cf-phone">Phone (optional)</label>
          <input id="cf-phone" className="input" placeholder="+961 …" />
        </div>
        <div>
          <label className="label" htmlFor="cf-topic">Topic</label>
          <select id="cf-topic" className="select">
            <option>Buying a car</option>
            <option>Selling a car</option>
            <option>Payments &amp; escrow</option>
            <option>Verification</option>
            <option>Report a problem</option>
            <option>Something else</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="cf-msg">Message</label>
        <textarea id="cf-msg" required rows={5} className="textarea" placeholder="How can we help?" />
      </div>
      <label className="flex items-start gap-2.5 text-xs text-muted">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[var(--color-brand-2)]" />
        I agree to the processing of my details under the CarSouq privacy policy.
      </label>
      <button type="submit" className="btn btn-primary w-full">Send message</button>
    </form>
  );
}
