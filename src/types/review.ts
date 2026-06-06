/** Reseña de un producto tal como la devuelve GET /api/resenas */
export interface ProductReview {
  id: string;
  product_id: string;
  rating: number;
  title: string;
  content: string;
  media_url: string | null;
  user_name: string;
  created_at: string;
  is_verified: boolean;
}

/** Campos de texto para crear una reseña vía POST /api/resenas (multipart) */
export interface CreateReviewPayload {
  product_id: string;
  rating: number;
  title: string;
  content: string;
  user_name: string;
  email: string;
}

export interface ProductReviewsResponse {
  success: boolean;
  data: ProductReview[];
}

export interface CreateReviewResponse {
  success: boolean;
  message: string;
  data: ProductReview;
}

/** Distribución de votos por cantidad de estrellas (5 → 1) */
export type RatingDistribution = Record<1 | 2 | 3 | 4 | 5, number>;

export interface ReviewStats {
  average: number;
  total: number;
  distribution: RatingDistribution;
}
