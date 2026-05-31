import { INFO_TICKER_ITEMS, type InfoTickerItem } from "@/components/shared/info-ticker-data";
import { cn } from "@/lib/utils";

const TICKER_ITEM_COLOR_CLASS =
  "text-neutral-950 transition-colors duration-200 dark:text-white";

interface TickerRowProps {
  items: InfoTickerItem[];
  copyIndex: number;
  ariaHidden?: boolean;
}

function TickerRow({ items, copyIndex, ariaHidden }: TickerRowProps) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden}
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <span
            key={`${copyIndex}-${item.label}`}
            className="mx-6 inline-flex shrink-0 items-center gap-2 sm:mx-10"
          >
            <Icon
              className={cn(
                "size-4 shrink-0 sm:size-5",
                TICKER_ITEM_COLOR_CLASS,
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "text-sm font-bold sm:text-base",
                TICKER_ITEM_COLOR_CLASS,
              )}
            >
              {item.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function InfoTicker() {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        "bg-linear-to-r from-cyber-yellow via-neon-pink to-vite-purple",
        "min-h-11 py-3",
      )}
      role="region"
      aria-label="Beneficios del servicio"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <TickerRow items={INFO_TICKER_ITEMS} copyIndex={0} />
        <TickerRow items={INFO_TICKER_ITEMS} copyIndex={1} ariaHidden />
      </div>
    </div>
  );
}
