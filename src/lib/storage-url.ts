const STORAGE_PATH_PREFIX = "/storage/";

function getCurrentSupabaseHostname(): string | undefined {
  const origin = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!origin) return undefined;

  try {
    return new URL(origin).hostname;
  } catch {
    return undefined;
  }
}

/**
 * Rewrites a Supabase public storage URL to a same-origin path.
 * Next.js proxies `/storage/*` → Supabase (see next.config.ts rewrites).
 * Fixes ERR_NAME_NOT_RESOLVED when the browser cannot resolve *.supabase.co
 * (common with WSL2 dev: server in Linux resolves DNS, Windows Chrome does not).
 *
 * URLs from another Supabase project (e.g. Neon storage on a Liem deploy before
 * migration) are left absolute so public buckets still load.
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
  const currentHostname = getCurrentSupabaseHostname();

  if (supabaseOrigin && trimmed.startsWith(supabaseOrigin)) {
    return trimmed.slice(supabaseOrigin.length);
  }

  const supabaseStorageMatch = trimmed.match(
    /^https:\/\/([^/]+)(\/storage\/.*)$/,
  );

  if (supabaseStorageMatch && currentHostname) {
    const [, hostname, storagePath] = supabaseStorageMatch;
    if (hostname === currentHostname) {
      return storagePath;
    }
    return trimmed;
  }

  return trimmed;
}
