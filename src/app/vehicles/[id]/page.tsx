import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VEHICLES, getVehicle, relatedVehicles } from "@/lib/data";
import VehicleDetail from "@/components/vehicle/VehicleDetail";

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ id: v.id }));
}

export async function generateMetadata(props: PageProps<"/vehicles/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const v = getVehicle(id);
  if (!v) return { title: "Vehicle not found" };
  return {
    title: `${v.year} ${v.make} ${v.model} ${v.trim}`,
    description: `${v.year} ${v.make} ${v.model} — ${v.mileageKm.toLocaleString()} km, ${v.location}. Condition ${v.conditionScore}/100. ${v.description}`,
  };
}

export default async function VehiclePage(props: PageProps<"/vehicles/[id]">) {
  const { id } = await props.params;
  const v = getVehicle(id);
  if (!v) notFound();
  return <VehicleDetail vehicle={v} related={relatedVehicles(v, 3)} />;
}
