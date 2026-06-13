"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { useAuth } from "@/context/AuthContext";
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav";

interface AdminShellProps {
  children: React.ReactNode;
}

function getSectionTitle(pathname: string): string {
  const match = ADMIN_NAV_ITEMS.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href),
  );
  return match?.label ?? "Admin";
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isLoading, signOut } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const previousTheme = html.classList.contains("dark") ? "dark" : "light";

    html.classList.remove("dark", "light");
    html.classList.add("light");
    document.body.dataset.admin = "true";

    return () => {
      delete document.body.dataset.admin;
      html.classList.remove("dark", "light");
      html.classList.add(previousTheme);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth/login?redirect=/admin");
      return;
    }

    if (!isAdmin) {
      toast.error("No tienes permisos para acceder al panel admin");
      router.replace("/");
      return;
    }

    setIsAuthorized(true);
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const handleSignOut = () => {
    signOut();
    toast.success("Sesión cerrada");
    router.push("/");
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <AdminTableSkeleton rows={6} columns={4} />
      </div>
    );
  }

  return (
    <ThemeProvider forcedTheme="light" attribute="class" enableSystem={false}>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 shrink-0 border-r border-slate-200 lg:block">
            <AdminSidebar onSignOut={handleSignOut} />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader
              title={getSectionTitle(pathname)}
              onSignOut={handleSignOut}
            />
            <main className="flex-1 p-4 lg:p-6">{children}</main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
