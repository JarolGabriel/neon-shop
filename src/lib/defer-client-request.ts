/**
 * Ejecuta una acción después de que la página esté lista,
 * para no competir con las peticiones críticas del catálogo.
 */
export function runAfterPageReady(
  callback: () => void,
  delayMs = 1200,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let cancelled = false;

  const run = () => {
    if (!cancelled) callback();
  };

  const schedule = (): (() => void) => {
    if (cancelled) return () => undefined;

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(run, {
        timeout: delayMs + 800,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(run, delayMs);
    return () => clearTimeout(timeoutId);
  };

  let cancelScheduled: (() => void) | undefined;

  if (document.readyState === "complete") {
    cancelScheduled = schedule();
  } else {
    const onLoad = () => {
      cancelScheduled = schedule();
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      cancelScheduled?.();
    };
  }

  return () => {
    cancelled = true;
    cancelScheduled?.();
  };
}
