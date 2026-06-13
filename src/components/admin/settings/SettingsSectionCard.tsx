import type { ReactNode } from "react";

interface SettingsSectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
  headerExtra?: ReactNode;
}

export function SettingsSectionCard({
  title,
  description,
  children,
  headerExtra,
}: SettingsSectionCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {headerExtra}
      <div className="mt-6">{children}</div>
    </section>
  );
}
