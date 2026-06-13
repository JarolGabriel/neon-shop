import type { Tables } from "@/types/supabase";
import type { AuthUser, SignInResponse, SignUpResponse, UserProfile } from "@/types/auth";
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
  CommunityActivityResponse,
  DeleteShowroomPostResponse,
} from "@/types/showroom";
import type {
  CreateReviewPayload,
  ProductReview,
  ProductReviewsResponse,
} from "@/types/review";
import type { CartItem, CartResponse, CreateOrderResponse } from "@/types/cart";
import type {
  FavoritesResponse,
  ToggleFavoriteResponse,
} from "@/types/favorite";
import type { CreateOrderPayload, MyOrdersResponse } from "@/types/order";
import type { CustomDesignFormValues } from "@/lib/schemas/custom-design-form";
import type {
  ShowroomComment,
  ShowroomCommentsResponse,
  ShowroomCreatePostResponse,
  ShowroomFeedQuery,
  ShowroomFeedResponse,
  ShowroomPost,
  ShowroomReactResponse,
  ShowroomReactionType,
} from "@/types/showroom";
import { SHOWROOM_FEED_PAGE_SIZE } from "@/lib/showroom-utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/** En el navegador usa rutas relativas (mismo origen). En el servidor usa API_BASE si está definida. */
function resolveApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined" || !API_BASE) {
    return normalized;
  }
  return `${API_BASE.replace(/\/$/, "")}${normalized}`;
}

const ACCESS_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "auth_user";

async function parseErrorResponse(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as {
      error?: string;
      message?: string;
      code?: string;
    };

    if (body.error) return body.error;
    if (body.message) return body.message;

    if (res.status === 503) {
      return "El servidor está ocupado. Intenta de nuevo en unos segundos.";
    }

    return "Error inesperado";
  } catch {
    if (res.status === 503) {
      return "El servidor está ocupado. Intenta de nuevo en unos segundos.";
    }
    return "Error inesperado";
  }
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(resolveApiUrl(path), init);
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.",
    );
  }

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<T>;
}

async function fetchApiWithRetry<T>(
  path: string,
  init?: RequestInit,
  retries = 2,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchApi<T>(path, init);
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("No se pudieron cargar los productos. Intenta de nuevo.");

      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError ?? new Error("No se pudieron cargar los productos. Intenta de nuevo.");
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
  let res: Response;

  try {
    res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que la app esté corriendo.",
    );
  }

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

export async function requestPasswordReset(
  email: string,
): Promise<{ message: string }> {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<{ message: string }>;
}

export async function resetPassword(payload: {
  token_hash: string;
  password: string;
}): Promise<{ message: string }> {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<{ message: string }>;
}

