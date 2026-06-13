import Link from "next/link";
import type {
  PolicyBlock,
  PolicyLink,
  PolicyParagraph,
  PolicySection,
} from "@/lib/policy-content";

interface PolicyDocumentProps {
  title: string;
  sections: PolicySection[];
}

function isPolicyParagraph(block: PolicyBlock): block is PolicyParagraph {
  return typeof block === "object";
}

function renderTextWithLinks(text: string, links: PolicyLink[] = []) {
  if (links.length === 0) {
    return text;
  }

  const parts: Array<string | PolicyLink> = [];
  let remaining = text;

  for (const link of links) {
    const index = remaining.indexOf(link.label);
    if (index === -1) continue;

    if (index > 0) {
      parts.push(remaining.slice(0, index));
    }
    parts.push(link);
    remaining = remaining.slice(index + link.label.length);
  }

  if (remaining) {
    parts.push(remaining);
  }

  return parts.map((part, index) => {
    if (typeof part === "string") {
      return <span key={index}>{part}</span>;
    }

    return (
      <Link
        key={`${part.href}-${index}`}
        href={part.href}
        className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-neon-pink dark:hover:text-cyber-yellow"
      >
        {part.label}
      </Link>
    );
  });
}

function PolicyParagraphBlock({ block }: { block: PolicyParagraph }) {
  return (
    <p className="text-base leading-relaxed text-foreground/90">
      {block.leadIn ? (
        <span className="font-bold text-foreground">{block.leadIn} </span>
      ) : null}
      {renderTextWithLinks(block.text, block.links)}
    </p>
  );
}

export function PolicyDocument({ title, sections }: PolicyDocumentProps) {
  return (
    <article className="max-w-3xl">
      <header className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`policy-${section.id}`}>
            <h2
              id={`policy-${section.id}`}
              className="font-heading text-lg font-bold tracking-wide text-foreground uppercase sm:text-xl"
            >
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4">
              {section.paragraphs.map((block, index) =>
                isPolicyParagraph(block) ? (
                  <PolicyParagraphBlock key={index} block={block} />
                ) : (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-foreground/90"
                  >
                    {block}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
