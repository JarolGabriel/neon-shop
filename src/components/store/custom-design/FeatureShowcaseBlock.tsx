"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { FeatureShowcaseBlock as FeatureBlock } from "@/components/store/custom-design/feature-showcase-data";
import { cn } from "@/lib/utils";

const IMAGE_HOVER = {
  y: -8,
  rotateX: 5,
  rotateY: -6,
  scale: 1.02,
};

interface FeatureShowcaseBlockProps {
  block: FeatureBlock;
}

export function FeatureShowcaseBlockItem({ block }: FeatureShowcaseBlockProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-center md:gap-10 lg:gap-14",
        !block.imageOnLeft && "md:flex-row-reverse",
      )}
    >
      <motion.div
        className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg shadow-md shadow-neon-pink/5 transition-shadow duration-300 dark:shadow-cyber-yellow/5 md:w-1/2 md:hover:shadow-xl md:hover:shadow-neon-pink/15 dark:md:hover:shadow-cyber-yellow/10"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        whileHover={IMAGE_HOVER}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <Image
          src={block.imageSrc}
          alt={block.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>

      <div className="flex flex-1 flex-col gap-4 md:w-1/2">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {block.title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {block.description}
        </p>
      </div>
    </article>
  );
}