export function signOut(): void {
  clearAuthStorage();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

export async function getProfile(token: string): Promise<{ profile: UserProfile }> {
  const res = await fetch("/api/profile", {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<{ profile: UserProfile }>;
}

export async function updateProfile(
  token: string,
  payload: {
    first_name: string;
    last_name: string;
    phone: string;
    shipping_address: {
      street: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
  },
): Promise<{ message: string; profile: UserProfile }> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<{ message: string; profile: UserProfile }>;
}

export async function uploadProfileAvatar(
  token: string,
  file: File,
): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch("/api/profile/avatar", {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<{ avatar_url: string }>;
}

export type Category = Tables<"categories">;

export type CategoryWithCount = Category & { product_count: number };

export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>("/api/categories", { cache: "no-store" });
}

export async function getFeaturedCategories(): Promise<CategoryWithCount[]> {
  const { data } = await fetchApi<{ data: CategoryWithCount[] }>(
    "/api/categories/featured",
    { cache: "no-store" },
  );
  return data;
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
  return fetchApi<ActivePromotionsResponse>("/api/promotions/active", {
    cache: "no-store",
  });
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
  return fetchApiWithRetry<CatalogProductsResponse>(
    `/api/products${qs ? `?${qs}` : ""}`,
  );
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
    resolveApiUrl(`/api/products/${encodeURIComponent(slug)}`),
    { next: { revalidate: 60 } },
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Error al obtener el producto");

  const json = (await res.json()) as ProductDetailResponse;
  return json.data;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const res = await fetch(resolveApiUrl("/api/settings"), {
    cache: "no-store",
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
    resolveApiUrl(
      `/api/resenas?product_id=${encodeURIComponent(productId)}`,
    ),
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
  accessToken?: string | null,
): Promise<ProductReview> {
  const token = accessToken ?? getStoredAccessToken();

  const formData = new FormData();
  formData.append("product_id", payload.product_id);
  formData.append("rating", String(payload.rating));
  formData.append("title", payload.title);
  formData.append("content", payload.content);
  formData.append("user_name", payload.user_name);
  formData.append("email", payload.email);
  if (file) formData.append("file", file);

  const res = await fetch(resolveApiUrl("/api/resenas"), {
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

export async function getProductsBySlugs(
  slugs: string[],
): Promise<CatalogProduct[]> {
  if (slugs.length === 0) return [];

  const unique = [...new Set(slugs)].slice(0, 12);
  const qs = new URLSearchParams({ slugs: unique.join(",") });
  const { data } = await fetchApiWithRetry<{ data: CatalogProduct[] }>(
    `/api/products?${qs.toString()}`,
  );

  const bySlug = new Map(data.map((product) => [product.slug, product]));
  return unique
    .map((slug) => bySlug.get(slug))
    .filter((product): product is CatalogProduct => product != null);
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

  const res = await fetch(resolveApiUrl("/api/cart"), {
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

export async function getCart(): Promise<CartItem[]> {
  const sessionId = getCartSessionId();
  const { data } = await fetchApi<CartResponse>(
    `/api/cart?session_id=${encodeURIComponent(sessionId)}`,
    { cache: "no-store" },
  );
  return data;
}

export async function removeCartItem(itemId: string): Promise<void> {
  const sessionId = getCartSessionId();
  const res = await fetch(
    resolveApiUrl(
      `/api/cart/items/${encodeURIComponent(itemId)}?session_id=${encodeURIComponent(sessionId)}`,
    ),
    { method: "DELETE" },
  );

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
}

export async function updateCartItem(
  itemId: string,
  payload: { quantity: number; notes?: string | null },
): Promise<void> {
  const sessionId = getCartSessionId();
  const body: {
    quantity: number;
    session_id: string;
    notes?: string | null;
  } = {
    quantity: payload.quantity,
    session_id: sessionId,
  };

  if (payload.notes !== undefined) {
    body.notes = payload.notes;
  }

  const res = await fetch(
    resolveApiUrl(`/api/cart/items/${encodeURIComponent(itemId)}`),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }
}

export async function getMyOrders(token: string): Promise<MyOrdersResponse> {
  const res = await fetch(resolveApiUrl("/api/orders/me"), {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<MyOrdersResponse>;
}

export async function getFavorites(token: string): Promise<FavoritesResponse> {
  const res = await fetch(resolveApiUrl("/api/favorites"), {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<FavoritesResponse>;
}

export async function toggleFavorite(
  token: string,
  productId: string,
): Promise<ToggleFavoriteResponse> {
  const res = await fetch(resolveApiUrl("/api/favorites"), {
    method: "POST",
    headers: authJsonHeaders(token),
    body: JSON.stringify({ product_id: productId }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<ToggleFavoriteResponse>;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> {
  const res = await fetch(resolveApiUrl("/api/orders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await res.json()) as CreateOrderResponse & {
    message?: string;
  };

  if (!res.ok || !body.success) {
    throw new Error(body.message ?? "No se pudo crear el pedido");
  }

  return body;
}

function authJsonHeaders(token: string): HeadersInit {
  return {
    ...authHeaders(token),
    "Content-Type": "application/json",
  };
}

export async function getShowroomPosts(
  token?: string | null,
  params?: ShowroomFeedQuery,
): Promise<ShowroomFeedResponse> {
  const headers: HeadersInit = token ? authHeaders(token) : {};
  const query = new URLSearchParams();

  query.set("page", String(params?.page ?? 1));
  query.set("limit", String(params?.limit ?? SHOWROOM_FEED_PAGE_SIZE));
  query.set("sort", params?.sort ?? "latest");

  return fetchApiWithRetry<ShowroomFeedResponse>(
    `/api/showroom?${query.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );
}

export async function createShowroomPost(
  token: string,
  payload: {
    title: string;
    comment: string;
    rating: number;
    file?: File | null;
  },
): Promise<ShowroomCreatePostResponse> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("comment", payload.comment);
  formData.append("rating", String(payload.rating));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  const res = await fetch(resolveApiUrl("/api/showroom"), {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<ShowroomCreatePostResponse>;
}

export async function reactToShowroomPost(
  token: string,
  reviewId: string,
  reactionType: ShowroomReactionType = "like",
): Promise<ShowroomReactResponse> {
  const res = await fetch(resolveApiUrl("/api/showroom/react"), {
    method: "POST",
    headers: authJsonHeaders(token),
    body: JSON.stringify({
      review_id: reviewId,
      reaction_type: reactionType,
    }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<ShowroomReactResponse>;
}

export async function getShowroomComments(
  reviewId: string,
): Promise<ShowroomComment[]> {
  const { data } = await fetchApi<ShowroomCommentsResponse>(
    `/api/showroom/comments?review_id=${encodeURIComponent(reviewId)}`,
    { cache: "no-store" },
  );

  return data;
}

export async function deleteShowroomPost(
  token: string,
  reviewId: string,
): Promise<DeleteShowroomPostResponse> {
  const res = await fetch(resolveApiUrl(`/api/showroom/${reviewId}`), {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  return res.json() as Promise<DeleteShowroomPostResponse>;
}

export async function getMyCommunityActivity(
  token: string,
): Promise<CommunityActivityResponse> {
  return fetchApiWithRetry<CommunityActivityResponse>("/api/showroom/me", {
    headers: authHeaders(token),
    cache: "no-store",
  });
}

export async function createShowroomComment(
  token: string,
  reviewId: string,
  comment: string,
): Promise<{ message: string }> {
  const res = await fetch(resolveApiUrl("/api/showroom/comments"), {
    method: "POST",
    headers: authJsonHeaders(token),
    body: JSON.stringify({ review_id: reviewId, comment }),
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const body = (await res.json()) as { message: string };
  return body;
}

// ——— Admin API ———
export {
  createAdminCategory,
  createAdminSetting,
  deleteAdminCategory,
  deleteAdminSetting,
  getAdminCategories,
  getAdminModeration,
  getAdminOrders,
  getAdminSettings,
  patchAdminModeration,
  patchAdminOrder,
  patchAdminSetting,
  updateAdminCategory,
} from "@/lib/admin-api";
