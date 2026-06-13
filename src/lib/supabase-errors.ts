import { NextResponse } from "next/server";

/** Tiempo máximo por intento a Supabase (ms). */
export const SUPABASE_REQUEST_TIMEOUT_MS = 20_000;

export type ApiErrorCode =
  | "SERVICE_UNAVAILABLE"
  | "DATABASE_ERROR"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  error: string;
  code: ApiErrorCode;
  retryable?: boolean;
}

interface SupabaseLikeError {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
  name?: string;
  cause?: unknown;
}

function collectErrorText(error: unknown): string {
  if (!error) return "";

  if (error instanceof Error) {
    const cause =
      error.cause instanceof Error
        ? `${error.cause.name} ${error.cause.message}`
        : error.cause != null
          ? String(error.cause)
          : "";
    return `${error.name} ${error.message} ${cause}`.toLowerCase();
  }

  if (typeof error === "object") {
    const e = error as SupabaseLikeError;
    const causeText =
      e.cause instanceof Error
        ? `${e.cause.name} ${e.cause.message}`
        : e.cause != null
          ? String(e.cause)
          : "";
    return `${e.message ?? ""} ${e.details ?? ""} ${e.code ?? ""} ${causeText}`.toLowerCase();
  }

  return String(error).toLowerCase();
}

export function isSupabaseNetworkError(error: unknown): boolean {
  const text = collectErrorText(error);

  return (
    text.includes("fetch failed") ||
    text.includes("connect timeout") ||
    text.includes("connecttimeouterror") ||
    text.includes("und_err_connect_timeout") ||
    text.includes("econnrefused") ||
    text.includes("enotfound") ||
    text.includes("network") ||
    text.includes("socket hang up") ||
    text.includes("aborterror") ||
    text.includes("aborted") ||
    text.includes("timed out")
  );
}

export function logSupabaseFailure(context: string, error: unknown): void {
  if (isSupabaseNetworkError(error)) {
    console.error(`[${context}] Supabase no disponible (red/timeout):`, {
      message: error instanceof Error ? error.message : (error as SupabaseLikeError)?.message,
      code: (error as SupabaseLikeError)?.code,
    });
    return;
  }

  console.error(`[${context}] Error de Supabase:`, error);
}

interface ErrorResponseOptions {
  context: string;
  fallbackMessage: string;
  databaseMessage?: string;
  databaseStatus?: number;
}

interface ErrorPayload {
  body: ApiErrorBody;
  status: number;
  headers?: HeadersInit;
}

export function buildSupabaseErrorPayload(
  error: unknown,
  options: ErrorResponseOptions,
): ErrorPayload {
  logSupabaseFailure(options.context, error);

  if (isSupabaseNetworkError(error)) {
    return {
      body: {
        error:
          "No pudimos conectar con el servidor en este momento. Intenta de nuevo en unos segundos.",
        code: "SERVICE_UNAVAILABLE",
        retryable: true,
      },
      status: 503,
      headers: { "Retry-After": "5" },
    };
  }

  const dbCode = (error as SupabaseLikeError)?.code ?? "";
  if (dbCode === "PGRST116") {
    return {
      body: {
        error: "Recurso no encontrado.",
        code: "NOT_FOUND",
      },
      status: 404,
    };
  }

  return {
    body: {
      error: options.databaseMessage ?? options.fallbackMessage,
      code: "DATABASE_ERROR",
    },
    status: options.databaseStatus ?? 500,
  };
}

export function createSupabaseErrorResponse(
  error: unknown,
  options: ErrorResponseOptions,
): NextResponse<ApiErrorBody> {
  const { body, status, headers } = buildSupabaseErrorPayload(error, options);
  return NextResponse.json(body, { status, headers });
}

export function createUnexpectedErrorResponse(
  context: string,
  error: unknown,
  fallbackMessage = "Error interno del servidor",
): NextResponse<ApiErrorBody> {
  if (isSupabaseNetworkError(error)) {
    return createSupabaseErrorResponse(error, {
      context,
      fallbackMessage,
    });
  }

  console.error(`[${context}] Error inesperado:`, error);

  return NextResponse.json(
    {
      error: fallbackMessage,
      code: "INTERNAL_ERROR",
    },
    { status: 500 },
  );
}
