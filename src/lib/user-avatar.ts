import type { AuthUser } from "@/types/auth";

export function getUserFullName(user: AuthUser): string {
  const parts = [user.first_name, user.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : user.email;
}

export function getUserInitials(user: AuthUser): string {
  if (user.first_name && user.last_name) {
    return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  }

  if (user.first_name) {
    return user.first_name.slice(0, 2).toUpperCase();
  }

  return user.email.slice(0, 2).toUpperCase();
}

export function getDiceBearAvatarUrl(user: AuthUser): string {
  const seed = user.first_name
    ? user.last_name
      ? `${user.first_name}+${user.last_name}`
      : user.first_name
    : user.email;

  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1f1f24&textColor=fcee0a`;
}
