import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureCTAItem {
  title: string;
  description: string;
  discount: string;
  buttonLabel: string;
  imageSrc: string;
  href: string;
  staggerClass: string;
}

const FEATURE_CTA_ITEMS: FeatureCTAItem[] = [
  {
    title: "Consigue un presupuesto gratuito para un cartel personalizado",
    description:
      "¡Sube tu logo o diseño aquí! O dinos qué quieres que hagan y te ayudaremos a darle vida.",
    discount: "¡25% de descuento ahora mismo!",
    buttonLabel: "Sube tu diseño",
    imageSrc: "/images/cta-custom-budget.jpg",
    href: "/diseno-personalizado",
    staggerClass: "md:-translate-y-4",
  },
  {
    title: "Diseña tu propio cartel de texto",
    description:
      "Haz carteles de neón LED en segundos. Escribe tu texto, selecciona la fuente, elige el color, elige cualquier tamaño: ¡todo depende de ti!",
    discount: "¡Ahora mismo 50% – 60% de descuento!",
    buttonLabel: "Empieza a diseñar ahora",
    imageSrc: "/images/cta-text-generator.jpg",
    href: "/personalizar",
    staggerClass: "md:translate-y-8",
  },
  {
    title: "Compra nuestra colección de carteles de neón",
    description:
      "Echa un vistazo a una amplia selección de carteles de neón prediseñados.",
    discount: "¡Ahora mismo 30% – 40% de descuento!",
    buttonLabel: "Explorar productos",
    imageSrc: "/images/cta-catalog-browse.jpg",
    href: "/productos",
    staggerClass: "md:-translate-y-2",
  },
];

const CARD_CLASS =
  "shadow-[-4px_8px_16px_-10px] shadow-neon-pink/10 transition-shadow duration-300 dark:shadow-cyber-yellow/10 md:hover:shadow-[-6px_12px_20px_-8px] md:hover:shadow-neon-pink/16 dark:md:hover:shadow-cyber-yellow/14";

const CTA_BUTTON_CLASS =
  "w-full border border-transparent bg-vite-purple! text-white transition-colors duration-200 hover:bg-neon-pink! hover:text-white! dark:border-border! dark:bg-card! dark:text-foreground dark:hover:bg-cyber-yellow! dark:hover:text-black! sm:w-auto";

interface FeatureCTACardProps {
  item: FeatureCTAItem;
}

function FeatureCTACard({ item }: FeatureCTACardProps) {
  return (
    <article
      className={cn(
        "group relative flex w-[85vw] max-w-[320px] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground md:w-auto md:max-w-none",
        CARD_CLASS,
        item.staggerClass,
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-6 pb-4 sm:p-7">
        <h2 className="font-heading text-lg font-bold leading-snug text-foreground sm:text-xl">
          {item.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {item.description}
        </p>
        <p className="text-sm font-semibold text-neon-pink dark:text-cyber-yellow">
          {item.discount}
        </p>
        <Button asChild variant="outline" size="lg" className={CTA_BUTTON_CLASS}>
          <Link href={item.href}>{item.buttonLabel}</Link>
        </Button>
      </div>

      <div className="relative aspect-square w-full shrink-0">
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 85vw, 320px"
          className="size-full object-cover object-center transition-transform duration-500 md:group-hover:scale-[1.03]"
        />
      </div>
    </article>
  );
}

export function FeaturesCTA() {
  return (
    <section
      className="relative w-full py-12 md:mx-auto md:max-w-7xl md:px-4 md:py-20"
      aria-label="Servicios destacados"
    >
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-3 md:items-end md:gap-6 md:overflow-visible md:px-0 md:pb-0 md:snap-none">
        {FEATURE_CTA_ITEMS.map((item) => (
          <FeatureCTACard key={item.href + item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
