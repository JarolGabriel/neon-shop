import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  title: string;
  value: number | string;
  href?: string;
  icon: LucideIcon;
  className?: string;
}

export function AdminStatCard({
  title,
  value,
  href,
  icon: Icon,
  className,
}: AdminStatCardProps) {
  const content = (
    <Card
      className={cn(
        "border-slate-200 bg-white shadow-sm transition-shadow",
        href && "hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <Icon className="size-4 text-vite-purple" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
