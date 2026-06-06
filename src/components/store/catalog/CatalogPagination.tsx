"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  className?: string;
}

function buildPageHref(
  pathname: string,
  searchParams: URLSearchParams,
  page: number,
): string {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function CatalogPagination({
  page,
  totalPages,
  className,
}: CatalogPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const prevHref = buildPageHref(pathname, searchParams, page - 1);
  const nextHref = buildPageHref(pathname, searchParams, page + 1);

  return (
    <nav
      aria-label="Paginación del catálogo"
      className={cn(
        "flex w-full items-center justify-center gap-4 sm:gap-6",
        className,
      )}
    >
      {page > 1 ? (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-border hover:border-neon-pink! hover:text-neon-pink! dark:hover:border-cyber-yellow! dark:hover:text-cyber-yellow!"
          asChild
        >
          <Link
            href={prevHref}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-border"
          disabled
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
      )}

      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>

      {page < totalPages ? (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-border hover:border-neon-pink! hover:text-neon-pink! dark:hover:border-cyber-yellow! dark:hover:text-cyber-yellow!"
          asChild
        >
          <Link
            href={nextHref}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-border"
          disabled
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
