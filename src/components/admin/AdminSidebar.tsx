"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onNavigate?: () => void;
  onSignOut: () => void;
}

export function AdminSidebar({ onNavigate, onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <p className="text-lg font-semibold text-slate-900">Neon Shop</p>
        <p className="text-xs text-slate-500">Panel de administración</p>
      </div>

      <nav
        className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4"
        aria-label="Admin"
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.enabled &&
            (item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href));
          const Icon = item.icon;

          if (!item.enabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400"
                aria-disabled
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  Próximamente
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-vite-purple/10 text-vite-purple"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="space-y-1 px-3 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          asChild
        >
          <Link href="/" onClick={onNavigate}>
            <ArrowLeft className="size-4" />
            Volver a la tienda
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          onClick={onSignOut}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
