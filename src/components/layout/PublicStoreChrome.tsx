"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppFloatingButton } from "@/components/shared/WhatsAppFloatingButton";
import { SiteRecentlyViewed } from "@/components/store/SiteRecentlyViewed";

interface PublicStoreChromeProps {
  children: ReactNode;
  /** Server Component pasado desde el layout raíz — evita refetch en cada render. */
  footer: ReactNode;
  whatsappFloatingHref?: string | null;
}

export function PublicStoreChrome({
  children,
  footer,
  whatsappFloatingHref = null,
}: PublicStoreChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <SiteRecentlyViewed />
      {footer}
      <WhatsAppFloatingButton href={whatsappFloatingHref} />
    </>
  );
}
