"use client";

import { motion } from "framer-motion";
import { PiggyBank, Plug, ShieldCheck, Thermometer } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: Plug,
    title: "Plug & Play",
    description:
      "Tu cartel viene listo para conectarse a la pared y encenderse. Sin cableado técnico.",
  },
  {
    icon: ShieldCheck,
    title: "Resistente y duradero",
    description:
      "Tubos LED flexibles, ultra duraderos y perfectos para cualquier espacio.",
  },
  {
    icon: PiggyBank,
    title: "Ahorra dinero",
    description:
      "80% más eficientes que los neones tradicionales. Hasta 50.000 horas de uso.",
  },
  {
    icon: Thermometer,
    title: "No se calienta",
    description:
      "Seguro al tacto, tecnología que se mantiene fría incluso tras horas de uso.",
  },
];

const CARD_CLASS =
  "flex min-h-[20rem] w-[72vw] max-w-[280px] shrink-0 snap-center flex-col items-center justify-center gap-5 rounded-3xl border border-white/10 bg-linear-to-br from-vite-purple/20 via-vite-dark to-vite-dark p-8 text-center shadow-lg shadow-neon-pink/10 dark:shadow-cyber-yellow/10 sm:min-h-[22rem] md:w-auto md:max-w-none";

function FeatureCard({ item }: { item: FeatureItem }) {
  const { icon: Icon, title, description } = item;
  return (
    <motion.div
      className={CARD_CLASS}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-neon-pink to-vite-purple shadow-md shadow-neon-pink/30">
        <Icon className="size-9 text-white" aria-hidden="true" />
      </span>

      <h3 className="font-heading text-lg font-bold text-vite-purple dark:text-cyber-yellow">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-white/80">{description}</p>
    </motion.div>
  );
}

export function FeaturesGrid({ className }: { className?: string }) {
  return (
    <section className={cn("w-full py-12", className)} aria-label="Beneficios">
      <div className="mx-auto max-w-7xl">
        <div className="flex gap-6 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 md:overflow-visible md:px-6 md:pb-0 lg:grid-cols-4 lg:px-8">
          {FEATURES.map((item) => (
            <FeatureCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
