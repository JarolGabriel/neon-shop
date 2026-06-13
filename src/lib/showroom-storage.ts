const STORAGE_BUCKET = "product_images";

export function extractShowroomStoragePath(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl) return null;
  const marker = `/${STORAGE_BUCKET}/`;
  const index = imageUrl.indexOf(marker);
  if (index < 0) return null;
  return imageUrl.slice(index + marker.length).split("?")[0] || null;
}

export { STORAGE_BUCKET as SHOWROOM_STORAGE_BUCKET };
