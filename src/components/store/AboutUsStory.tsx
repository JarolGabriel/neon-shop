import Image from "next/image";
import {
  ABOUT_US_FOUNDER_NAME,
  ABOUT_US_HEADING,
  ABOUT_US_PARAGRAPHS,
} from "@/components/store/about-us-story-data";

export function AboutUsStory() {
  return (
    <section
      className="bg-background px-4 py-16 sm:px-6 lg:py-24"
      aria-labelledby="about-us-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <figure className="lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
            <Image
              src="/images/frank-NSY.jpeg"
              alt="Frank Siras sosteniendo un letrero de neón personalizado"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="mt-4 text-base font-bold text-foreground sm:text-lg">
            {ABOUT_US_FOUNDER_NAME}
          </figcaption>
        </figure>

        <div className="space-y-5">
          <h1
            id="about-us-heading"
            className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl"
          >
            {ABOUT_US_HEADING}
          </h1>

          {ABOUT_US_PARAGRAPHS.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-base leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
