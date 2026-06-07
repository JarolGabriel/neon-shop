import type { Tables } from "@/types/supabase";
import type { AuthUser, SignInResponse, SignUpResponse } from "@/types/auth";
import type {
  CatalogQueryParams,
  CategoryFiltersResponse,
} from "@/types/category";
import type { ActivePromotionsResponse } from "@/types/promotion";
import type {
  CatalogProduct,
  CatalogProductsResponse,
  ProductDetail,
  ProductDetailResponse,
} from "@/types/product";
import type {
  CreateTextDesignPayload,
  CreateTextDesignResponse,
  UploadCustomDesignLogoResponse,
} from "@/types/custom-design";
import type {
  CreateReviewPayload,
  ProductReview,
  ProductReviewsResponse,
} from "@/types/review";
import type { CustomDesignFormValues } from "@/lib/schemas/custom-design-form";

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

export type Category = Tables<"categories">;

export type CategoryWithCount = Category & { product_count: number };

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Error al obtener categorías");
  }

  return res.json() as Promise<Category[]>;
}

export async function getCategoriesWithProductCounts(): Promise<
  CategoryWithCount[]
> {
  const categories = await getCategories();

  const active = categories
    .filter((category) => category.is_active !== false)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  return Promise.all(
    active.map(async (category) => {
      try {
        const { meta } = await getProducts({
          category: category.slug,
          limit: 1,
          page: 1,
        });
        return { ...category, product_count: meta.total_items };
      } catch {
        return { ...category, product_count: 0 };
      }
    }),
  );
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

export async function getProducts(
  params?: CatalogQueryParams,
): Promise<CatalogProductsResponse> {
  const query = new URLSearchParams();
  if (params?.page != null) query.set("page", String(params.page));
  if (params?.limit != null) query.set("limit", String(params.limit));
  if (params?.sort) query.set("sort", params.sort);
  if (params?.search) query.set("search", params.search);
  if (params?.category) query.set("category", params.category);
  if (params?.min_price != null)
    query.set("min_price", String(params.min_price));
  if (params?.max_price != null)
    query.set("max_price", String(params.max_price));
  if (params?.color_hex) query.set("color_hex", params.color_hex);
  if (params?.size) query.set("size", params.size);
  if (params?.in_stock) query.set("in_stock", "true");
  if (params?.out_of_stock) query.set("out_of_stock", "true");

  const qs = query.toString();
  const res = await fetch(`/api/products${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Error al obtener productos");
  }

  return res.json() as Promise<CatalogProductsResponse>;
}

export async function getCategoryFilters(
  slug: string,
): Promise<CategoryFiltersResponse> {
  const res = await fetch(
    `/api/categories/${encodeURIComponent(slug)}/filters`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Error al obtener filtros de categoría");
  }

  return res.json() as Promise<CategoryFiltersResponse>;
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
  file?: File | null,
): Promise<ProductReview> {
  const token = getStoredAccessToken();

  const formData = new FormData();
  formData.append("product_id", payload.product_id);
  formData.append("rating", String(payload.rating));
  formData.append("title", payload.title);
  formData.append("content", payload.content);
  formData.append("user_name", payload.user_name);
  formData.append("email", payload.email);
  if (file) formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/resenas`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
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

export async function uploadCustomDesignLogo(
  values: CustomDesignFormValues,
): Promise<UploadCustomDesignLogoResponse> {
  const formData = new FormData();
  formData.append("customer_name", values.customer_name);
  formData.append("customer_email", values.customer_email);
  formData.append("customer_phone", "");
  formData.append("preferred_size", values.preferred_size);
  formData.append("budget_range", values.budget_range);
  formData.append("purpose", values.purpose);
  formData.append("delivery_address", values.delivery_address);
  formData.append("material", values.material);
  formData.append("usage_type", values.usage_type);
  formData.append("delivery_time", values.delivery_time);
  formData.append("customer_notes", values.customer_notes);
  formData.append("file", values.file);

  const res = await fetch("/api/custom-designs/upload-logo", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<UploadCustomDesignLogoResponse>;
}

export async function uploadTextDesign(
  payload: CreateTextDesignPayload,
): Promise<CreateTextDesignResponse> {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("customer_name", payload.customer_name);
  formData.append("customer_email", payload.customer_email);
  formData.append("text_content", payload.text_content);

  if (payload.customer_phone) {
    formData.append("customer_phone", payload.customer_phone);
  }
  if (payload.preferred_color) {
    formData.append("preferred_color", payload.preferred_color);
  }
  if (payload.preferred_size) {
    formData.append("preferred_size", payload.preferred_size);
  }
  if (payload.usage_type) {
    formData.append("usage_type", payload.usage_type);
  }
  if (payload.customer_notes) {
    formData.append("customer_notes", payload.customer_notes);
  }

  const res = await fetch("/api/custom-designs/text-design", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<CreateTextDesignResponse>;
}
