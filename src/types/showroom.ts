export interface ShowroomProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

export type ShowroomReactionType =
  | "like"
  | "fire"
  | "celebrate"
  | "wow"
  | "unicorn";

export interface ShowroomPost {
  id: string;
  title: string;
  comment: string;
  image_url: string | null;
  rating: number;
  created_at: string | null;
  profiles: ShowroomProfile | null;
  likes_count: number;
  user_has_liked: boolean;
  reaction_counts: Partial<Record<ShowroomReactionType, number>>;
  user_reactions: ShowroomReactionType[];
  comments_count: number;
}

export interface ShowroomFeedResponse {
  success: boolean;
  data: ShowroomPost[];
  meta: ShowroomFeedMeta;
}

export interface ShowroomFeedMeta {
  total_items: number;
  page: number;
  limit: number;
  total_pages: number;
  has_more: boolean;
}

export interface ShowroomFeedQuery {
  page?: number;
  limit?: number;
  sort?: ShowroomFeedSort;
}

export interface ShowroomComment {
  id: string;
  comment: string;
  created_at: string | null;
  profiles: ShowroomProfile | null;
}

export interface ShowroomCommentsResponse {
  success: boolean;
  data: ShowroomComment[];
}

export interface ShowroomReactResponse {
  success: boolean;
  message: string;
  liked: boolean;
}

export interface ShowroomCreatePostResponse {
  success: boolean;
  message: string;
}

export type ShowroomFeedSort = "latest" | "top";

export interface CommunityActivityPost {
  id: string;
  title: string;
  is_approved: boolean;
  created_at: string | null;
  likes_count?: number;
}

export interface CommunityActivityReactionReview {
  id: string;
  title: string;
  is_approved: boolean;
}

export interface CommunityActivityReaction {
  review_id: string;
  reaction_type: string;
  created_at: string | null;
  review: CommunityActivityReactionReview | null;
}

export interface CommunityActivityCommentReview {
  id: string;
  title: string;
}

export interface CommunityActivityComment {
  id: string;
  review_id: string;
  comment: string;
  is_approved: boolean;
  created_at: string | null;
  review: CommunityActivityCommentReview | null;
}

export interface CommunityActivityData {
  posts: CommunityActivityPost[];
  reactions: CommunityActivityReaction[];
  comments: CommunityActivityComment[];
}

export interface CommunityActivityResponse {
  success: boolean;
  data: CommunityActivityData;
}

export interface DeleteShowroomPostResponse {
  success: boolean;
  message: string;
}
