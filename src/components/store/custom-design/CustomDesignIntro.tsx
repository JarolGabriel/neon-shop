import { cn } from "@/lib/utils";

interface CustomDesignIntroProps {
  className?: string;
}

const INTRO_BLOCKS = [
  {
    type: "paragraph" as const,
    content:
      "Nuestro equipo de diseño se dedica a transformar sus ideas en letreros de neón LED. Desde logotipos comerciales y arte mural hasta carteles para salas de juego, luces de bar personalizadas, decoración para bodas, luces de neón para fiestas, acentos para el hogar y regalos únicos, creamos carteles de neón LED personalizados adaptados a sus necesidades.",
  },
  {
    type: "paragraph" as const,
    content:
      "Benefíciese de nuestro servicio de diseño gratuito: envíenos su imagen e ideas (formatos aceptables: JPG, PNG, PDF) y nuestros talentosos diseñadores trabajarán con usted para crear un cartel de neón LED único que destaque. Utilice el formulario que aparece a continuación para cargar su imagen y recibir un diseño de rótulo de neón personalizado gratuito.",
  },
  {
    type: "faq" as const,
    question: "¿No tiene una imagen preparada?",
    answer:
      "¡No hay ningún problema! Utilice el formulario para describir el letrero de neón que desea, y nuestro equipo de diseño experto le ayudará a dar vida a su visión.",
  },
  {
    type: "faq" as const,
    question: "¿Necesita inspiración?",
    answer:
      "Consulte nuestros ejemplos o déjenos crear algo totalmente único para usted. Le guiaremos a través de opciones de color, estilos de fuente y tamaños para crear el diseño perfecto.",
  },
  {
    type: "faq" as const,
    question: "¿Ya tiene un diseño?",
    answer:
      "Ya sea un boceto dibujado a mano, una imagen inspiradora o notas de diseño detalladas, podemos convertir su idea en una brillante obra maestra de neón. No importa lo simple o compleja que sea su visión, estamos aquí para hacerla realidad.",
  },
];

export function CustomDesignIntro({ className }: CustomDesignIntroProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-8 text-center",
        className,
      )}
    >
      {INTRO_BLOCKS.map((block) =>
        block.type === "paragraph" ? (
          <p
            key={block.content.slice(0, 32)}
            className="text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {block.content}
          </p>
        ) : (
          <div key={block.question} className="flex flex-col gap-2">
            <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
              {block.question}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {block.answer}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
