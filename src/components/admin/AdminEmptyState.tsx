import type { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="size-6 text-slate-400" />
      </div>
      <h3 className="text-base font-medium text-slate-900">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}
