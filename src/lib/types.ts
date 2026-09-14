export type BodyType =
  | "SUV"
  | "Sedan"
  | "Hatchback"
  | "Coupe"
  | "Pickup"
  | "Van"
  | "Convertible";

export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type Transmission = "Automatic" | "Manual";
export type ConditionGrade = "Excellent" | "Very Good" | "Good" | "Fair";
export type AuctionStatus = "live" | "upcoming" | "ended";
export type TitleStatus = "Clean" | "Registered in Lebanon" | "Customs Paid" | "Salvage";

export interface InspectionItem {
  area: string;
  rating: number; // 0-100
  note: string;
}

export interface HistoryEvent {
  date: string;
  label: string;
  detail: string;
}

export interface DamageDisclosure {
  panel: string;
  severity: "None" | "Minor" | "Moderate";
  note: string;
}

export interface BidRecord {
  id: string;
  bidder: string;
  amount: number; // USD
  minutesAgo: number;
  auto?: boolean;
}

export interface VehicleDoc {
  name: string;
  type: "PDF" | "Image";
  size: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  bodyType: BodyType;
  fuel: FuelType;
  transmission: Transmission;
  mileageKm: number;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  drivetrain: string;
  vin: string;
  location: string; // Lebanese governorate / city
  seller: {
    name: string;
    type: "Dealer" | "Private" | "Fleet";
    verified: boolean;
    rating: number;
    salesCount: number;
  };
  titleStatus: TitleStatus;
  conditionGrade: ConditionGrade;
  conditionScore: number; // 0-100
  startingBid: number; // USD
  currentBid: number; // USD
  reservePrice: number; // USD
  reserveMet: boolean;
  bidCount: number;
  bidderCount: number;
  buyNowPrice?: number;
  auctionStatus: AuctionStatus;
  endsInHours: number; // hours from load; negative = ended
  listedDaysAgo: number;
  featured: boolean;
  accentFrom: string;
  accentTo: string;
  highlights: string[];
  description: string;
  options: string[];
  inspection: {
    inspectedBy: string;
    inspectedOn: string;
    overall: number;
    items: InspectionItem[];
  };
  history: HistoryEvent[];
  owners: number;
  serviceHistory: "Full" | "Partial" | "None";
  accidentFree: boolean;
  damages: DamageDisclosure[];
  documents: VehicleDoc[];
  bids: BidRecord[];
  aiValueLow: number; // USD
  aiValueHigh: number; // USD
}

export interface Testimonial {
  name: string;
  role: string;
  city: string;
  quote: string;
  rating: number;
}

export type Locale = "en" | "ar" | "fr";
export type Currency = "USD" | "LBP";
