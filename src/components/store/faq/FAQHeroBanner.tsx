import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

interface FAQHeroBannerProps {
  phone?: { display: string; href: string } | null;
}

export function FAQHeroBanner({ phone }: FAQHeroBannerProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]">
        <Image
          src="/images/banner-footer-al-por-mayor.jpg"
          alt="Letreros de neón LED en taller Neon Shop"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

        <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-center px-4 py-10 sm:px-8 sm:py-14">
          <div className="mx-auto w-full max-w-4xl">
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Ayuda y preguntas frecuentes
            </h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              ¡Estamos aquí para ayudarte!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1c] text-white">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:grid-cols-2 sm:px-8 sm:py-7">
          {phone ? (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <a
                  href={phone.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold transition-colors hover:text-cyber-yellow"
                >
                  {phone.display}
                </a>
                <p className="mt-1 text-xs text-white/75 sm:text-sm">
                  ¡Llama gratis! O mándanos un mensaje
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              {phone ? (
                <Link
                  href={phone.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold transition-colors hover:text-cyber-yellow"
                >
                  ¡Chatea en vivo con nosotros!
                </Link>
              ) : (
                <p className="font-semibold">¡Chatea en vivo con nosotros!</p>
              )}
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                Escríbenos por WhatsApp y te respondemos al instante
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
