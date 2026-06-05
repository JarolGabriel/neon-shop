import type { LucideIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ProductAccordionItem {
  id: string;
  title: string;
  content: string;
  icon: LucideIcon;
}

interface ProductAccordionProps {
  items: ProductAccordionItem[];
}

export function ProductAccordion({ items }: ProductAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl border border-border bg-neon-surface px-4 backdrop-blur-md sm:px-5"
    >
      {items.map(({ id, title, content, icon: Icon }) => (
        <AccordionItem key={id} value={id} className="border-border">
          <AccordionTrigger className="text-foreground hover:no-underline hover:text-neon-pink! dark:hover:text-cyber-yellow!">
            <span className="flex items-center gap-3">
              <Icon
                className="size-4 shrink-0 text-vite-purple dark:text-cyber-yellow"
                aria-hidden="true"
              />
              {title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
