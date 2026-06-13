"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { CUSTOM_NAV_ITEMS, NAV_ACTION_BTN } from "@/components/layout/navbar-links";
import { COMMUNITY_PATH } from "@/lib/community-routes";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { getUserFullName } from "@/lib/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

interface NavbarMobileMenuProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export function NavbarMobileMenu({
  isAuthenticated,
  user,
}: NavbarMobileMenuProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    toast.success("Sesión cerrada");
    router.push("/");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(NAV_ACTION_BTN, "lg:hidden")}
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-border bg-neon-surface sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-neon-pink dark:text-cyber-yellow">
            Menú
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-6 px-4">
          <MobileStoreSection />
          <MobileSection
            title="Carteles Personalizados"
            items={CUSTOM_NAV_ITEMS}
          />

          <div className="flex flex-col gap-1">
            <Link href="/quienes-somos" className="nav-link">
              Quiénes somos
            </Link>
            <Link href={COMMUNITY_PATH} className="nav-link">
              Comunidad
            </Link>
          </div>

          <div className="border-t border-border/50 pt-4">
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    user={user}
                    useNextImageForUpload={false}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-semibold text-foreground">
                      {getUserFullName(user)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className={cn(
                    NAV_ACTION_BTN,
                    "justify-start text-neon-pink dark:text-cyber-yellow",
                  )}
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </Button>

                <Button
                  variant="ghost"
                  className={cn(NAV_ACTION_BTN, "justify-start")}
                  asChild
                >
                  <Link href="/perfil">
                    <User className="size-4" />
                    Mi perfil
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className={cn(NAV_ACTION_BTN, "justify-start")}
                  asChild
                >
                  <Link href="/favoritos">
                    <Heart className="size-4" />
                    Favoritos
                  </Link>
                </Button>

                {user.role === "admin" ? (
                  <Button
                    variant="ghost"
                    className={cn(NAV_ACTION_BTN, "justify-start")}
                    asChild
                  >
                    <Link href="/admin">
                      <LayoutDashboard className="size-4" />
                      Panel admin
                    </Link>
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className={cn(NAV_ACTION_BTN, "justify-start")}
                  asChild
                >
                  <Link href="/auth/login">Iniciar sesión</Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-full border-neon-pink/30 hover:border-neon-pink hover:text-neon-pink dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow"
                  asChild
                >
                  <Link href="/auth/registro">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileStoreSection() {
  const { categories, isLoading, error } = useCategories();

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tienda
      </p>
      <ul className="flex flex-col gap-0.5">
        <li>
          <Link href="/productos" className="nav-dropdown-item text-xs">
            Ver todos
          </Link>
        </li>
        {isLoading && (
          <li className="px-3 py-2 text-xs text-muted-foreground">
            Cargando…
          </li>
        )}
        {error && (
          <li className="px-3 py-2 text-xs text-muted-foreground">{error}</li>
        )}
        {!isLoading &&
          !error &&
          categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/productos?category=${encodeURIComponent(category.slug)}`}
                className="nav-dropdown-item text-xs"
              >
                {category.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

interface MobileSectionProps {
  title: string;
  items: { label: string; href: string }[];
}

function MobileSection({ title, items }: MobileSectionProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="nav-dropdown-item text-xs">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
