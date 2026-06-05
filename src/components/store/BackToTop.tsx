"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex w-full justify-center px-4 pb-16">
      <Button
        variant="outline"
        size="lg"
        onClick={scrollToTop}
        className="group rounded-full border-border px-6 hover:border-vite-purple! hover:text-vite-purple! dark:hover:border-cyber-yellow! dark:hover:text-cyber-yellow!"
      >
        <ArrowUp className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
        Volver arriba
      </Button>
    </div>
  );
}
