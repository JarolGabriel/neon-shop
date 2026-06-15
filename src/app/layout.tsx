import type { Metadata } from "next";
import { PublicStoreChrome } from "@/components/layout/PublicStoreChrome";
import { Footer } from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SiteBrandingProvider } from "@/context/SiteBrandingContext";
import { fetchSiteSettings } from "@/lib/site-settings-server";
import {
  getFounderProfile,
  getSiteMetadata,
  getStoreName,
} from "@/lib/site-settings-utils";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  const meta = getSiteMetadata(settings);

  return {
    title: {
      default: meta.fullTitle,
      template: `%s | ${meta.siteName}`,
    },
    description: meta.siteDescription,
    icons: {
      icon: "/icon.svg",
    },
    openGraph: {
      title: meta.fullTitle,
      description: meta.siteDescription,
      type: "website",
      ...(meta.ogImageUrl ? { images: [{ url: meta.ogImageUrl }] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSiteSettings();
  const storeName = getStoreName(settings);
  const founderProfile = getFounderProfile(settings, storeName);

  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} min-h-full flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SiteBrandingProvider
            storeName={storeName}
            founderProfile={founderProfile}
          >
            <AuthProvider>
              <FavoritesProvider>
                <CartProvider>
                  <PublicStoreChrome footer={<Footer />}>
                    {children}
                  </PublicStoreChrome>
                  <Toaster position="top-center" richColors closeButton offset={80} />
                </CartProvider>
              </FavoritesProvider>
            </AuthProvider>
          </SiteBrandingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
