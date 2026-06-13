"use client";

import Image from "next/image";
import { getDiceBearAvatarUrl, getUserFullName } from "@/lib/user-avatar";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

interface UserAvatarProps {
  user: AuthUser;
  size?: number;
  className?: string;
  useNextImageForUpload?: boolean;
}

export function UserAvatar({
  user,
  size = 32,
  className,
  useNextImageForUpload = true,
}: UserAvatarProps) {
  const dimensionClass = size === 32 ? "size-8" : undefined;
  const style = dimensionClass ? undefined : { width: size, height: size };

  if (user.avatar_url) {
    if (useNextImageForUpload) {
      return (
        <Image
          src={user.avatar_url}
          alt={getUserFullName(user)}
          width={size}
          height={size}
          className={cn("rounded-full object-cover", dimensionClass, className)}
        />
      );
    }

    return (
      <img
        src={user.avatar_url}
        alt={getUserFullName(user)}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", dimensionClass, className)}
        style={style}
      />
    );
  }

  return (
    <img
      src={getDiceBearAvatarUrl(user)}
      alt={getUserFullName(user)}
      width={size}
      height={size}
      className={cn("rounded-full", dimensionClass, className)}
      style={style}
    />
  );
}
