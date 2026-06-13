"use client";

import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProfileActivityAccordionProps {
  id: string;
  title: string;
  count: number;
  children: ReactNode;
}

export function ProfileActivityAccordion({
  id,
  title,
  count,
  children,
}: ProfileActivityAccordionProps) {
  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {children}
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border border-border">
      <AccordionItem value={id} className="border-b-0 px-1">
        <AccordionTrigger className="px-3 py-3 hover:no-underline">
          <span className="text-sm font-semibold text-foreground">
            {title}
            <span className="ml-2 font-normal text-muted-foreground">
              ({count})
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="px-3 pb-3">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
