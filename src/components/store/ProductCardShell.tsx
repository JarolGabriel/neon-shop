"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProductCardShellProps {
  children: ReactNode;
  className?: string;
}

export function ProductCardShell({ children, className }: ProductCardShellProps) {
  return (
    <motion.article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border",
        "bg-neon-surface backdrop-blur-md",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-vite-purple hover:shadow-[0_8px_24px_-8px] hover:shadow-vite-purple/15",
        "dark:hover:border-cyber-yellow dark:hover:shadow-cyber-yellow/15",
        className,
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {children}
    </motion.article>
  );
}
