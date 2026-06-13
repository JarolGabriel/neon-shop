"use client";

import { getShowroomAuthorName, getShowroomAvatarUrl } from "@/lib/showroom-utils";
import { cn } from "@/lib/utils";
import type { ShowroomProfile } from "@/types/showroom";

interface ShowroomAuthorAvatarProps {
  profile: ShowroomProfile | null;
  size?: number;
  className?: string;
}

export function ShowroomAuthorAvatar({
  profile,
  size = 32,
  className,
}: ShowroomAuthorAvatarProps) {
  return (
    <img
      src={getShowroomAvatarUrl(profile)}
      alt={getShowroomAuthorName(profile)}
      width={size}
      height={size}
      className={cn("rounded-full bg-muted", className)}
    />
  );
}
