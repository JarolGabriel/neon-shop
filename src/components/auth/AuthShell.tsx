"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-border bg-neon-surface p-6 sm:p-8"
      >
        <h1 className="font-heading text-2xl font-bold text-neon-pink dark:text-cyber-yellow sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  );
}
