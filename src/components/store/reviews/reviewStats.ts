import type {
  ProductReview,
  RatingDistribution,
  ReviewStats,
} from "@/types/review";

export function computeReviewStats(reviews: ProductReview[]): ReviewStats {
  const distribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  for (const review of reviews) {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribution[rating] += 1;
  }

  const total = reviews.length;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = total > 0 ? sum / total : 0;

  return { average, total, distribution };
}
