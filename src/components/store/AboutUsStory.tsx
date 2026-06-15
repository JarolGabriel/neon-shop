"use client";

import Image from "next/image";
import {
  ABOUT_US_HEADING,
  ABOUT_US_PARAGRAPHS,
} from "@/components/store/about-us-story-data";
import { useFounderProfile, useStoreName } from "@/context/SiteBrandingContext";
import { interpolateStoreName } from "@/lib/store-branding";

export function AboutUsStory() {
  const storeName = useStoreName();
  const { name, imageUrl, imageAlt } = useFounderProfile();

  return (
    <section
      className="bg-background px-4 py-16 sm:px-6 lg:py-24"
      aria-labelledby="about-us-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <figure className="lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
              priority
              unoptimized={imageUrl.startsWith("/storage/")}
            />
          </div>
          <figcaption className="mt-4 text-center text-sm text-muted-foreground">
            {name}
          </figcaption>
        </figure>

        <div>
          <h1
            id="about-us-heading"
            className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {interpolateStoreName(ABOUT_US_HEADING, storeName)}
          </h1>

          {ABOUT_US_PARAGRAPHS.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mt-4 text-base leading-relaxed text-muted-foreground"
            >
              {interpolateStoreName(paragraph, storeName)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
