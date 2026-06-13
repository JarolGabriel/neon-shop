import { SUPABASE_REQUEST_TIMEOUT_MS } from "@/lib/supabase-errors";

/**
 * Fetch con abort global para evitar colgar requests a Supabase.
 * Nota: el timeout de conexión TCP (10s en Node) depende del DNS/red del sistema.
 */
export const supabaseFetch: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    SUPABASE_REQUEST_TIMEOUT_MS,
  );

  const upstreamSignal = init?.signal;
  if (upstreamSignal) {
    if (upstreamSignal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
    } else {
      upstreamSignal.addEventListener(
        "abort",
        () => controller.abort(),
        { once: true },
      );
    }
  }

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};
