"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoTestimonial {
  id: string;
  handle: string;
  videoUrl: string;
}

/** Videos verticales de prueba (Pexels, MP4 directo). */
const MOCK_VIDEO_URL =
  "https://videos.pexels.com/video-files/4057252/4057252-sd_540_960_30fps.mp4";

const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  { id: "1", handle: "@ninadefilla", videoUrl: MOCK_VIDEO_URL },
  { id: "2", handle: "@chieffkeeffsossa", videoUrl: MOCK_VIDEO_URL },
  { id: "3", handle: "@riawna", videoUrl: MOCK_VIDEO_URL },
  { id: "4", handle: "@lyssynoel", videoUrl: MOCK_VIDEO_URL },
  { id: "5", handle: "@stephenglickman", videoUrl: MOCK_VIDEO_URL },
];

const CARD_SHELL =
  "shadow-[-4px_8px_16px_-10px] shadow-neon-pink/10 transition-all duration-300 dark:shadow-cyber-yellow/10 md:hover:scale-[1.03] md:hover:shadow-[-6px_12px_22px_-8px] md:hover:shadow-neon-pink/16 dark:md:hover:shadow-cyber-yellow/14";

interface VideoCardProps {
  item: VideoTestimonial;
}

function VideoCard({ item }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  };

  return (
    <article
      className={cn(
        "group relative aspect-[9/16] w-[260px] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-border bg-card/70 md:w-full",
        CARD_SHELL,
      )}
    >
      <video
        ref={videoRef}
        src={item.videoUrl}
        className="size-full object-cover"
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        className="absolute top-3 right-3 z-20 flex size-8 items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground backdrop-blur-md transition-colors duration-200 hover:bg-card/90"
      >
        {muted ? (
          <VolumeX className="size-4" aria-hidden="true" />
        ) : (
          <Volume2 className="size-4" aria-hidden="true" />
        )}
      </button>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-linear-to-t from-black/85 via-black/40 to-transparent"
        aria-hidden="true"
      />

      <p className="absolute inset-x-0 bottom-0 z-10 border-t border-border/40 bg-card/75 px-3 py-2.5 text-center text-sm font-bold text-foreground backdrop-blur-md">
        {item.handle}
      </p>
    </article>
  );
}

export function VideoTestimonials() {
  return (
    <section className="py-12" aria-labelledby="video-testimonials-heading">
      <h2
        id="video-testimonials-heading"
        className="mb-8 px-4 text-center font-heading text-2xl font-semibold text-foreground md:text-3xl"
      >
        Lo que dicen nuestros clientes
      </h2>

      <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none md:mx-auto md:grid md:max-w-6xl md:grid-cols-5 md:gap-4 md:overflow-visible md:px-4 md:pb-0 md:snap-none">
        {VIDEO_TESTIMONIALS.map((item) => (
          <VideoCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
