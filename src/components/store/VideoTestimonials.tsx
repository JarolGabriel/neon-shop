"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoTestimonial {
  id: string;
  handle: string;
  videoUrl: string;
}

const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "1",
    handle: "@ninadefilla",
    videoUrl:
      "https://nekjvszntyaswghwtrig.supabase.co/storage/v1/object/public/testimonial-videos/testimonio-video1.mp4",
  },
  {
    id: "2",
    handle: "@chieffkeeffsossa",
    videoUrl:
      "https://nekjvszntyaswghwtrig.supabase.co/storage/v1/object/public/testimonial-videos/testimonio-video2.mp4",
  },
  {
    id: "3",
    handle: "@riawna",
    videoUrl:
      "https://nekjvszntyaswghwtrig.supabase.co/storage/v1/object/public/testimonial-videos/testimonio-video3.mp4",
  },
  {
    id: "4",
    handle: "@lyssynoel",
    videoUrl:
      "https://nekjvszntyaswghwtrig.supabase.co/storage/v1/object/public/testimonial-videos/testimonio-video4.mp4",
  },
  {
    id: "5",
    handle: "@stephenglickman",
    videoUrl:
      "https://nekjvszntyaswghwtrig.supabase.co/storage/v1/object/public/testimonial-videos/testimonio-video5.mp4",
  },
];

const CARD_SHELL =
  "shadow-[-4px_8px_16px_-10px] shadow-neon-pink/10 transition-all duration-300 dark:shadow-cyber-yellow/10 md:hover:scale-[1.03] md:hover:shadow-[-6px_12px_22px_-8px] md:hover:shadow-neon-pink/16 dark:md:hover:shadow-cyber-yellow/14";

const FLOATING_BTN =
  "flex items-center justify-center rounded-full border border-border/60 bg-card/70 text-foreground backdrop-blur-md transition-colors duration-200 hover:bg-card/90 hover:text-neon-pink! dark:hover:text-cyber-yellow!";

interface VideoCardProps {
  item: VideoTestimonial;
  activeAudioId: string | null;
  onAudioChange: (id: string | null) => void;
}

function VideoSkeleton() {
  return (
    <div
      className="absolute inset-0 z-30 animate-pulse bg-muted/50"
      aria-hidden="true"
    />
  );
}

function VideoCard({ item, activeAudioId, onAudioChange }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const isAudioActive = activeAudioId === item.id;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isVideoLoading) return;
    video.muted = !isAudioActive;
    if (isAudioActive) {
      void video.play().catch(() => undefined);
    }
  }, [isAudioActive, isVideoLoading]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || isVideoLoading) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVideoLoading]);

  const toggleMute = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAudioChange(isAudioActive ? null : item.id);
  };

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isAudioActive;
    setIsVideoLoading(false);
    setIsPlaying(!video.paused);
  };

  const handleCanPlay = () => {
    const video = videoRef.current;
    if (video && !isAudioActive) video.muted = true;
  };

  return (
    <article
      className={cn(
        "group relative aspect-[9/16] w-[260px] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-border bg-card/70 md:w-full",
        CARD_SHELL,
      )}
    >
      {isVideoLoading ? <VideoSkeleton /> : null}

      <video
        ref={videoRef}
        src={item.videoUrl}
        className="size-full cursor-pointer object-cover"
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlayback}
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          togglePlayback();
        }}
        aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
        className={cn(
          "absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          isVideoLoading && "pointer-events-none",
        )}
      >
        <span className={cn(FLOATING_BTN, "size-14")}>
          {isPlaying ? (
            <Pause className="size-6" aria-hidden="true" />
          ) : (
            <Play className="size-6 fill-current" aria-hidden="true" />
          )}
        </span>
      </button>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isAudioActive ? "Silenciar" : "Activar sonido"}
        className={cn(
          FLOATING_BTN,
          "absolute top-3 right-3 z-20 size-8",
          isAudioActive &&
            "ring-2 ring-neon-pink/40 dark:ring-cyber-yellow/40",
          isVideoLoading && "pointer-events-none opacity-60",
        )}
      >
        {isAudioActive ? (
          <Volume2 className="size-4" aria-hidden="true" />
        ) : (
          <VolumeX className="size-4 opacity-90" aria-hidden="true" />
        )}
      </button>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-linear-to-t from-black/85 via-black/40 to-transparent"
        aria-hidden="true"
      />

      <p
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 border-t border-border/40 bg-card/75 px-3 py-2.5 text-center text-sm font-bold text-foreground backdrop-blur-md",
          "shadow-[inset_0_6px_20px_-10px] shadow-neon-pink/25",
          "dark:shadow-[inset_0_6px_20px_-10px] dark:shadow-cyber-yellow/15",
        )}
      >
        {item.handle}
      </p>
    </article>
  );
}

export function VideoTestimonials() {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

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
          <VideoCard
            key={item.id}
            item={item}
            activeAudioId={activeAudioId}
            onAudioChange={setActiveAudioId}
          />
        ))}
      </div>
    </section>
  );
}
