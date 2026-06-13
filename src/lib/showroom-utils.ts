import type { ShowroomPost, ShowroomProfile, ShowroomReactionType } from "@/types/showroom";

export const SHOWROOM_REACTIONS: {
  type: ShowroomReactionType;
  emoji: string;
  label: string;
}[] = [
  { type: "like", emoji: "❤️", label: "Me encanta" },
  { type: "unicorn", emoji: "🦄", label: "Unicornio" },
  { type: "wow", emoji: "🤯", label: "Alucinante" },
  { type: "celebrate", emoji: "🙌", label: "Celebrar" },
  { type: "fire", emoji: "🔥", label: "Fuego" },
];

export function getShowroomAuthorName(profile: ShowroomProfile | null): string {
  if (!profile) return "Cliente Neon";

  const parts = [profile.first_name, profile.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "Cliente Neon";
}

export function getShowroomAvatarSeed(profile: ShowroomProfile | null): string {
  if (!profile) return "neon-client";

  const parts = [profile.first_name, profile.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join("+") : profile.id;
}

export function getShowroomAvatarUrl(profile: ShowroomProfile | null): string {
  const seed = getShowroomAvatarSeed(profile);
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1f1f24&textColor=fcee0a`;
}

const HASHTAG_PATTERN = /#[\p{L}\p{N}_-]+/gu;

const HASHTAG_ONLY_BLOCK =
  /^#[\p{L}\p{N}_-]+(?:\s+#[\p{L}\p{N}_-]+)*$/u;

export function extractHashtags(text: string): string[] {
  const matches = text.match(HASHTAG_PATTERN);
  if (!matches) return [];

  const unique = new Set(matches.map((tag) => tag.toLowerCase()));
  return [...unique].slice(0, 4);
}

/** Texto del comentario sin hashtags que ya se muestran en chips. */
export function getCommentBodyForDisplay(
  text: string,
  tagsFromPost?: string[],
): string {
  let body = text.trim();
  if (!body) return "";

  const parts = body.split(/\n\n/);
  if (parts.length > 1) {
    const lastBlock = parts[parts.length - 1].trim();
    if (HASHTAG_ONLY_BLOCK.test(lastBlock)) {
      body = parts.slice(0, -1).join("\n\n").trim();
    }
  }

  const tags = tagsFromPost ?? extractHashtags(text);
  for (const tag of tags) {
    const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    body = body.replace(new RegExp(`\\s*${escaped}\\b`, "giu"), " ");
  }

  return body.replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

export function formatShowroomDate(date: string | null): string {
  if (!date) return "";

  return new Intl.DateTimeFormat("es", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getTotalReactions(post: ShowroomPost): number {
  return post.likes_count;
}

export function sortShowroomPosts(
  posts: ShowroomPost[],
  sort: "latest" | "top",
): ShowroomPost[] {
  const copy = [...posts];

  if (sort === "top") {
    return copy.sort((a, b) => {
      if (b.likes_count !== a.likes_count) {
        return b.likes_count - a.likes_count;
      }

      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }

  return copy.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });
}

export function filterShowroomPosts(
  posts: ShowroomPost[],
  query: string,
): ShowroomPost[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return posts;

  return posts.filter((post) => {
    const haystack = `${post.title} ${post.comment}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function categoryToHashtag(slug: string): string {
  return `#${slug.replace(/-/g, "")}`;
}

export const SHOWROOM_FEED_PAGE_SIZE = 13;
export const SHOWROOM_CATEGORIES_PREVIEW = 8;

export function appendTagsToComment(comment: string, tags?: string): string {
  if (!tags?.trim()) return comment.trim();

  const formattedTags = tags
    .split(/[\s,]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    .join(" ");

  return `${comment.trim()}\n\n${formattedTags}`.trim();
}
