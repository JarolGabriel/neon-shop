"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-neon-surface group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:shadow-vite-purple/10",
          title: "font-heading font-semibold text-foreground",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "group-[.toaster]:border-l-4 group-[.toaster]:border-l-vite-purple dark:group-[.toaster]:border-l-cyber-yellow",
          error:
            "group-[.toaster]:border-l-4 group-[.toaster]:border-l-neon-pink",
          icon: "group-data-[type=success]:text-vite-purple dark:group-data-[type=success]:text-cyber-yellow group-data-[type=error]:text-neon-pink",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
