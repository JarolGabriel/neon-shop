"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadProfileAvatar } from "@/lib/api";
import { getUserInitials } from "@/lib/user-avatar";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

interface ProfileAvatarSectionProps {
  accessToken: string;
  avatarUrl: string | null;
  displayUser: Pick<AuthUser, "first_name" | "last_name" | "email">;
  onAvatarUpdated: (url: string) => void;
}

export function ProfileAvatarSection({
  accessToken,
  avatarUrl,
  displayUser,
  onAvatarUpdated,
}: ProfileAvatarSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  const initials = useMemo(
    () =>
      getUserInitials({
        ...displayUser,
        id: "",
        role: "customer",
        avatar_url: null,
        phone: null,
      }),
    [displayUser.email, displayUser.first_name, displayUser.last_name],
  );

  useEffect(() => {
    setImageReady(false);
  }, [avatarUrl]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Subiendo foto...");

    try {
      const { avatar_url } = await uploadProfileAvatar(accessToken, file);
      onAvatarUpdated(avatar_url);
      toast.success("Foto actualizada", { id: toastId });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo subir la foto";
      toast.error(message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 flex justify-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={cn(
          "group relative size-24 overflow-hidden rounded-full",
          "ring-2 ring-border transition-shadow",
          "hover:ring-neon-pink/50 dark:hover:ring-cyber-yellow/50",
        )}
        aria-label="Cambiar foto de perfil"
      >
        {avatarUrl ? (
          <>
            {!imageReady ? (
              <span className="absolute inset-0 flex items-center justify-center bg-muted font-heading text-lg font-semibold text-neon-pink dark:text-cyber-yellow">
                {initials}
              </span>
            ) : null}
            <img
              src={avatarUrl}
              alt="Avatar de perfil"
              decoding="async"
              onLoad={() => setImageReady(true)}
              className={cn(
                "size-full object-cover transition-opacity duration-200",
                imageReady ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        ) : (
          <span className="flex size-full items-center justify-center bg-muted font-heading text-xl font-semibold text-neon-pink dark:text-cyber-yellow">
            {initials}
          </span>
        )}

        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-6 text-foreground" aria-hidden />
        </span>

        {isUploading ? (
          <span className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Loader2 className="size-6 animate-spin text-neon-pink dark:text-cyber-yellow" />
          </span>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </button>
    </div>
  );
}
