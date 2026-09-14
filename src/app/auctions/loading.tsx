import { VehicleGridSkeleton } from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-page section !py-12">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-80 max-w-full" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-[600px] rounded-[var(--radius-lg)] lg:block" />
        <VehicleGridSkeleton count={6} />
      </div>
    </div>
  );
}
