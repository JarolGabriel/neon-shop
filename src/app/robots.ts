import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://neonshop.ve";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/perfil", "/favoritos", "/carrito", "/mi-pedido"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
