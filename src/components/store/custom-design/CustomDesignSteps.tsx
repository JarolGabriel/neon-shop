import { cn } from "@/lib/utils";

interface CustomDesignStep {
  number: number;
  title: string;
  description: string;
}

const STEPS: CustomDesignStep[] = [
  {
    number: 1,
    title: "Comparte tu idea o logotipo",
    description:
      "Envíanos tu concepto, logotipo o cualquier diseño que tengas en mente.",
  },
  {
    number: 2,
    title: "Recibe tu cotización y diseño",
    description:
      "Transformaremos tu idea en un diseño listo para neón y te enviaremos una maqueta visual junto con una cotización detallada para tu aprobación.",
  },
  {
    number: 3,
    title: "Obtén tu letrero de neón personalizado",
    description:
      "Una vez aprobado, daremos vida a tu diseño. ¡Tu letrero de neón personalizado estará listo y entregado en aproximadamente dos semanas!",
  },
];

interface CustomDesignStepsProps {
  className?: string;
}

export function CustomDesignSteps({ className }: CustomDesignStepsProps) {
  return (
    <section
      aria-label="Cómo funciona el proceso de diseño personalizado"
      className={cn("mx-auto max-w-3xl", className)}
    >
      <ol className="flex flex-col gap-8 sm:gap-10">
        {STEPS.map((step) => (
          <li
            key={step.number}
            className="grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-2 sm:gap-x-3"
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded bg-vite-purple font-heading text-xs font-bold text-white shadow-sm shadow-vite-purple/20"
              aria-hidden
            >
              {step.number}
            </span>
            <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
              {step.title}
            </h2>
            <p className="col-start-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
