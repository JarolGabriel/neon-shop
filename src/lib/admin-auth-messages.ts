export const ADMIN_UNAUTHORIZED_TITLE = "Sesión caducada";

export const ADMIN_UNAUTHORIZED_MESSAGE =
  "Tu sesión expiró o ya no es válida. Vuelve a iniciar sesión para continuar en el panel.";

const UNAUTHORIZED_MARKERS = [
  "no autorizado",
  "token inválido",
  "token faltante",
  "token ausente",
  "expirado",
  ADMIN_UNAUTHORIZED_MESSAGE.toLowerCase(),
] as const;

export function isAdminUnauthorizedError(message: string): boolean {
  const normalized = message.trim().toLowerCase();
  return UNAUTHORIZED_MARKERS.some((marker) => normalized.includes(marker));
}
