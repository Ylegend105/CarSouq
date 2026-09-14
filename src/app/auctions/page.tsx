import type { Metadata } from "next";
import InventoryView from "@/components/discovery/InventoryView";

export const metadata: Metadata = {
  title: "Live vehicle auctions",
  description:
    "Browse independently inspected vehicles across Lebanon. Filter by make, model, price, mileage, body type, location and auction status.",
};

export default function AuctionsPage() {
  return <InventoryView />;
}
