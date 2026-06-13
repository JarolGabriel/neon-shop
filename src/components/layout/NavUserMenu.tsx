"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LayoutDashboard, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { getUserFullName } from "@/lib/user-avatar";
import { cn } from "@/lib/utils";

export function NavUserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    toast.success("Sesión cerrada");
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "hidden size-8 overflow-hidden rounded-full p-0 sm:inline-flex",
            "transition-shadow hover:bg-transparent",
            "hover:ring-2 hover:ring-neon-pink/50 dark:hover:ring-cyber-yellow/50",
          )}
          aria-label="Menú de usuario"
        >
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 border border-border/50 bg-neon-surface text-foreground"
      >
        <div className="px-2 py-2">
          <p className="font-heading text-sm font-semibold text-foreground">
            {getUserFullName(user)}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="text-foreground">
          <Link href="/perfil">
            <User />
            Mi perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="text-foreground">
          <Link href="/favoritos">
            <Heart />
            Favoritos
          </Link>
        </DropdownMenuItem>

        {user.role === "admin" ? (
          <DropdownMenuItem asChild className="text-foreground">
            <Link href="/admin">
              <LayoutDashboard />
              Panel admin
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-neon-pink focus:text-neon-pink dark:text-cyber-yellow dark:focus:text-cyber-yellow"
        >
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
