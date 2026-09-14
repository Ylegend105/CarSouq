import type { Testimonial, Vehicle } from "./types";

export const USD_TO_LBP = 89500;

export const LEBANON_LOCATIONS = [
  "Beirut",
  "Jounieh",
  "Jbeil (Byblos)",
  "Zahlé",
  "Tripoli",
  "Saida (Sidon)",
  "Tyre (Sour)",
  "Baabda",
  "Antelias",
  "Dbayeh",
  "Aley",
  "Zgharta",
] as const;

const baseInspection = (overall: number) => ({
  inspectedBy: "CarSouq Certified Inspection — 212-point check",
  inspectedOn: "2026-08-21",
  overall,
  items: [
    { area: "Engine & drivetrain", rating: overall + 2, note: "Cold start clean, no leaks, healthy compression." },
    { area: "Transmission", rating: overall, note: "Smooth shifts through all gears, no slip on road test." },
    { area: "Suspension & steering", rating: overall - 3, note: "Bushings within spec, alignment true, no play." },
    { area: "Brakes", rating: overall - 1, note: "Pads ~60% front, ~70% rear. Discs within tolerance." },
    { area: "Exterior & paint", rating: overall - 5, note: "Paint depth consistent; minor stone chips on bonnet." },
    { area: "Interior & electronics", rating: overall - 2, note: "All modules respond, infotainment paired, AC cold." },
    { area: "Tyres", rating: overall - 4, note: "Matching set, 5–6mm tread, DOT within 3 years." },
    { area: "Underbody & structure", rating: overall + 1, note: "No structural repair, factory seam sealer intact." },
  ],
});

const baseDocs = [
  { name: "CarSouq inspection report.pdf", type: "PDF" as const, size: "3.1 MB" },
  { name: "Service history summary.pdf", type: "PDF" as const, size: "1.4 MB" },
  { name: "Registration (Mécanique).pdf", type: "PDF" as const, size: "820 KB" },
  { name: "Customs clearance.pdf", type: "PDF" as const, size: "610 KB" },
  { name: "Undercarriage photos.zip", type: "Image" as const, size: "12.6 MB" },
];

type VehicleSeed = Partial<Vehicle> &
  Pick<
    Vehicle,
    | "make"
    | "model"
    | "trim"
    | "year"
    | "bodyType"
    | "fuel"
    | "transmission"
    | "mileageKm"
    | "location"
    | "currentBid"
    | "reservePrice"
    | "conditionScore"
    | "accentFrom"
    | "accentTo"
  >;

