import type { Metadata } from "next";
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
    <html lang="es" className={` h-full antialiased`}>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
