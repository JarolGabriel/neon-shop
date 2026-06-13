"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SearchX, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { filterShowroomPosts } from "@/lib/showroom-utils";
import type { ShowroomPost } from "@/types/showroom";

interface ShowroomSearchOverlayProps {
  isOpen: boolean;
  posts: ShowroomPost[];
  onClose: () => void;
  onSelectPost: (postId: string) => void;
}

export function ShowroomSearchOverlay({
  isOpen,
  posts,
  onClose,
  onSelectPost,
}: ShowroomSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const results = filterShowroomPosts(posts, query).slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-background/80 px-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="size-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar en la comunidad..."
                className="border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                aria-label="Cerrar búsqueda"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {query.trim() === "" ? (
                <p className="px-3 py-6 text-sm text-muted-foreground">
                  Escribe para buscar por título o descripción.
                </p>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-3 py-10 text-muted-foreground">
                  <SearchX className="size-8 opacity-60" />
                  <p className="text-sm">No encontramos publicaciones.</p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {results.map((post) => (
                    <li key={post.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPost(post.id);
                          onClose();
                        }}
                        className="w-full rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted"
                      >
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {post.comment}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
