import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer contraseña | Neon Shop",
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
