const STORAGE_PATH_PREFIX = "/storage/";

/**
 * Rewrites a Supabase public storage URL to a same-origin path.
 * Next.js proxies `/storage/*` → Supabase (see next.config.ts rewrites).
 * Fixes ERR_NAME_NOT_RESOLVED when the browser cannot resolve *.supabase.co
 * (common with WSL2 dev: server in Linux resolves DNS, Windows Chrome does not).
 */
export function resolvePublicStorageUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url?.trim()) return undefined;

  const trimmed = url.trim();

  if (trimmed.startsWith(STORAGE_PATH_PREFIX)) {
    return trimmed;
  }

  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
    /\/$/,
    "",
  );

  if (supabaseOrigin && trimmed.startsWith(supabaseOrigin)) {
    return trimmed.slice(supabaseOrigin.length);
  }

  const storageMatch = trimmed.match(
    /^https:\/\/[^/]+\.supabase\.co(\/storage\/.*)$/,
  );

  if (storageMatch) {
    return storageMatch[1];
  }

  return trimmed;
}
