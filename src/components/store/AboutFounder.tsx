"use client";

import Image from "next/image";
import { useFounderProfile, useStoreName } from "@/context/SiteBrandingContext";
import { interpolateStoreName } from "@/lib/store-branding";

const FOUNDER_PARAGRAPHS = [
  "Desde 2024, {{store_name}}. ha facilitado y es asequible a la creación de letreros de neón personalizados de alta calidad, tan elegantes como duraderos.",
  "Confiados por marcas y locales Nacionales, clientes famosos y decenas de miles de clientes en todo Venezuela, hemos construido nuestra reputación con un diseño destacado, una artesanía experta y un servicio líder en el sector.",
  "Con más de unos años de experiencia, ofrecemos neón premium — ya sea LED o cristal real — adaptado a tu visión, tu espacio y tu estilo.",
  "Desde el primer concepto hasta el brillo final, nuestro equipo está aquí para dar vida a tu cartel personalizado — con una calidad, variedad y soporte inigualables.",
] as const;

const IMAGE_GLOW =
  "shadow-[-4px_10px_20px_-10px] shadow-neon-pink/12 dark:shadow-[-4px_10px_20px_-10px] dark:shadow-cyber-yellow/10";

export function AboutFounder() {
  const storeName = useStoreName();
  const { name, imageUrl, imageAlt, sectionHeading } = useFounderProfile();

  return (
    <section className="px-4 py-16" aria-labelledby="about-founder-heading">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-border/50 bg-card/40 p-6 backdrop-blur-md md:p-10">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <figure className="md:col-span-5">
            <div
              className={`relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/70 bg-card/50 ${IMAGE_GLOW}`}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-center"
                unoptimized={imageUrl.startsWith("/storage/")}
              />
            </div>
            <figcaption className="mt-4 text-center text-base font-bold text-foreground sm:text-lg">
              {name}
            </figcaption>
          </figure>

          <div className="space-y-4 md:col-span-7">
            <h2
              id="about-founder-heading"
              className="font-heading text-3xl font-bold text-foreground md:text-4xl"
            >
              {sectionHeading}
            </h2>
            {FOUNDER_PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-muted-foreground"
              >
                {interpolateStoreName(paragraph, storeName)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
