import * as React from "react";

import { cn } from "@/lib/utils";

function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        "flex h-9 w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm text-foreground transition-colors outline-none",
        "focus-visible:border-vite-purple focus-visible:ring-2 focus-visible:ring-vite-purple/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/25",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { NativeSelect };
