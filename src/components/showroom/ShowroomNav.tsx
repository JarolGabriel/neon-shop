"use client";

import Link from "next/link";
import { Home, PenSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShowroomNavPromos } from "@/components/showroom/ShowroomNavPromos";
import {
  COMMUNITY_LOGIN_REDIRECT,
  COMMUNITY_PATH,
} from "@/lib/community-routes";
import { cn } from "@/lib/utils";

interface ShowroomNavProps {
  onCreateClick: () => void;
  isAuthenticated: boolean;
}

const NAV_ITEMS = [
  { href: COMMUNITY_PATH, label: "Inicio", icon: Home },
  { href: "/productos", label: "Tienda", icon: Sparkles },
] as const;

export function ShowroomNav({
  onCreateClick,
  isAuthenticated,
}: ShowroomNavProps) {
  return (
    <aside className="hidden lg:block lg:-mt-1">
      <div className="sticky top-20 z-10 flex max-h-[calc(100vh-6rem)] flex-col gap-4 bg-background">
        <div className="shrink-0 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="font-heading text-sm font-bold text-foreground">
              Comunidad Neon
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Comparte cómo quedó tu letrero instalado y conecta con otros clientes.
            </p>
            {isAuthenticated ? (
              <Button
                type="button"
                className="mt-4 w-full"
                onClick={onCreateClick}
              >
                <PenSquare className="size-4" />
                Crear publicación
              </Button>
            ) : (
              <Button asChild className="mt-4 w-full">
                <Link href={COMMUNITY_LOGIN_REDIRECT}>Iniciar sesión</Link>
              </Button>
            )}
          </div>

          <nav className="rounded-xl border border-border bg-card p-2">
            <ul className="space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors",
                      "hover:bg-muted hover:text-neon-pink! dark:hover:text-cyber-yellow!",
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-0.5">
          <ShowroomNavPromos />
        </div>
      </div>
    </aside>
  );
}
