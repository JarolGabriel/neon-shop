import { cn } from "@/lib/utils";

const LEFT_LABEL = "Calidad y durabilidad superiores";
const RIGHT_LABEL = "Garantía de 2 años";

const PANEL_TEXT_CLASS =
  "font-heading text-sm font-semibold text-white md:text-base lg:text-lg";

/** Morado de marca oscurecido (vite-purple + vite-dark) */
const RIGHT_PANEL_CLASS =
  "bg-linear-to-r from-[color-mix(in_oklch,var(--color-vite-purple)_42%,var(--color-vite-dark))] to-[color-mix(in_oklch,var(--color-vite-purple)_24%,var(--color-vite-dark))]";

interface CustomDesignQualityBannerProps {
  className?: string;
}

export function CustomDesignQualityBanner({
  className,
}: CustomDesignQualityBannerProps) {
  return (
    <section
      aria-label="Calidad y garantía de nuestros letreros"
      className={cn("w-full overflow-hidden", className)}
    >
      {/* Mobile: bloques apilados */}
      <div className="flex flex-col md:hidden">
        <div className="flex min-h-14 items-center justify-center bg-linear-to-r from-vite-purple to-neon-pink px-4 py-3 text-center">
          <p className={PANEL_TEXT_CLASS}>{LEFT_LABEL}</p>
        </div>
        <div
          className={cn(
            "flex min-h-14 items-center justify-center px-4 py-3 text-center",
            RIGHT_PANEL_CLASS,
          )}
        >
          <p className={PANEL_TEXT_CLASS}>{RIGHT_LABEL}</p>
        </div>
      </div>

      {/* Desktop: división diagonal */}
      <div className="relative hidden min-h-20 w-full md:block lg:min-h-24">
        <div
          className="absolute inset-y-0 left-0 z-10 flex w-[58%] items-center justify-center bg-linear-to-r from-vite-purple via-vite-purple to-neon-pink"
          style={{ clipPath: "polygon(0 0, 100% 0, 86% 100%, 0 100%)" }}
        >
          <p className={cn(PANEL_TEXT_CLASS, "max-w-xs px-6 text-center lg:max-w-md")}>
            {LEFT_LABEL}
          </p>
        </div>

        <div
          className={cn(
            "absolute inset-y-0 right-0 flex w-[58%] items-center justify-center",
            RIGHT_PANEL_CLASS,
          )}
          style={{ clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <p className={cn(PANEL_TEXT_CLASS, "px-6 text-center")}>{RIGHT_LABEL}</p>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2 bg-linear-to-b from-neon-pink/60 via-vite-purple/80 to-neon-pink/40 blur-[1px]"
          aria-hidden
        />
      </div>
    </section>
  );
}
