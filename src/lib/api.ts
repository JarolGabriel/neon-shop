import type { AuthUser, SignInResponse, SignUpResponse } from "@/types/auth";
import type { ActivePromotionsResponse } from "@/types/promotion";
import type {
  CatalogProduct,
  CatalogProductsResponse,
  ProductDetail,
  ProductDetailResponse,
} from "@/types/product";
import type {
  CreateReviewPayload,
  ProductReview,
  ProductReviewsResponse,
} from "@/types/review";

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

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const res = await fetch(
    `${API_BASE}/api/products/${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 } },
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al obtener el producto");

  const json = (await res.json()) as ProductDetailResponse;
  return json.data;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const res = await fetch(`${API_BASE}/api/settings`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return {};

  const json = (await res.json()) as {
    success: boolean;
    data?: Record<string, string>;
  };
  return json.data ?? {};
}

export async function getProductReviews(
  productId: string,
): Promise<ProductReview[]> {
  const res = await fetch(
    `${API_BASE}/api/resenas?product_id=${encodeURIComponent(productId)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Error al obtener las reseñas");
  }

  const json = (await res.json()) as ProductReviewsResponse;
  return json.data ?? [];
}

export async function createProductReview(
  payload: CreateReviewPayload,
): Promise<ProductReview> {
  const token = getStoredAccessToken();

  const res = await fetch(`${API_BASE}/api/resenas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const json = (await res.json()) as { data: ProductReview };
  return json.data;
}

/** Adapta un ProductDetail (de /api/products/[slug]) al shape de tarjeta de catálogo. */
function toCatalogProduct(product: ProductDetail): CatalogProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    short_description: product.short_description,
    description: product.description,
    price: product.price,
    compare_at_price: product.compare_at_price,
    stock: product.stock,
    color: product.color,
    size: product.size,
    sales_count: product.sales_count,
    is_active: product.is_active,
    categories: null,
    product_images: product.images.map(
      ({ id, image_url, alt_text, is_primary }) => ({
        id,
        image_url,
        alt_text,
        is_primary,
      }),
    ),
    product_variants: product.variants.map(
      ({ id, color, color_hex, size, price, stock, is_active }) => ({
        id,
        color,
        color_hex,
        size,
        price,
        stock,
        is_active,
      }),
    ),
  };
}

export async function getProductsBySlugs(
  slugs: string[],
): Promise<CatalogProduct[]> {
  const results = await Promise.all(
    slugs.map((slug) => getProductBySlug(slug).catch(() => null)),
  );

  return results
    .filter((product): product is ProductDetail => product != null)
    .map(toCatalogProduct);
}

export function getCartSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("cart_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("cart_session_id", sessionId);
  }
  return sessionId;
}

export async function addToCart(payload: {
  session_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  notes?: string;
}): Promise<void> {
  const token = getStoredAccessToken();

  const res = await fetch(`${API_BASE}/api/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
}
