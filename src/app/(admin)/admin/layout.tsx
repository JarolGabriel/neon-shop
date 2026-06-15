import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { buildPageMetadata } from "@/lib/metadata-utils";
import { getStoreNameFromDb } from "@/lib/site-settings-server";

export async function generateMetadata(): Promise<Metadata> {
  const storeName = await getStoreNameFromDb();
  return buildPageMetadata("Admin", storeName, {
    robots: { index: false, follow: false },
  });
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
