export function formatOrderShortId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export function formatAdminDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-VE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatAdminDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-VE", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

interface ModerationProfile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export function getModerationAuthorName(
  profiles: ModerationProfile | ModerationProfile[] | null,
): string {
  const profile = Array.isArray(profiles) ? profiles[0] : profiles;
  if (!profile) return "Usuario";

  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || profile.email || "Usuario";
}
