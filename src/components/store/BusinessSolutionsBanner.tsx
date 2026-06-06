"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStickyStop } from "@/context/StickyStopContext";

export function BusinessSolutionsBanner() {
  const stop = useStickyStop();

  return (
    <section
      ref={stop?.registerStopElement}
      className="relative flex min-h-[28rem] w-full items-center overflow-hidden bg-vite-dark sm:min-h-[32rem] lg:min-h-[36rem]"
      aria-labelledby="business-solutions-heading"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/banner-footer-al-por-mayor.jpg)" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-xl rounded-2xl bg-black/40 p-8 text-center backdrop-blur-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vite-purple">
            ¿Pedido al por mayor?
          </p>

          <h2
            id="business-solutions-heading"
            className="mt-3 font-heading text-3xl font-bold leading-tight text-vite-purple sm:text-4xl"
          >
            Soluciones Empresariales
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-white/85 sm:text-base">
            Productos de señalización iluminada personalizada de alta calidad y
            precios reales al por mayor. Neon-Shop. lleva más de Dos años
            gestionando pedidos de gran cantidad, incluyendo logística Nacional.
            Nuestros amables representantes mayoristas te ofrecerán asesoramiento
            y te ayudarán con tu pedido desde el concepto hasta la entrega.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full border-0 bg-vite-purple! px-8 text-white transition-colors duration-200 hover:bg-neon-pink!"
          >
            <Link href="/diseno-personalizado">Más Información</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
