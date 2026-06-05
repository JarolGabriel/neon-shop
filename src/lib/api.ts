import type { AuthUser, SignInResponse, SignUpResponse } from "@/types/auth";
import type { ActivePromotionsResponse } from "@/types/promotion";
import type { CatalogProductsResponse } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const ACCESS_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "auth_user";

async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? "Error inesperado";
  } catch {
    return "Error inesperado";
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function persistAuth(session: SignInResponse["session"], user: AuthUser): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthStorage(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function signIn(email: string, password: string): Promise<SignInResponse> {
  const res = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<SignInResponse>;
}

export async function signUp(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<SignUpResponse> {
  const res = await fetch("/api/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<SignUpResponse>;
}

export function signOut(): void {
  clearAuthStorage();
}

export async function getActivePromotions(): Promise<ActivePromotionsResponse> {
  const res = await fetch(`${API_BASE}/api/promotions/active`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Error al obtener promociones activas");
  }

  return res.json() as Promise<ActivePromotionsResponse>;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "best_seller";
}): Promise<CatalogProductsResponse> {
  const query = new URLSearchParams();
  if (params?.page != null) query.set("page", String(params.page));
  if (params?.limit != null) query.set("limit", String(params.limit));
  if (params?.sort) query.set("sort", params.sort);

  const qs = query.toString();
  const res = await fetch(`${API_BASE}/api/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  return res.json() as Promise<CatalogProductsResponse>;
}
