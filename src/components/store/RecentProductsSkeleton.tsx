import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";

const ITEM_CLASS =
  "w-[78%] shrink-0 sm:w-[44%] md:w-[32%] lg:w-[24%] xl:w-[20%]";

export function RecentProductsSkeleton({ title = "Visto recientemente" }) {
  return (
    <section className="w-full py-8 sm:py-12" aria-hidden="true">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-5 border-l-4 border-vite-purple pl-3 font-heading text-xl font-bold text-foreground dark:border-cyber-yellow sm:mb-6 sm:text-2xl lg:text-3xl">
          {title}
        </h2>
      </div>

      <div className="flex gap-3 overflow-hidden pl-4 sm:gap-4 sm:pl-6 lg:mx-auto lg:max-w-7xl lg:pl-8 lg:pr-8">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={ITEM_CLASS}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
