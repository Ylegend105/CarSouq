import type { Vehicle } from "./types";
import { VEHICLES } from "./data";

/* ------------------------------------------------------------------
   Simulated AI layer.
   Deterministic, transparent heuristics that stand in for a model —
   every score exposes the factors behind it.
------------------------------------------------------------------ */

export interface ScoreFactor {
  label: string;
  impact: number; // -100..100 contribution, already weighted
  detail: string;
}

export interface DealScore {
  score: number; // 0-100
  verdict: "Excellent deal" | "Good deal" | "Fair price" | "Above market";
  summary: string;
  factors: ScoreFactor[];
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

function expectedMileage(year: number): number {
  const age = Math.max(0.5, 2026 - year);
  return age * 15000;
}

export function marketValue(v: Vehicle): {
  low: number;
  mid: number;
  high: number;
  confidence: "High" | "Medium" | "Low";
  drivers: string[];
} {
  const low = v.aiValueLow;
  const high = v.aiValueHigh;
  const mid = Math.round((low + high) / 2 / 100) * 100;
  const spread = (high - low) / mid;
  const confidence = spread < 0.12 ? "High" : spread < 0.2 ? "Medium" : "Low";
  const drivers: string[] = [];
  const expKm = expectedMileage(v.year);
  if (v.mileageKm < expKm * 0.85) drivers.push("Below-average mileage for the year lifts value");
  else if (v.mileageKm > expKm * 1.15) drivers.push("Higher-than-average mileage weighs on value");
  else drivers.push("Mileage is in line with the year");
  if (v.accidentFree) drivers.push("Accident-free structure supports the upper range");
  else drivers.push("Disclosed accident history caps the upper range");
  if (v.serviceHistory === "Full") drivers.push("Full documented service history adds a premium");
  if (["Land Cruiser Prado", "Patrol", "Corolla", "Wrangler"].includes(v.model))
    drivers.push("Strong resale demand for this model in Lebanon");
  if (v.fuel === "Hybrid" || v.fuel === "Electric")
    drivers.push("Fuel efficiency is increasingly valued given local fuel prices");
  return { low, mid, high, confidence, drivers };
}

export function dealScore(v: Vehicle): DealScore {
  const { mid } = marketValue(v);
  const factors: ScoreFactor[] = [];

  // Price vs market
  const priceDelta = (mid - v.currentBid) / mid; // positive = below market
  const priceImpact = clamp(priceDelta * 240, -45, 45);
  factors.push({
    label: "Current bid vs AI market value",
    impact: Math.round(priceImpact),
    detail:
      priceDelta > 0.02
        ? `Bidding is about ${Math.round(priceDelta * 100)}% under the estimated market mid-point.`
        : priceDelta < -0.02
          ? `Bidding is roughly ${Math.round(-priceDelta * 100)}% above the estimated mid-point.`
          : "Bidding is tracking the estimated market value closely.",
  });

  // Reserve headroom
  const reserveImpact = v.reserveMet ? 6 : clamp(((v.reservePrice - v.currentBid) / v.reservePrice) * -60, -18, 0);
  factors.push({
    label: "Reserve status",
    impact: Math.round(reserveImpact),
    detail: v.reserveMet
      ? "Reserve is already met — the car will sell."
      : `Reserve not yet met; about $${(v.reservePrice - v.currentBid).toLocaleString()} of headroom remains.`,
  });

  // Condition
  const condImpact = clamp((v.conditionScore - 78) * 1.1, -22, 22);
  factors.push({
    label: "Inspection condition score",
    impact: Math.round(condImpact),
    detail: `Independent inspection graded this car ${v.conditionScore}/100 (${v.conditionGrade}).`,
  });

  // Mileage
  const expKm = expectedMileage(v.year);
  const mileageImpact = clamp(((expKm - v.mileageKm) / expKm) * 40, -20, 20);
  factors.push({
    label: "Mileage vs expected",
    impact: Math.round(mileageImpact),
    detail: `${v.mileageKm.toLocaleString()} km against ~${Math.round(expKm).toLocaleString()} km expected for a ${v.year}.`,
  });

  // History
  const historyImpact = (v.accidentFree ? 8 : -12) + (v.serviceHistory === "Full" ? 6 : v.serviceHistory === "Partial" ? -2 : -8);
  factors.push({
    label: "History & disclosures",
    impact: historyImpact,
    detail: `${v.accidentFree ? "Accident-free" : "Disclosed accident repair"}, ${v.serviceHistory.toLowerCase()} service history, ${v.owners} owner${v.owners > 1 ? "s" : ""}.`,
  });

  // Demand
  const demandImpact = clamp((v.bidderCount - 7) * 1.6, -8, 12);
  factors.push({
    label: "Bidder interest",
    impact: Math.round(demandImpact),
    detail: `${v.bidderCount} bidders and ${v.bidCount} bids so far — ${v.bidderCount >= 10 ? "strong" : "moderate"} competition.`,
  });

  const raw = 56 + factors.reduce((s, f) => s + f.impact, 0);
  const score = Math.round(clamp(raw, 12, 97));
  const verdict =
    score >= 82 ? "Excellent deal" : score >= 70 ? "Good deal" : score >= 55 ? "Fair price" : "Above market";
  const summary =
    verdict === "Excellent deal"
      ? "The current bid sits well below what the condition, mileage and history support. Worth acting on."
      : verdict === "Good deal"
        ? "Solid value at the current bid. There is still some room before it reaches full market price."
        : verdict === "Fair price"
          ? "The bid is close to fair market value. Set a firm limit before you engage."
          : "Bidding has moved past what the fundamentals support. Only continue if this exact car is hard to find.";

  return { score, verdict, summary, factors };
}

export function conditionNarrative(v: Vehicle): string {
  const strong = v.inspection.items.filter((i) => i.rating >= 88).map((i) => i.area.toLowerCase());
  const watch = v.inspection.items.filter((i) => i.rating < 80).map((i) => i.area.toLowerCase());
  const parts: string[] = [];
  parts.push(
    `This ${v.year} ${v.make} ${v.model} presents as a ${v.conditionGrade.toLowerCase()} example with an overall inspection score of ${v.inspection.overall}/100.`,
  );
  if (strong.length)
    parts.push(`The ${strong.slice(0, 3).join(", ")} rated among the strongest areas.`);
  if (watch.length)
    parts.push(`Budget attention for the ${watch.join(" and ")} — rated below the car's average but still within serviceable limits.`);
  else parts.push("No individual system was flagged as a concern.");
  parts.push(
    v.accidentFree
      ? "The structure is original with no accident repair recorded."
      : `Note the disclosed repair: ${v.damages.find((d) => d.severity === "Moderate")?.note ?? "a past panel repair, professionally done."}`,
  );
  parts.push(
    `Cosmetically, expect ${v.damages.map((d) => d.note.toLowerCase()).join("; ")}.`,
  );
  return parts.join(" ");
}

export interface AssistantAnswer {
  question: string;
  answer: string;
}

export const SUGGESTED_QUESTIONS = [
  "Is this a good deal?",
  "What are common issues with this model?",
  "Compare this with similar listings",
  "What should I check on collection?",
  "How high should I bid?",
] as const;

const MODEL_ISSUES: Record<string, string[]> = {
  "C 300": [
    "48V mild-hybrid starter/alternator faults on facelift cars — check for a warning on cold start",
    "front lower control arm bushes wear early on Lebanese roads",
    "MBUX screen occasionally needs a software update for freezing",
  ],
  "330i": [
    "occasional high-pressure fuel pump noise — usually cosmetic but note it",
    "electronic water pump is a known wear item around 90–110k km",
    "check the iDrive controller and rear PDC sensors function",
  ],
  Macan: [
    "PDK mechatronic software updates — confirm latest is installed",
    "coolant pipe weep at the rear of the engine on early cars",
    "front tyres wear fast; budget for a set",
  ],
  "Land Cruiser Prado": [
    "very few — check for KDSS leaks and front diff breather",
    "sunroof drains block and can wet the headliner",
    "verify timing service on the 1GR-FE if over 120k km",
  ],
  Wrangler: [
    "'death wobble' from worn steering damper / track bar — test at 80 km/h",
    "water ingress around the freedom-top seals",
    "check for oil-pan and rear main seal seepage",
  ],
  Patrol: [
    "VK56 timing chain tensioner rattle on high-km cars",
    "rear air suspension compressor and bags are costly — test ride height",
    "brake booster and ABS actuator faults",
  ],
  "Golf GTI": [
    "DSG (if fitted) mechatronic and clutch packs — this one is manual, check clutch bite",
    "water pump / thermostat housing leaks",
    "carbon build-up on intake valves — a walnut blast may be due",
  ],
  Evoque: [
    "timing chain wear on early Ingenium engines — this is the later MHEV, lower risk",
    "infotainment reboots and parking sensor faults",
    "check the panoramic roof drains and rear diff",
  ],
};

export function assistantAnswer(v: Vehicle, question: string): string {
  const q = question.toLowerCase();
  const mv = marketValue(v);
  const ds = dealScore(v);

  if (q.includes("good deal") || q.includes("worth") || q.includes("overpric")) {
    return `${ds.summary} My Deal Score is ${ds.score}/100 (${ds.verdict}). The current bid is $${v.currentBid.toLocaleString()} against an estimated market range of $${mv.low.toLocaleString()}–$${mv.high.toLocaleString()}. The biggest positive factor is "${ds.factors.slice().sort((a, b) => b.impact - a.impact)[0].label.toLowerCase()}"; the main drag is "${ds.factors.slice().sort((a, b) => a.impact - b.impact)[0].label.toLowerCase()}".`;
  }
  if (q.includes("common issue") || q.includes("problem") || q.includes("reliab")) {
    const issues = MODEL_ISSUES[v.model] ?? [
      "no widespread faults are documented for this model",
      "still verify service history and that all electronics respond",
      "check tyre dates and brake wear as normal",
    ];
    return `For the ${v.make} ${v.model}, owners most often report: ${issues.map((i, n) => `(${n + 1}) ${i}`).join("; ")}. This specific car's inspection scored ${v.inspection.overall}/100 and ${v.accidentFree ? "shows no accident repair" : "has a disclosed repair — see the damage section"}.`;
  }
  if (q.includes("compare") || q.includes("similar") || q.includes("alternative")) {
    const peers = VEHICLES.filter(
      (x) => x.id !== v.id && x.bodyType === v.bodyType && Math.abs(x.currentBid - v.currentBid) < 12000,
    ).slice(0, 3);
    if (!peers.length) return "There are no closely comparable live listings right now — this configuration is relatively rare on the platform at the moment.";
    return `Against comparable ${v.bodyType.toLowerCase()}s live now: ${peers
      .map(
        (p) =>
          `the ${p.year} ${p.make} ${p.model} at $${p.currentBid.toLocaleString()} (${p.mileageKm.toLocaleString()} km, condition ${p.conditionScore})`,
      )
      .join("; ")}. This car is ${v.currentBid <= mv.mid ? "priced competitively" : "at the higher end"} for its mileage and condition within that set.`;
  }
  if (q.includes("collect") || q.includes("check") || q.includes("inspect") || q.includes("view")) {
    return `On collection: cold-start it yourself, confirm the VIN (${v.vin}) matches the papers and the mécanique, test every electronic feature, check tyre DOT dates, and take it to 80–100 km/h to feel the ${v.bodyType === "SUV" ? "suspension and steering" : "gearbox and brakes"}. Bring the printed CarSouq inspection and tick each item. Payment is only released after you confirm.`;
  }
  if (q.includes("how high") || q.includes("max bid") || q.includes("bid limit") || q.includes("should i bid")) {
    const ceiling = Math.min(mv.high, Math.round(mv.mid * 1.04));
    return `Based on condition, mileage and history, a defensible ceiling is around $${ceiling.toLocaleString()} — that keeps you inside the estimated market range. The reserve is ${v.reserveMet ? "already met" : `about $${v.reservePrice.toLocaleString()}`}. Decide your number now and let the timer, not other bidders, be the thing that stops you.`;
  }
  return `Here is what stands out on this ${v.year} ${v.make} ${v.model}: condition ${v.conditionScore}/100, ${v.mileageKm.toLocaleString()} km, ${v.serviceHistory.toLowerCase()} history, ${v.accidentFree ? "accident-free" : "one disclosed repair"}. Estimated market value $${mv.low.toLocaleString()}–$${mv.high.toLocaleString()}, current bid $${v.currentBid.toLocaleString()}, Deal Score ${ds.score}/100. Ask me "is this a good deal?", "what are common issues with this model?", or "how high should I bid?".`;
}

/* ---------------- Seller listing assistant ---------------- */

export interface ListingSuggestion {
  title: string;
  description: string;
  reserveLow: number;
  reserveHigh: number;
  recommendedReserve: number;
  photoChecklist: string[];
  expectedBidders: string;
  expectedInterest: "High" | "Moderate" | "Building";
  demandNote: string;
}

export function listingAssistant(input: {
  make: string;
  model: string;
  year: number;
  mileageKm: number;
  condition: number;
  bodyType: string;
}): ListingSuggestion {
  const age = Math.max(1, 2026 - input.year);
  const anchor = 34000 - age * 2100 - Math.round(input.mileageKm / 12) + (input.condition - 80) * 220;
  const recommendedReserve = Math.max(6000, Math.round(anchor / 100) * 100);
  const highDemand = ["Land Cruiser Prado", "Prado", "Patrol", "Corolla", "Rav4", "Wrangler", "Tucson"].some((m) =>
    input.model.toLowerCase().includes(m.toLowerCase()),
  );
  return {
    title: `${input.year} ${input.make} ${input.model} — ${input.condition >= 88 ? "Pristine, " : ""}${input.mileageKm < age * 13000 ? "low km, " : ""}Lebanon-owned`,
    description: `Well-maintained ${input.year} ${input.make} ${input.model} (${input.bodyType}) with ${input.mileageKm.toLocaleString()} km. Serviced on schedule, drives without fault, and comes with a full CarSouq 212-point inspection and transparent history. Ready for its ${input.condition >= 85 ? "next enthusiast owner" : "next family"}. Viewings welcome before the auction closes.`,
    reserveLow: Math.round((recommendedReserve * 0.92) / 100) * 100,
    reserveHigh: Math.round((recommendedReserve * 1.12) / 100) * 100,
    recommendedReserve,
    photoChecklist: [
      "Three-quarter front in daylight, clean and dry",
      "Three-quarter rear, same lighting",
      "Straight-on driver side and passenger side",
      "Dashboard with ignition on showing odometer",
      "Front and rear seats, boot space",
      "Engine bay",
      "All four tyres including tread and DOT date",
      "Any stone chips, scratches or wear — buyers trust honest photos",
      "Service book, spare key, and documents",
    ],
    expectedBidders: highDemand ? "9–16 registered bidders" : "5–10 registered bidders",
    expectedInterest: highDemand ? "High" : input.condition >= 86 ? "Moderate" : "Building",
    demandNote: highDemand
      ? `${input.make} ${input.model} is one of the most searched models on CarSouq in Lebanon — expect fast early bidding.`
      : `Demand for this segment is steady. A sharp reserve and complete photos typically add 2–3 serious bidders.`,
  };
}

export function recommendations(v: Vehicle): {
  similar: Vehicle[];
  betterValue: Vehicle[];
} {
  const { mid } = marketValue(v);
  const others = VEHICLES.filter((x) => x.id !== v.id && x.auctionStatus !== "ended");
  const similar = others
    .filter((x) => x.bodyType === v.bodyType)
    .sort((a, b) => Math.abs(a.currentBid - v.currentBid) - Math.abs(b.currentBid - v.currentBid))
    .slice(0, 3);
  const betterValue = others
    .map((x) => ({ x, d: dealScore(x).score }))
    .filter((r) => r.d > dealScore(v).score && r.x.currentBid <= mid * 1.1)
    .sort((a, b) => b.d - a.d)
    .slice(0, 3)
    .map((r) => r.x);
  return { similar, betterValue };
}
