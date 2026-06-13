/** Clases base para campos del panel admin (fondo claro, texto y placeholder legibles). */
export const ADMIN_INPUT_CLASS =
  "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400";

export const ADMIN_TEXTAREA_CLASS = `${ADMIN_INPUT_CLASS} resize-none`;

export const ADMIN_IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
} as const;

export const ADMIN_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
