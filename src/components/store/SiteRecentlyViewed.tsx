"use client";

import { usePathname } from "next/navigation";
import { RecentlyViewedClient } from "@/components/store/RecentlyViewedClient";

const HIDDEN_PREFIXES = ["/auth", "/admin"];

export function SiteRecentlyViewed() {
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const productMatch = pathname.match(/^\/productos\/([^/]+)$/);
  const currentSlug = productMatch?.[1];

  return (
    <div className="border-t border-border bg-background">
      <RecentlyViewedClient currentSlug={currentSlug} />
    </div>
  );
}
