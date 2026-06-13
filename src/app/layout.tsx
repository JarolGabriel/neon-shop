import type { Metadata } from "next";
import { PublicStoreChrome } from "@/components/layout/PublicStoreChrome";
import { Footer } from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
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

export const metadata: Metadata = {
  title: "The Art Neon | Letreros Personalizados",
  description: "Creamos tu letrero de neón personalizado en Venezuela.",
  icons: {
    icon: "/icon.svg",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} min-h-full flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