let seq = 0;
function build(seed: VehicleSeed): Vehicle {
  seq += 1;
  const slug = `${seed.year}-${seed.make}-${seed.model}-${seed.trim}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const id = String(seq).padStart(3, "0");
  const startingBid = seed.startingBid ?? Math.round(seed.currentBid * 0.72);
  const grade =
    seed.conditionScore >= 90
      ? "Excellent"
      : seed.conditionScore >= 82
        ? "Very Good"
        : seed.conditionScore >= 72
          ? "Good"
          : "Fair";
  const reserveMet = seed.currentBid >= seed.reservePrice;
  const aiMid = Math.round((seed.currentBid + seed.reservePrice) / 2 / 100) * 100;
  return {
    id,
    slug,
    engine: "—",
    drivetrain: seed.bodyType === "SUV" || seed.bodyType === "Pickup" ? "AWD / 4x4" : "FWD",
    vin: `MRK${seed.year}${seed.make.slice(0, 2).toUpperCase()}${id}0LB${1000 + seq}`,
    exteriorColor: "Metallic Grey",
    interiorColor: "Black leather",
    seller: {
      name: "Cedars Auto Gallery",
      type: "Dealer",
      verified: true,
      rating: 4.8,
      salesCount: 240,
    },
    titleStatus: "Registered in Lebanon",
    conditionGrade: grade,
    startingBid,
    reserveMet,
    bidCount: seed.bidCount ?? 14,
    bidderCount: seed.bidderCount ?? 7,
    auctionStatus: "live",
    endsInHours: seed.endsInHours ?? 30,
    listedDaysAgo: seed.listedDaysAgo ?? 3,
    featured: seed.featured ?? false,
    highlights: seed.highlights ?? [
      "CarSouq-certified inspection",
      "Full service history",
      "Accident-free structure",
    ],
    description:
      seed.description ??
      `A well-kept ${seed.year} ${seed.make} ${seed.model} ${seed.trim} maintained in Lebanon with documented service. Presented with a full CarSouq inspection, transparent history, and clear disclosures.`,
    options: seed.options ?? [
      "Panoramic roof",
      "Heated seats",
      "Apple CarPlay / Android Auto",
      "360° camera",
      "Adaptive cruise control",
      "Keyless entry & start",
    ],
    inspection: seed.inspection ?? baseInspection(seed.conditionScore),
    history: seed.history ?? [
      {
        date: `${seed.year}`,
        label: "First registered in Lebanon",
        detail: `Delivered new and registered to a private owner in ${seed.location}.`,
      },
      {
        date: `${seed.year + 1}`,
        label: "Scheduled dealer service",
        detail: "Oil, filters and inspection carried out at the franchised dealer; no faults recorded.",
      },
      {
        date: `${Math.min(2025, seed.year + 3)}`,
        label: "Ownership transfer",
        detail: "Sold to the current owner with full history handed over.",
      },
      {
        date: "2026",
        label: "CarSouq 212-point inspection",
        detail: `Independently inspected ahead of this auction — overall score ${seed.conditionScore}/100.`,
      },
    ],
    owners: seed.owners ?? 2,
    serviceHistory: seed.serviceHistory ?? "Full",
    accidentFree: seed.accidentFree ?? true,
    damages: seed.damages ?? [
      { panel: "Front bumper", severity: "Minor", note: "Two stone chips, touched in." },
      { panel: "Rear alloy wheel", severity: "Minor", note: "Light kerb rash, cosmetic only." },
    ],
    documents: seed.documents ?? baseDocs,
    bids:
      seed.bids ??
      [
        { id: "b1", bidder: "bidder_4471", amount: seed.currentBid, minutesAgo: 12 },
        { id: "b2", bidder: "bidder_2290", amount: seed.currentBid - 400, minutesAgo: 41 },
        { id: "b3", bidder: "bidder_8123", amount: seed.currentBid - 900, minutesAgo: 96, auto: true },
        { id: "b4", bidder: "bidder_1567", amount: seed.currentBid - 1500, minutesAgo: 180 },
        { id: "b5", bidder: "bidder_2290", amount: startingBid, minutesAgo: 320 },
      ],
    aiValueLow: seed.aiValueLow ?? aiMid - Math.round(aiMid * 0.06),
    aiValueHigh: seed.aiValueHigh ?? aiMid + Math.round(aiMid * 0.08),
    ...seed,
  } as Vehicle;
}

export const VEHICLES: Vehicle[] = [
  build({
    make: "Mercedes-Benz",
    model: "C 300",
    trim: "AMG Line",
    year: 2021,
    bodyType: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 46000,
    exteriorColor: "Selenite Grey",
    engine: "2.0L turbo I4 · 258 hp",
    drivetrain: "RWD",
    location: "Beirut",
    currentBid: 27400,
    reservePrice: 29500,
    conditionScore: 92,
    bidCount: 23,
    bidderCount: 11,
    endsInHours: 5.5,
    listedDaysAgo: 4,
    featured: true,
    accentFrom: "#4f46e5",
    accentTo: "#7c3aed",
    highlights: [
      "One Lebanese owner from new",
      "Mercedes-Benz Lebanon service history",
      "Burmester sound · head-up display",
    ],
    options: [
      "AMG Line exterior & interior",
      "Panoramic sliding roof",
      "Burmester surround sound",
      "Head-up display",
      "Ambient lighting (64 colour)",
      "Wireless Apple CarPlay",
      "Memory front seats",
    ],
  }),
  build({
    make: "Toyota",
    model: "Land Cruiser Prado",
    trim: "VXR",
    year: 2019,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 88000,
    exteriorColor: "Pearl White",
    interiorColor: "Beige leather",
    engine: "4.0L V6 · 271 hp",
    drivetrain: "Full-time 4WD",
    location: "Zahlé",
    currentBid: 38900,
    reservePrice: 38000,
    conditionScore: 86,
    bidCount: 31,
    bidderCount: 14,
    endsInHours: 22,
    featured: true,
    accentFrom: "#0ea5e9",
    accentTo: "#4f46e5",
    highlights: [
      "Bekaa-owned, highway kilometres",
      "Timing serviced, new tyres",
      "7 seats · KDSS suspension",
    ],
  }),
  build({
    make: "BMW",
    model: "330i",
    trim: "M Sport",
    year: 2020,
    bodyType: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 52000,
    exteriorColor: "Portimao Blue",
    engine: "2.0L turbo I4 · 258 hp",
    drivetrain: "RWD",
    location: "Jounieh",
    currentBid: 24800,
    reservePrice: 26500,
    conditionScore: 88,
    bidCount: 19,
    bidderCount: 9,
    endsInHours: 3.2,
    featured: true,
    accentFrom: "#2563eb",
    accentTo: "#7c3aed",
    highlights: [
      "M Sport package · Harman Kardon",
      "Laserlight headlights",
      "BMW Lebanon warranty history",
    ],
  }),
  build({
    make: "Range Rover",
    model: "Evoque",
    trim: "R-Dynamic SE",
    year: 2021,
    bodyType: "SUV",
    fuel: "Hybrid",
    transmission: "Automatic",
    mileageKm: 39000,
    exteriorColor: "Santorini Black",
    engine: "2.0L MHEV I4 · 249 hp",
    location: "Dbayeh",
    currentBid: 33500,
    reservePrice: 37000,
    conditionScore: 84,
    bidCount: 16,
    bidderCount: 8,
    endsInHours: 47,
    accentFrom: "#7c3aed",
    accentTo: "#db2777",
    highlights: [
      "Mild-hybrid, low running costs",
      "Meridian sound · 20\" alloys",
      "Full digital cockpit",
    ],
    damages: [
      { panel: "Driver door", severity: "Moderate", note: "Repainted after parking dent — disclosed, blends well." },
      { panel: "Windscreen", severity: "Minor", note: "Small chip lower passenger side, not in line of sight." },
    ],
    accidentFree: false,
  }),
  build({
    make: "Hyundai",
    model: "Tucson",
    trim: "Smart",
    year: 2022,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 31000,
    exteriorColor: "Amazon Grey",
    engine: "2.0L I4 · 156 hp",
    location: "Tripoli",
    currentBid: 21900,
    reservePrice: 21500,
    conditionScore: 90,
    bidCount: 12,
    bidderCount: 6,
    endsInHours: 12,
    accentFrom: "#0ea5e9",
    accentTo: "#22c55e",
    highlights: [
      "Under Century Motor Co. warranty",
      "One owner · non-smoker",
      "Wireless charging · digital key",
    ],
  }),
  build({
    make: "Jeep",
    model: "Wrangler",
    trim: "Sahara Unlimited",
    year: 2018,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 74000,
    exteriorColor: "Firecracker Red",
    engine: "3.6L V6 · 285 hp",
    location: "Jbeil (Byblos)",
    currentBid: 26400,
    reservePrice: 28000,
    conditionScore: 80,
    bidCount: 21,
    bidderCount: 10,
    endsInHours: 0.6,
    accentFrom: "#dc2626",
    accentTo: "#ea580c",
    highlights: [
      "Hardtop + soft top included",
      "New BF Goodrich A/T tyres",
      "Alpine premium audio",
    ],
  }),
  build({
    make: "Porsche",
    model: "Macan",
    trim: "Base",
    year: 2020,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 58000,
    exteriorColor: "Dolomite Silver",
    engine: "2.0L turbo I4 · 245 hp",
    location: "Beirut",
    currentBid: 41200,
    reservePrice: 45000,
    conditionScore: 87,
    bidCount: 27,
    bidderCount: 12,
    endsInHours: 30,
    featured: true,
    accentFrom: "#4f46e5",
    accentTo: "#0ea5e9",
    highlights: [
      "Porsche Approved history",
      "Sport Chrono · PASM",
      "14-way electric seats",
    ],
  }),
  build({
    make: "Kia",
    model: "Sportage",
    trim: "LX",
    year: 2021,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 43000,
    exteriorColor: "Snow White Pearl",
    engine: "2.0L I4 · 155 hp",
    location: "Saida (Sidon)",
    currentBid: 17800,
    reservePrice: 17500,
    conditionScore: 85,
    bidCount: 9,
    bidderCount: 5,
    endsInHours: 61,
    accentFrom: "#22c55e",
    accentTo: "#0ea5e9",
  }),
  build({
    make: "Volkswagen",
    model: "Golf GTI",
    trim: "Mk7.5",
    year: 2019,
    bodyType: "Hatchback",
    fuel: "Petrol",
    transmission: "Manual",
    mileageKm: 61000,
    exteriorColor: "Tornado Red",
    engine: "2.0L TSI · 245 hp",
    location: "Antelias",
    currentBid: 18600,
    reservePrice: 20000,
    conditionScore: 83,
    bidCount: 18,
    bidderCount: 9,
    endsInHours: 8,
    accentFrom: "#dc2626",
    accentTo: "#7c3aed",
    highlights: [
      "Manual gearbox · enthusiast owned",
      "Stage 1 removed, stock ECU",
      "DCC adaptive dampers",
    ],
  }),
  build({
    make: "Nissan",
    model: "Patrol",
    trim: "SE Platinum",
    year: 2017,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 119000,
    exteriorColor: "Galaxy Black",
    interiorColor: "Almond leather",
    engine: "5.6L V8 · 400 hp",
    location: "Baabda",
    currentBid: 29500,
    reservePrice: 33000,
    conditionScore: 76,
    bidCount: 24,
    bidderCount: 11,
    endsInHours: 15,
    accentFrom: "#334155",
    accentTo: "#4f46e5",
    serviceHistory: "Partial",
    highlights: [
      "8 seats · rear entertainment",
      "New suspension bushes & shocks",
      "Cooled front seats",
    ],
  }),
  build({
    make: "MINI",
    model: "Cooper S",
    trim: "3-Door",
    year: 2020,
    bodyType: "Hatchback",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 37000,
    exteriorColor: "Chili Red",
    engine: "2.0L turbo · 192 hp",
    location: "Beirut",
    currentBid: 16400,
    reservePrice: 16200,
    conditionScore: 89,
    bidCount: 11,
    bidderCount: 7,
    endsInHours: 4,
    accentFrom: "#db2777",
    accentTo: "#f97316",
  }),
  build({
    make: "Toyota",
    model: "Corolla",
    trim: "XLI",
    year: 2023,
    bodyType: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 18000,
    exteriorColor: "Celestite Grey",
    engine: "1.6L I4 · 121 hp",
    location: "Zgharta",
    currentBid: 19400,
    reservePrice: 19200,
    conditionScore: 94,
    bidCount: 15,
    bidderCount: 8,
    endsInHours: 26,
    accentFrom: "#0ea5e9",
    accentTo: "#4f46e5",
    owners: 1,
    highlights: [
      "As-new, first owner",
      "BUMC warranty transferable",
      "Toyota Safety Sense",
    ],
  }),
  build({
    make: "Chevrolet",
    model: "Tahoe",
    trim: "LT",
    year: 2016,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 142000,
    exteriorColor: "Silver Ice",
    engine: "5.3L V8 · 355 hp",
    location: "Tyre (Sour)",
    currentBid: 18900,
    reservePrice: 21000,
    conditionScore: 71,
    bidCount: 13,
    bidderCount: 6,
    endsInHours: -3,
    accentFrom: "#64748b",
    accentTo: "#0ea5e9",
    auctionStatus: "ended",
    serviceHistory: "Partial",
  }),
  build({
    make: "Audi",
    model: "Q5",
    trim: "45 TFSI quattro",
    year: 2021,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 44000,
    exteriorColor: "Navarra Blue",
    engine: "2.0L turbo · 265 hp",
    location: "Aley",
    currentBid: 31200,
    reservePrice: 30800,
    conditionScore: 88,
    bidCount: 20,
    bidderCount: 10,
    endsInHours: 38,
    accentFrom: "#2563eb",
    accentTo: "#4f46e5",
  }),
  build({
    make: "Ford",
    model: "Mustang",
    trim: "GT 5.0",
    year: 2019,
    bodyType: "Coupe",
    fuel: "Petrol",
    transmission: "Manual",
    mileageKm: 49000,
    exteriorColor: "Race Red",
    engine: "5.0L V8 · 460 hp",
    location: "Jounieh",
    currentBid: 27900,
    reservePrice: 31000,
    conditionScore: 82,
    bidCount: 22,
    bidderCount: 12,
    endsInHours: 19,
    accentFrom: "#dc2626",
    accentTo: "#1d4ed8",
    highlights: [
      "Active valve exhaust",
      "Recaro seats · MagneRide",
      "Enthusiast maintained",
    ],
  }),
  build({
    make: "Hyundai",
    model: "Elantra",
    trim: "GL",
    year: 2022,
    bodyType: "Sedan",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 27000,
    exteriorColor: "Fluid Metal",
    engine: "1.6L I4 · 128 hp",
    location: "Tripoli",
    currentBid: 15600,
    reservePrice: 15400,
    conditionScore: 91,
    bidCount: 8,
    bidderCount: 5,
    endsInHours: 52,
    accentFrom: "#0ea5e9",
    accentTo: "#22c55e",
  }),
  build({
    make: "Land Rover",
    model: "Defender 110",
    trim: "S",
    year: 2022,
    bodyType: "SUV",
    fuel: "Diesel",
    transmission: "Automatic",
    mileageKm: 34000,
    exteriorColor: "Gondwana Stone",
    engine: "3.0L D250 I6 · 249 hp",
    location: "Beirut",
    currentBid: 52000,
    reservePrice: 58000,
    conditionScore: 90,
    bidCount: 29,
    bidderCount: 15,
    endsInHours: 2.1,
    featured: true,
    accentFrom: "#4f46e5",
    accentTo: "#0ea5e9",
    highlights: [
      "Air suspension · Meridian",
      "Electronic active differential",
      "Cold-climate & towing packs",
    ],
  }),
  build({
    make: "Nissan",
    model: "Kicks",
    trim: "SV",
    year: 2021,
    bodyType: "SUV",
    fuel: "Petrol",
    transmission: "Automatic",
    mileageKm: 41000,
    exteriorColor: "Monarch Orange",
    engine: "1.6L I4 · 118 hp",
    location: "Baabda",
    currentBid: 13900,
    reservePrice: 13600,
    conditionScore: 86,
    bidCount: 7,
    bidderCount: 4,
    endsInHours: 70,
    accentFrom: "#f97316",
    accentTo: "#db2777",
  }),
];

export function getVehicle(idOrSlug: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === idOrSlug || v.slug === idOrSlug);
}

export function relatedVehicles(v: Vehicle, count = 3): Vehicle[] {
  return VEHICLES.filter((x) => x.id !== v.id)
    .map((x) => ({
      x,
      score:
        (x.bodyType === v.bodyType ? 3 : 0) +
        (x.make === v.make ? 2 : 0) +
        (Math.abs(x.currentBid - v.currentBid) < 8000 ? 2 : 0) +
        (Math.abs(x.year - v.year) <= 2 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((r) => r.x);
}

export const MAKES = [...new Set(VEHICLES.map((v) => v.make))].sort();
export const BODY_TYPES = [...new Set(VEHICLES.map((v) => v.bodyType))].sort();

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rami Khoury",
    role: "Bought a 2021 Mercedes C 300",
    city: "Beirut",
    quote:
      "The inspection report was more detailed than anything a dealer showed me. I bid from my phone during a work trip and won — the car was exactly as described.",
    rating: 5,
  },
  {
    name: "Nour Haddad",
    role: "Sold a 2019 BMW 320i",
    city: "Jounieh",
    quote:
      "I set a reserve, the AI suggested a realistic price, and I had eleven serious bidders in four days. Payout landed the day after the buyer collected.",
    rating: 5,
  },
  {
    name: "Georges Aoun",
    role: "Fleet manager",
    city: "Zahlé",
    quote:
      "We remarket end-of-lease vehicles through CarSouq now. Transparent bid history means no arguments, and the local support team actually answers.",
    rating: 4,
  },
  {
    name: "Layla Fares",
    role: "First-time buyer",
    city: "Tripoli",
    quote:
      "I was nervous about buying at auction. The Deal Score and the AI assistant explaining common issues for the model made me feel like I knew the car.",
    rating: 5,
  },
];

export const STATS = [
  { value: "6,400+", label: "Vehicles sold" },
  { value: "$180M+", label: "In transactions" },
  { value: "212-point", label: "Inspection standard" },
  { value: "4.8/5", label: "Buyer rating" },
];

export const FAQ = [
  {
    q: "How does bidding work?",
    a: "Register and verify your identity, add a payment method, then place a bid on any live lot. Bids are binding. If you are the highest bidder when the timer hits zero and the reserve is met, you win.",
  },
  {
    q: "What is a reserve price?",
    a: "The minimum the seller will accept, kept private. The listing shows whether the reserve is met. If bidding ends below reserve, we help negotiate a post-auction deal between the top bidder and the seller.",
  },
  {
    q: "What fees do buyers pay?",
    a: "A buyer's premium of 4.5% of the hammer price (minimum $300, capped at $1,800), plus a $150 documentation fee. Registration transfer and mécanique are handled for an optional $220.",
  },
  {
    q: "Are the vehicles inspected?",
    a: "Every vehicle on CarSouq receives an independent 212-point inspection with photos, a condition score, and full damage disclosure before it goes live.",
  },
  {
    q: "How fast do sellers get paid?",
    a: "Funds are held securely until the buyer collects and confirms. Payout is released within one business day, by bank transfer or OMT.",
  },
  {
    q: "Can I buy from outside Lebanon?",
    a: "Yes. Diaspora buyers can bid, pay, and appoint a local representative for collection. We can also arrange storage and export paperwork.",
  },
];
