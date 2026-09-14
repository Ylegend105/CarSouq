# CarSouq — Lebanon's Smarter Car Auction Marketplace

A premium, AI-assisted online car auction platform for Lebanon. Buyers discover, inspect, and bid
on independently verified vehicles; sellers and admins manage listings, bidding, and transactions.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.
No backend — data is mocked and interactions (watchlist, bids, currency, language, theme) persist in
`localStorage`. The "AI" layer is a deterministic, transparent heuristic engine standing in for a model.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## What's inside

| Area | Route(s) |
| --- | --- |
| Homepage — hero, live-auction strip, featured lots, trust, how-it-works, testimonials, CTA | `/` |
| Vehicle discovery — grid/list, 12 filters, 6 sorts, infinite scroll, empty & loading states | `/auctions` |
| Vehicle detail & bidding — gallery + 360° placeholder, spec table, inspection, history, disclosures, documents, live bid panel with confirm + success, sticky mobile bar | `/vehicles/[id]` |
| AI features — condition summary, Q&A assistant, market-value range, transparent Deal Score, recommendations, seller listing assistant | detail page & `/sell` |
| Auth — split-screen sign in, two-step sign up with password strength, role picker and success state | `/signin`, `/signup` |
| Dashboards — buyer (watchlist, bids, payments, saved searches, alerts, verification) and seller (listings, performance, bidder interest, reserve controls, offers, payouts, AI tips) | `/dashboard/buyer`, `/dashboard/seller` |
| Content — About, How It Works, Fees (with calculator), Buyer Guide, Seller Guide, Help Center, Terms, Privacy, Contact | `/about`, `/fees`, … |

## Design system

`src/app/globals.css` holds the whole system as CSS custom properties inside `@theme`, with a
`html.dark` block that swaps the palette at runtime — so every `bg-surface` / `text-ink` utility is
theme-aware with no duplicated class lists.

- **Palette** — navy `#1a4c7a` → azure `#2b8fd1` → cyan `#48c9e3`, with a gold accent for auction cues.
- **Type** — Plus Jakarta Sans for display, Geist for body, Noto Sans Arabic for RTL.
- **Layers** — component classes live in `@layer components` so Tailwind utilities always win
  (`class="input ps-11"` actually applies its padding).
- **Motion** — `Reveal` (IntersectionObserver) for scroll-in, plus fade/scale/sheet/marquee keyframes,
  all disabled under `prefers-reduced-motion`.

### Dark mode

Three-way: light / dark / system. The choice is stored in `localStorage` and applied by a small
inline script in `<head>` **before first paint**, so there is no flash. Toggle from the header, or
pick a mode from the segmented control in the footer.

## Localization

English, Arabic (full RTL), and French. Language + currency (USD / LBP) switch from the header and
are remembered. Deep-link a language with `?lang=ar` / `?lang=fr`. Numbers and currency use `Intl`
with the matching locale.

## Key modules

- `src/lib/data.ts` — realistic Lebanese vehicle inventory, testimonials, FAQ.
- `src/lib/ai.ts` — Deal Score, market value, assistant answers, seller listing assistant.
- `src/lib/theme.tsx` — theme provider + no-flash init script.
- `src/lib/i18n.tsx` — translation provider, dictionaries, `dir` switching.
- `src/lib/store.tsx` — watchlist / bids / saved searches / notifications / currency.
- `src/components/site/Logo.tsx` — the CarSouq mark (coupe + gavel) as theme-aware SVG, in
  horizontal and stacked lockups.
