import { unstable_noStore } from "next/cache";
import { getSiteSettings } from "@/lib/api";
import {
  CUSTOM_SIGNS_LINKS,
  NEON_SIGNS_LINKS,
} from "@/components/shared/footer-data";
import { FooterBrandColumn } from "@/components/shared/FooterBrandColumn";
import { FooterColumnLinks } from "@/components/shared/FooterColumnLinks";
import {
  buildSupportLinks,
  getBusinessAddress,
  getBusinessHours,
  getStoreName,
  getSupportEmail,
  getWhatsappContact,
} from "@/lib/site-settings-utils";

export async function Footer() {
  unstable_noStore();

  const settings = await getSiteSettings();
  const storeName = getStoreName(settings);
  const supportEmail = getSupportEmail(settings) ?? "info@neonmfg.com";
  const phone = getWhatsappContact(settings);
  const address = getBusinessAddress(settings);
  const businessHours = getBusinessHours(settings);
  const supportLinks = buildSupportLinks(settings);

  return (
    <footer className="bg-[#121214] text-neutral-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <FooterBrandColumn
            storeName={storeName}
            supportEmail={supportEmail}
            phone={phone}
            address={address}
            businessHours={businessHours}
            settings={settings}
          />
          <FooterColumnLinks
            title="Carteles de neón personalizados"
            links={CUSTOM_SIGNS_LINKS}
          />
          <FooterColumnLinks title="Carteles de neón" links={NEON_SIGNS_LINKS} />
          <FooterColumnLinks title="Menú de apoyo" links={supportLinks} />
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6">
          <p className="text-sm text-neutral-500">
            © Fábrica Neón 2026... Impulsado por {storeName}
          </p>
        </div>
      </div>
    </footer>
  );
}
