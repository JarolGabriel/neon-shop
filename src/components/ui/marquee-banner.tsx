"use client";

import { useAnimate } from "framer-motion";
import type { AnimationPlaybackControls } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MarqueeBannerProps {
  text?: string;
  repeat?: number;
  durationSeconds?: number;
  className?: string;
}

function MarqueeGroup({ text, repeat }: { text: string; repeat: number }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {Array.from({ length: repeat }, (_, i) => (
        <span key={i} className="flex items-center gap-3 px-6">
          <Lightbulb
            className="size-6 shrink-0 text-vite-purple sm:size-7 dark:text-cyber-yellow"
            aria-hidden="true"
          />
          <span className="text-sm font-bold whitespace-nowrap text-foreground sm:text-lg lg:text-xl">
            {text}
          </span>
        </span>
      ))}
    </div>
  );
}

export function MarqueeBanner({
  text = "Neón que brilla más",
  repeat = 6,
  durationSeconds = 22,
  className,
}: MarqueeBannerProps) {
  const [scope, animate] = useAnimate();
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (!scope.current) return;
    const controls = animate(
      scope.current,
      { x: ["0%", "-50%"] },
      { duration: durationSeconds, ease: "linear", repeat: Infinity },
    );
    controlsRef.current = controls;
    return () => controls.stop();
  }, [animate, scope, durationSeconds]);

  return (
    <div
      className={cn(
        "flex h-12 w-full items-center overflow-hidden border-y border-border bg-muted lg:h-20",
        className,
      )}
      onMouseEnter={() => controlsRef.current?.pause()}
      onMouseLeave={() => controlsRef.current?.play()}
      role="marquee"
      aria-label={text}
    >
      <div ref={scope} className="flex w-max items-center">
        <MarqueeGroup text={text} repeat={repeat} />
        <MarqueeGroup text={text} repeat={repeat} />
      </div>
    </div>
  );
}
