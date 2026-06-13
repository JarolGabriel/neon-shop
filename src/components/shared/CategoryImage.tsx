"use client";

import { useEffect, useState } from "react";
import { FolderTree } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import { cn } from "@/lib/utils";

type ImageStatus = "idle" | "loading" | "loaded" | "error";

interface CategoryImageProps {
  src: string | null | undefined;
  alt: string;
  variant?: "thumb" | "card" | "preview";
  className?: string;
}

function getFrameClass(
  variant: "thumb" | "card" | "preview",
  className?: string,
) {
  const base = {
    thumb: "relative inline-flex size-14 shrink-0 overflow-hidden rounded-md bg-slate-200",
    preview:
      "relative block h-40 w-full overflow-hidden rounded-md bg-slate-200",
    card: "absolute inset-0 z-0 overflow-hidden bg-slate-200",
  };

  return cn(base[variant], className);
}

function EmptyFallback({
  variant,
  className,
}: {
  variant: "thumb" | "card" | "preview";
  className?: string;
}) {
  const iconSize = variant === "card" ? "size-12" : "size-5";

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-slate-100",
        variant === "thumb" && "rounded-md border border-dashed border-slate-300",
        className,
      )}
    >
      <FolderTree
        className={cn(iconSize, "text-slate-400")}
        aria-hidden
      />
    </div>
  );
}

export function CategoryImage({
  src,
  alt,
  variant = "thumb",
  className,
}: CategoryImageProps) {
  const imageUrl = resolvePublicStorageUrl(src) ?? "";
  const [status, setStatus] = useState<ImageStatus>(
    imageUrl ? "loading" : "idle",
  );

  useEffect(() => {
    setStatus(imageUrl ? "loading" : "idle");
  }, [imageUrl]);

  const frameClassName = getFrameClass(variant, className);
  const showImage = Boolean(imageUrl) && status !== "error";
  const showSkeleton = Boolean(imageUrl) && status === "loading";
  const showFallback = !imageUrl || status === "error";

  if (variant === "card" && showFallback) {
    return (
      <div className={frameClassName}>
        <EmptyFallback variant="card" />
      </div>
    );
  }

  return (
    <div className={frameClassName}>
      {showSkeleton ? (
        <Skeleton className="absolute inset-0 h-full w-full rounded-md" />
      ) : null}

      {showFallback ? <EmptyFallback variant={variant} /> : null}

      {showImage ? (
        <img
          src={imageUrl}
          alt={alt}
          loading={variant === "card" ? "lazy" : "eager"}
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn(
            "block h-full w-full object-cover",
            status === "loading" && "opacity-0",
            variant === "card" &&
              "transition-transform duration-300 group-hover:scale-105",
          )}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      ) : null}
    </div>
  );
}
