import Image from "next/image";
import {
  ABOUT_US_MOVEMENT_CTA,
  ABOUT_US_MOVEMENT_HEADING,
  ABOUT_US_MOVEMENT_IMAGE,
  ABOUT_US_MOVEMENT_PARAGRAPHS,
  ABOUT_US_MOVEMENT_SIGNATURE,
  ABOUT_US_MOVEMENT_SIGNOFF,
} from "@/components/store/about-us-story-data";

export function AboutUsMovement() {
  return (
    <section
      className="border-t border-border bg-background px-4 py-16 sm:px-6 lg:py-24"
      aria-labelledby="about-us-movement-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <figure>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-black">
            <Image
              src={ABOUT_US_MOVEMENT_IMAGE.src}
              alt={ABOUT_US_MOVEMENT_IMAGE.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {ABOUT_US_MOVEMENT_IMAGE.caption}
          </figcaption>
        </figure>

        <div className="space-y-5">
          <h2
            id="about-us-movement-heading"
            className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl"
          >
            {ABOUT_US_MOVEMENT_HEADING}
          </h2>

          {ABOUT_US_MOVEMENT_PARAGRAPHS.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-base leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}

          <p className="text-base font-medium text-foreground">
            {ABOUT_US_MOVEMENT_CTA}
          </p>

          <div className="space-y-1 pt-2 text-base text-muted-foreground">
            <p>{ABOUT_US_MOVEMENT_SIGNOFF}</p>
            <p className="font-medium text-foreground">
              {ABOUT_US_MOVEMENT_SIGNATURE}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
