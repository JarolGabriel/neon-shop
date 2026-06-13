import { Skeleton } from "@/components/ui/skeleton";

interface AdminTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function AdminTableSkeleton({
  rows = 5,
  columns = 5,
}: AdminTableSkeletonProps) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-3">
          <Skeleton className="size-14 shrink-0 rounded-md" />
          {Array.from({ length: Math.max(columns - 1, 1) }).map((__, colIndex) => (
            <Skeleton key={colIndex} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
