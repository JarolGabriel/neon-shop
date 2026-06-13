import Link from "next/link";
import { cn } from "@/lib/utils";
import { FOOTER_LINK_CLASS, type FooterLinkItem } from "@/components/shared/footer-data";

interface FooterColumnLinksProps {
  title: string;
  links: FooterLinkItem[];
}

export function FooterColumnLinks({ title, links }: FooterColumnLinksProps) {
  const headingId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <nav aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-heading text-sm font-bold text-neon-pink"
      >
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={cn("text-sm", FOOTER_LINK_CLASS)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
