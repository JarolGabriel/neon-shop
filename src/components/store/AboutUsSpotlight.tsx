import {
  ABOUT_US_SPOTLIGHT_HEADING,
  ABOUT_US_SPOTLIGHT_PARAGRAPHS,
} from "@/components/store/about-us-story-data";

export function AboutUsSpotlight() {
  return (
    <section
      className="border-t border-border bg-background px-4 py-16 sm:px-6 lg:py-24"
      aria-labelledby="about-us-spotlight-heading"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        <h2
          id="about-us-spotlight-heading"
          className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl"
        >
          {ABOUT_US_SPOTLIGHT_HEADING}
        </h2>

        {ABOUT_US_SPOTLIGHT_PARAGRAPHS.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-base leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
