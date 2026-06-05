"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStickyStop } from "@/context/StickyStopContext";
import { useNavbarHidden } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export function StickySidebar() {
  const navbarHidden = useNavbarHidden();
  const stop = useStickyStop();
  const isStopVisible = stop?.isStopVisible ?? false;

  return (
    <div
      className={cn(
        "lg:transition-[top] lg:duration-300 lg:ease-out",
        isStopVisible
          ? "lg:static"
          : cn("lg:sticky", navbarHidden ? "lg:top-6" : "lg:top-24"),
      )}
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-vite-purple/20 via-vite-dark to-vite-dark p-6 shadow-lg sm:p-7">
        <h3 className="font-heading text-xl font-bold leading-tight text-vite-purple sm:text-2xl">
          Descubre nuestros productos más vendidos
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-white/80">
          Descubre nuestros carteles de neón más vendidos de todos los tiempos:
          ilumina tu espacio con el brillo perfecto.
        </p>

        <Button
          asChild
          size="lg"
          className="mt-6 w-full rounded-full border-0 bg-vite-purple! text-white transition-colors duration-200 hover:bg-neon-pink!"
        >
          <Link href="/productos">Comprar todo</Link>
        </Button>
      </div>
    </div>
  );
}
