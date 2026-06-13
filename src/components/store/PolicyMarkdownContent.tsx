"use client";

import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PolicyMarkdownContentProps {
  content: string;
  supportEmail?: string;
}

const LINK_CLASS =
  "font-medium text-foreground underline underline-offset-2 transition-colors hover:text-neon-pink dark:hover:text-cyber-yellow";

function resolvePolicyContent(
  content: string,
  supportEmail?: string,
): string {
  const email = supportEmail?.trim() || "info@neonshop.com";
  return content.replaceAll("{{support_email}}", email);
}

export function PolicyMarkdownContent({
  content,
  supportEmail,
}: PolicyMarkdownContentProps) {
  const resolved = resolvePolicyContent(content, supportEmail);

  const components: Components = {
    h2: ({ children }) => (
      <h2 className="font-heading text-lg font-bold tracking-wide text-foreground uppercase sm:text-xl">
        {children}
      </h2>
    ),
    p: ({ children }) => (
      <p className="text-base leading-relaxed text-foreground/90">{children}</p>
    ),
    a: ({ href, children }) => {
      if (href?.startsWith("/")) {
        return (
          <Link href={href} className={LINK_CLASS}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
        >
          {children}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-foreground/90">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5 text-base leading-relaxed text-foreground/90">
        {children}
      </ol>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
  };

  return (
    <div className="max-w-3xl space-y-4 [&>h2:not(:first-child)]:mt-10">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {resolved}
      </ReactMarkdown>
    </div>
  );
}
