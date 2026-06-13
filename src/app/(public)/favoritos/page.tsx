import type { Metadata } from "next";
import { FavoritosPageContent } from "@/components/store/FavoritosPageContent";

export const metadata: Metadata = {
  title: "Mis favoritos | Neon Shop",
  description:
    "Guarda y revisa tus letreros de neón favoritos en Neon Shop.",
  robots: { index: false, follow: false },
};

export default function FavoritosPage() {
  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FavoritosPageContent />
      </div>
    </section>
  );
}
