import Link from "next/link";

interface FAQAboutSectionProps {
  supportEmail?: string | null;
  whatsappHref?: string | null;
}

export function FAQAboutSection({
  supportEmail,
  whatsappHref,
}: FAQAboutSectionProps) {
  const email = supportEmail ?? "info@neonshop.com";

  return (
    <section className="bg-background px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Sobre Neon Shop
        </h2>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/90">
          <p>
            Fundada en 2025 por Frank, Jose y Nany, Neon Shop es la empresa
            original que impulsó el movimiento del neón como decoración del hogar
            y desempeñó un papel importante en la creación de la industria que
            existe hoy en día.
          </p>
          <p>
            Ofrecemos tanto neones de cristal auténticos como neones LED, así
            como cualquier otro tipo de señalización iluminada que puedas
            imaginar.
          </p>
          <p>
            Enviamos a todo el país. Desde el momento en que haces tu pedido,
            puedes esperar recibir tu cartel en un plazo de 2-10 días
            laborables, en la mayoría de los casos. También ofrecemos producción
            y envío urgentes si es necesario. Podemos enviarte un cartel
            personalizado en menos de una semana.
          </p>
          <p>
            ¿Preguntas?{" "}
            {whatsappHref ? (
              <>
                ¡Utiliza nuestro{" "}
                <Link
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-neon-pink dark:hover:text-cyber-yellow"
                >
                  chat en VIVO por WhatsApp
                </Link>
                , para hablar ahora mismo con un representante de Atención al
                Cliente!
              </>
            ) : (
              <>
                ¡Utiliza nuestro chat en VIVO, situado en la esquina inferior de
                tu pantalla, para hablar ahora mismo con un representante de
                Atención al Cliente!
              </>
            )}{" "}
            O envía un correo electrónico a nuestro equipo de atención al cliente{" "}
            <a
              href={`mailto:${email}`}
              className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-neon-pink dark:hover:text-cyber-yellow"
            >
              aquí
            </a>
            .
          </p>
          <p>
            Alternativamente, puedes encontrar respuestas a tus preguntas en las
            preguntas frecuentes que aparecen a continuación.
          </p>
          <p className="pt-2 font-bold text-foreground">—Neon Shop.</p>
        </div>
      </div>
    </section>
  );
}
