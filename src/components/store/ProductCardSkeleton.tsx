import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-full animate-pulse flex-col overflow-hidden rounded-xl border border-border bg-neon-surface backdrop-blur-md",
        className,
      )}
      aria-hidden="true"
    >
      <div className="aspect-square w-full bg-muted" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-3 w-2/5 rounded bg-muted" />
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="mt-auto flex gap-1.5 pt-1">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} className="size-4 rounded-full bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
