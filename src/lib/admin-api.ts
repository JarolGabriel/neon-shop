import { ADMIN_UNAUTHORIZED_MESSAGE } from "@/lib/admin-auth-messages";
import type {
  AddAdminProductImageResponse,
  AddAdminPromotionImageResponse,
  AdminCategory,
  AdminCustomDesignsResponse,
  AdminModerationResponse,
  AdminOrdersResponse,
  AdminProductsListResponse,
  AdminProductsQuery,
  AdminPromotion,
  AdminPromotionsResponse,
  AdminSettingMutationResponse,
  AdminSettingsResponse,
  CreateAdminCategoryResponse,
  CreateAdminProductResponse,
  CreateAdminPromotionPayload,
  CreateAdminSettingPayload,
  CreateAdminSettingResponse,
  DeleteAdminCategoryResponse,
  DeleteAdminCustomDesignResponse,
  DeleteAdminProductImageResponse,
  DeleteAdminProductResponse,
  DeleteAdminPromotionResponse,
  PatchAdminCustomDesignPayload,
  PatchAdminCustomDesignResponse,
  PatchAdminModerationPayload,
  PatchAdminModerationResponse,
  PatchAdminOrderPayload,
  PatchAdminOrderResponse,
  PatchAdminPromotionPayload,
  PatchAdminPromotionResponse,
  UpdateAdminCategoryPayload,
  UpdateAdminCategoryResponse,
  UpdateAdminProductPayload,
  UpdateAdminProductResponse,
} from "@/types/admin";

const ACCESS_TOKEN_KEY = "access_token";

function resolveApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (typeof window !== "undefined" || !apiBase) {
    return normalized;
  }
  return `${apiBase.replace(/\/$/, "")}${normalized}`;
}

function getAdminHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;

  if (!token) {
    throw new Error(ADMIN_UNAUTHORIZED_MESSAGE);
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parseAdminError(res: Response): Promise<string> {
  if (res.status === 401 || res.status === 403) {
    return ADMIN_UNAUTHORIZED_MESSAGE;
  }

  try {
    const body = (await res.json()) as {
      error?: string;
      message?: string;
    };
    return body.error ?? body.message ?? "Error inesperado";
  } catch {
    return "Error inesperado";
  }
}

function getAdminAuthHeader(): string {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;

  if (!token) {
    throw new Error(ADMIN_UNAUTHORIZED_MESSAGE);
  }

  return `Bearer ${token}`;
}

async function fetchAdminFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const res = await fetch(resolveApiUrl(path), {
    method: "POST",
    headers: {
      Authorization: getAdminAuthHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseAdminError(res));
  }

  return res.json() as Promise<T>;
}

async function fetchAdminApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(resolveApiUrl(path), {
    ...init,
    headers: {
      ...getAdminHeaders(),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(await parseAdminError(res));
  }

  return res.json() as Promise<T>;
}

export async function getAdminOrders(): Promise<AdminOrdersResponse> {
  return fetchAdminApi<AdminOrdersResponse>("/api/admin/orders", {
    cache: "no-store",
  });
}

export async function patchAdminOrder(
  id: string,
  payload: PatchAdminOrderPayload,
): Promise<PatchAdminOrderResponse> {
  return fetchAdminApi<PatchAdminOrderResponse>(`/api/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getAdminModeration(
  view: "pending" | "published" = "pending",
): Promise<AdminModerationResponse> {
  const query = view === "published" ? "?view=published" : "";
  return fetchAdminApi<AdminModerationResponse>(
    `/api/admin/moderation${query}`,
    { cache: "no-store" },
  );
}

export async function patchAdminModeration(
  payload: PatchAdminModerationPayload,
): Promise<PatchAdminModerationResponse> {
  return fetchAdminApi<PatchAdminModerationResponse>("/api/admin/moderation", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getAdminSettings(): Promise<AdminSettingsResponse> {
  return fetchAdminApi<AdminSettingsResponse>("/api/admin/settings", {
    cache: "no-store",
  });
}

export async function patchAdminSetting(
  key: string,
  value: string,
): Promise<AdminSettingMutationResponse> {
  return fetchAdminApi<AdminSettingMutationResponse>("/api/admin/settings", {
    method: "PATCH",
    body: JSON.stringify({ key, value }),
  });
}

export async function createAdminSetting(
  payload: CreateAdminSettingPayload,
): Promise<CreateAdminSettingResponse> {
  return fetchAdminApi<CreateAdminSettingResponse>("/api/admin/settings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminSetting(
  key: string,
): Promise<AdminSettingMutationResponse> {
  return fetchAdminApi<AdminSettingMutationResponse>(
    `/api/admin/settings/${encodeURIComponent(key)}`,
    { method: "DELETE" },
  );
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  return fetchAdminApi<AdminCategory[]>("/api/admin/categories", {
    cache: "no-store",
  });
}

export async function createAdminCategory(
  formData: FormData,
): Promise<CreateAdminCategoryResponse> {
  return fetchAdminFormData<CreateAdminCategoryResponse>(
    "/api/admin/categories",
    formData,
  );
}

export async function updateAdminCategory(
  id: string,
  payload: UpdateAdminCategoryPayload,
): Promise<UpdateAdminCategoryResponse> {
  return fetchAdminApi<UpdateAdminCategoryResponse>(
    `/api/admin/categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAdminCategory(
  id: string,
): Promise<DeleteAdminCategoryResponse> {
  return fetchAdminApi<DeleteAdminCategoryResponse>(
    `/api/admin/categories/${id}`,
    { method: "DELETE" },
  );
}

function buildAdminProductsQuery(params: AdminProductsQuery): string {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.search) search.set("search", params.search);
  if (params.category_id) search.set("category_id", params.category_id);
  if (params.stock_status) search.set("stock_status", params.stock_status);
  if (params.highlight) search.set("highlight", params.highlight);
  if (params.id) search.set("id", params.id);

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getAdminProducts(
  params: AdminProductsQuery = {},
): Promise<AdminProductsListResponse> {
  return fetchAdminApi<AdminProductsListResponse>(
    `/api/admin/products${buildAdminProductsQuery(params)}`,
    { cache: "no-store" },
  );
}

export async function getAdminProductById(id: string) {
  const response = await getAdminProducts({ id, limit: 1, page: 1 });
  return response.data[0] ?? null;
}

export async function createAdminProduct(
  formData: FormData,
): Promise<CreateAdminProductResponse> {
  return fetchAdminFormData<CreateAdminProductResponse>(
    "/api/admin/products",
    formData,
  );
}

export async function updateAdminProduct(
  id: string,
  payload: UpdateAdminProductPayload,
): Promise<UpdateAdminProductResponse> {
  return fetchAdminApi<UpdateAdminProductResponse>(
    `/api/admin/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}

export async function addAdminProductImage(
  productId: string,
  formData: FormData,
): Promise<AddAdminProductImageResponse> {
  return fetchAdminFormData<AddAdminProductImageResponse>(
    `/api/admin/products/${productId}/images`,
    formData,
  );
}

export async function deleteAdminProductImage(
  productId: string,
  imageId: string,
): Promise<DeleteAdminProductImageResponse> {
  return fetchAdminApi<DeleteAdminProductImageResponse>(
    `/api/admin/products/${productId}/images/${imageId}`,
    { method: "DELETE" },
  );
}

export async function deleteAdminProduct(
  id: string,
): Promise<DeleteAdminProductResponse> {
  return fetchAdminApi<DeleteAdminProductResponse>(
    `/api/admin/products/${id}`,
    { method: "DELETE" },
  );
}

export async function getAdminPromotions(): Promise<AdminPromotionsResponse> {
  return fetchAdminApi<AdminPromotionsResponse>("/api/admin/promotions", {
    cache: "no-store",
  });
}

export async function createAdminPromotion(
  payload: CreateAdminPromotionPayload,
): Promise<AdminPromotion> {
  return fetchAdminApi<AdminPromotion>("/api/admin/promotions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function patchAdminPromotion(
  id: string,
  payload: PatchAdminPromotionPayload,
): Promise<PatchAdminPromotionResponse> {
  return fetchAdminApi<PatchAdminPromotionResponse>(
    `/api/admin/promotions/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAdminPromotion(
  id: string,
): Promise<DeleteAdminPromotionResponse> {
  return fetchAdminApi<DeleteAdminPromotionResponse>(
    `/api/admin/promotions/${id}`,
    { method: "DELETE" },
  );
}

export async function addAdminPromotionImage(
  formData: FormData,
): Promise<AddAdminPromotionImageResponse> {
  return fetchAdminFormData<AddAdminPromotionImageResponse>(
    "/api/admin/promotion-images",
    formData,
  );
}

export async function getAdminCustomDesigns(): Promise<AdminCustomDesignsResponse> {
  return fetchAdminApi<AdminCustomDesignsResponse>(
    "/api/admin/custom-designs",
    { cache: "no-store" },
  );
}

export async function patchAdminCustomDesign(
  id: string,
  payload: PatchAdminCustomDesignPayload,
): Promise<PatchAdminCustomDesignResponse> {
  return fetchAdminApi<PatchAdminCustomDesignResponse>(
    `/api/admin/custom-designs/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteAdminCustomDesign(
  id: string,
): Promise<DeleteAdminCustomDesignResponse> {
  return fetchAdminApi<DeleteAdminCustomDesignResponse>(
    `/api/admin/custom-designs/${id}`,
    { method: "DELETE" },
  );
}

export async function uploadAdminFounderImage(
  file: File,
): Promise<{ image_url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchAdminFormData<{ image_url: string }>(
    "/api/admin/founder-image",
    formData,
  );
}
