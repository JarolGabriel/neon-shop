import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/store/BackToTop";
import { PolicyDocument } from "@/components/store/PolicyDocument";
import { PolicyMarkdownContent } from "@/components/store/PolicyMarkdownContent";
import { getSiteSettings } from "@/lib/api";
import { getStaticPolicySections } from "@/lib/policy-content";
import { getSupportEmail } from "@/lib/site-settings-utils";
import { getPolicyBySlug } from "@/types/site-settings";

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);

  if (!policy) {
    return { title: "Página no encontrada | Neon Shop" };
  }

  return {
    title: `${policy.title} | Neon Shop`,
    description: policy.description,
    openGraph: {
      title: policy.title,
      description: policy.description,
      type: "website",
    },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);

  if (!policy) {
    notFound();
  }

  const settings = await getSiteSettings();
  const supportEmail = getSupportEmail(settings) ?? "info@neonshop.com";
  const settingsContent = settings[policy.settingKey]?.trim();
  const staticSections = getStaticPolicySections(slug, supportEmail);

  if (!settingsContent && !staticSections) {
    notFound();
  }

  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{policy.title}</span>
        </nav>

        {settingsContent ? (
          <article>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {policy.title}
            </h1>
            <div className="mt-8">
              <PolicyMarkdownContent
                content={settingsContent}
                supportEmail={supportEmail}
              />
            </div>
          </article>
        ) : staticSections ? (
          <PolicyDocument title={policy.title} sections={staticSections} />
        ) : null}

        <BackToTop className="mt-12 pb-0" />
      </div>
    </section>
  );
}
