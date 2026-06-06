import { FeatureShowcaseBlockItem } from "@/components/store/custom-design/FeatureShowcaseBlock";
import { FEATURE_SHOWCASE_BLOCKS } from "@/components/store/custom-design/feature-showcase-data";
import { cn } from "@/lib/utils";

interface FeatureShowcaseProps {
  className?: string;
}

export function FeatureShowcase({ className }: FeatureShowcaseProps) {
  return (
    <section
      aria-label="Casos y beneficios del diseño personalizado"
      className={cn("bg-background", className)}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-16 py-12 md:gap-20 md:py-16 lg:my-16">
          {FEATURE_SHOWCASE_BLOCKS.map((block) => (
            <FeatureShowcaseBlockItem key={block.id} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}
