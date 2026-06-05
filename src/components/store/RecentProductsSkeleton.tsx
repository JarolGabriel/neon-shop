import { ProductCardSkeleton } from "@/components/store/ProductCardSkeleton";

const ITEM_CLASS =
  "w-[44%] shrink-0 sm:w-[30%] md:w-[23%] lg:w-[18.5%]";

export function RecentProductsSkeleton({ title = "Visto recientemente" }) {
  return (
    <section className="w-full py-12" aria-hidden="true">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 border-l-4 border-vite-purple pl-3 font-heading text-2xl font-bold text-foreground dark:border-cyber-yellow sm:text-3xl">
          {title}
        </h2>
      </div>

      <div className="flex gap-4 overflow-hidden px-4 pb-4 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={ITEM_CLASS}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
