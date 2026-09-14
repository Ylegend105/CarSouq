import { Skeleton, LineSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-page pt-6">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="mt-4 h-8 w-96 max-w-full" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <Skeleton className="aspect-[16/10] w-full rounded-[var(--radius-lg)]" />
          <div className="mt-3 grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-[var(--radius-xs)]" />
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <LineSkeleton lines={4} />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[420px] rounded-[var(--radius-lg)]" />
          <Skeleton className="h-48 rounded-[var(--radius-lg)]" />
        </div>
      </div>
    </div>
  );
}
