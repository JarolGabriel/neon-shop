"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toPng } from "html-to-image";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadTextDesign } from "@/lib/api";
import { cn } from "@/lib/utils";

const NEON_FONTS = [
  { id: "pacifico", label: "Pacifico", family: "Pacifico" },
  { id: "dancing-script", label: "Dancing Script", family: "Dancing Script" },
  { id: "sacramento", label: "Sacramento", family: "Sacramento" },
  { id: "satisfy", label: "Satisfy", family: "Satisfy" },
  { id: "great-vibes", label: "Great Vibes", family: "Great Vibes" },
  { id: "righteous", label: "Righteous", family: "Righteous" },
  { id: "lobster", label: "Lobster", family: "Lobster" },
  {
    id: "permanent-marker",
    label: "Permanent Marker",
    family: "Permanent Marker",
  },
  { id: "allura", label: "Allura", family: "Allura" },
  { id: "courgette", label: "Courgette", family: "Courgette" },
] as const;

const NEON_COLORS = [
  {
    id: "blanco",
    label: "Blanco",
    color: "#ffffff",
    shadow:
      "0 0 7px #fff, 0 0 21px #fff, 0 0 42px #fff, 0 0 82px #fff",
  },
  {
    id: "cyan",
    label: "Azul Neón",
    color: "#00d4ff",
    shadow:
      "0 0 7px #00d4ff, 0 0 21px #00d4ff, 0 0 42px #00d4ff, 0 0 82px #00d4ff",
  },
  {
    id: "rosa",
    label: "Rosa",
    color: "#ff007a",
    shadow:
      "0 0 7px #ff007a, 0 0 21px #ff007a, 0 0 42px #ff007a, 0 0 82px #ff007a",
  },
  {
    id: "amarillo",
    label: "Amarillo",
    color: "#fcee0a",
    shadow:
      "0 0 7px #fcee0a, 0 0 21px #fcee0a, 0 0 42px #fcee0a, 0 0 82px #fcee0a",
  },
  {
    id: "verde",
    label: "Verde",
    color: "#00ff87",
    shadow:
      "0 0 7px #00ff87, 0 0 21px #00ff87, 0 0 42px #00ff87, 0 0 82px #00ff87",
  },
  {
    id: "purpura",
    label: "Púrpura",
    color: "#bd34fe",
    shadow:
      "0 0 7px #bd34fe, 0 0 21px #bd34fe, 0 0 42px #bd34fe, 0 0 82px #bd34fe",
  },
  {
    id: "naranja",
    label: "Naranja",
    color: "#ff6b00",
    shadow:
      "0 0 7px #ff6b00, 0 0 21px #ff6b00, 0 0 42px #ff6b00, 0 0 82px #ff6b00",
  },
] as const;

const BACKGROUNDS = [
  {
    id: "bacardi",
    src: "/images/gallery-bacardi-neon.jpg",
    label: "Bar",
  },
  {
    id: "patron",
    src: "/images/gallery-patron-neon.jpg",
    label: "Tequila",
  },
  { id: "hello", src: "/images/gallery-hello.jpg", label: "Sala" },
  {
    id: "charley",
    src: "/images/gallery-charleys-steak.jpg",
    label: "Restaurant",
  },
  { id: "play", src: "/images/gallery-play-game.jpg", label: "Gaming" },
  { id: "open", src: "/images/gallery-open.webp", label: "Tienda" },
  { id: "mikes", src: "/images/gallery-mikes-honey.jpg", label: "Miel" },
  {
    id: "volcan",
    src: "/images/gallery-volcan-tequila.jpg",
    label: "Volcán",
  },
  { id: "dark", src: "", label: "Negro" },
] as const;

const SIZE_OPTIONS = [
  { value: "pequeno", label: "Pequeño · hasta 40 cm" },
  { value: "mediano", label: "Mediano · 40–80 cm" },
  { value: "grande", label: "Grande · 80–120 cm" },
  { value: "xl", label: "XL · 120–180 cm" },
  { value: "xxl", label: "XXL · +180 cm" },
] as const;

const neonTextFormSchema = z.object({
  text_content: z
    .string()
    .min(1, "Escribe el texto de tu letrero")
    .max(80, "Máximo 80 caracteres"),
  preferred_size: z.enum(["pequeno", "mediano", "grande", "xl", "xxl"], {
    message: "Elige un tamaño",
  }),
  usage_type: z.enum(["interior", "exterior_ip67"], {
    message: "Elige el uso",
  }),
  preferred_color: z.string().optional(),
  preferred_font: z.string().optional(),
  customer_name: z.string().min(1, "Necesitamos tu nombre").max(120),
  customer_email: z.string().email("Introduce un correo válido"),
  customer_phone: z.string().optional(),
  customer_notes: z.string().max(500).optional(),
});

type NeonTextFormValues = z.infer<typeof neonTextFormSchema>;

type NeonColor = (typeof NEON_COLORS)[number];
type NeonFont = (typeof NEON_FONTS)[number];

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "584121234567";

function getFontSize(size: string): string {
  return (
    {
      pequeno: "1.8rem",
      mediano: "2.5rem",
      grande: "3.2rem",
      xl: "4rem",
      xxl: "5rem",
    }[size] ?? "2.5rem"
  );
}

function getSizeLabel(size: string): string {
  return SIZE_OPTIONS.find((opt) => opt.value === size)?.label ?? size;
}

export function NeonTextCustomizer() {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [selectedBg, setSelectedBg] = useState("bacardi");
  const [selectedColor, setSelectedColor] = useState<NeonColor>(NEON_COLORS[0]);
  const [selectedFont, setSelectedFont] = useState<NeonFont>(NEON_FONTS[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedUsage, setSelectedUsage] = useState("");
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NeonTextFormValues>({
    resolver: zodResolver(neonTextFormSchema),
    defaultValues: {
      text_content: "",
      preferred_color: NEON_COLORS[0].label,
      preferred_font: NEON_FONTS[0].label,
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      customer_notes: "",
    },
    mode: "onSubmit",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const textContent = watch("text_content");

  const activeBackground = BACKGROUNDS.find((bg) => bg.id === selectedBg);
  const isDarkBg = selectedBg === "dark";

  useEffect(() => {
    if (canvasRef.current) {
      setTextPos({
        x: canvasRef.current.offsetWidth / 2,
        y: canvasRef.current.offsetHeight / 2,
      });
    }
  }, []);

  const startDrag = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setDragOffset({
      x: clientX - rect.left - textPos.x,
      y: clientY - rect.top - textPos.y,
    });
    setIsDragging(true);
  };

  const handleTextMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTextTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const newX = clientX - rect.left - dragOffset.x;
      const newY = clientY - rect.top - dragOffset.y;

      setTextPos({
        x: Math.max(0, Math.min(canvas.offsetWidth, newX)),
        y: Math.max(0, Math.min(canvas.offsetHeight, newY)),
      });
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      e.preventDefault();
      handleMove(touch.clientX, touch.clientY);
    };
    const endDrag = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", endDrag);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", endDrag);
    };
  }, [isDragging, dragOffset]);

  const onSubmit = async (values: NeonTextFormValues) => {
    if (!canvasRef.current) return;

    setIsSubmitting(true);
    try {
      const dataUrl = await toPng(canvasRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return !node.classList.contains("bg-thumbnails");
          }
          return true;
        },
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "neon-preview.png", { type: "image/png" });

      const response = await uploadTextDesign({
        file,
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        text_content: values.text_content,
        customer_phone: values.customer_phone || undefined,
        preferred_color: values.preferred_color,
        preferred_size: values.preferred_size,
        usage_type: values.usage_type,
        customer_notes: values.customer_notes || undefined,
      });

      const previewUrl = response.data.uploaded_file_url ?? "";
      const usoLabel =
        values.usage_type === "interior" ? "Interior" : "Exterior";

      const mensaje = [
        "🌟 *Nueva cotización de letrero de neón*",
        "",
        `📝 Texto: ${values.text_content}`,
        `🔤 Fuente: ${values.preferred_font || "No especificada"}`,
        `📐 Tamaño: ${getSizeLabel(values.preferred_size)}`,
        `💡 Uso: ${usoLabel}`,
        `🎨 Color: ${values.preferred_color || "A definir"}`,
        "",
        `👤 Cliente: ${values.customer_name}`,
        `📧 Email: ${values.customer_email}`,
        ...(values.customer_phone
          ? [`📱 WhatsApp: ${values.customer_phone}`]
          : []),
        ...(values.customer_notes
          ? [`📋 Detalles: ${values.customer_notes}`]
          : []),
        "",
        `🖼️ Vista previa: ${previewUrl}`,
      ].join("\n");

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`,
        "_blank",
      );
    } catch {
      toast.error(
        "Hubo un problema al procesar tu diseño. Intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayText = textContent?.trim() || "Tu texto aquí...";
  const isPlaceholder = !textContent?.trim();

  return (
    <div className="relative min-h-screen">
      {isDarkBg ? (
        <div className="fixed inset-0 z-0 bg-black" aria-hidden />
      ) : (
        activeBackground?.src && (
          <div className="fixed inset-0 z-0">
            <Image
              src={activeBackground.src}
              alt={activeBackground.label}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )
      )}

      {!isDarkBg && (
        <div
          className="fixed inset-0 z-[1] bg-black/45"
          aria-hidden
        />
      )}

      <div className="relative z-10 flex min-h-screen flex-col lg:grid lg:grid-cols-[40%_60%]">
        <div
          ref={canvasRef}
          className="relative flex h-[45vh] items-center justify-center lg:h-[55vh] lg:min-h-screen"
        >
          <div
            ref={textRef}
            role="presentation"
            onMouseDown={handleTextMouseDown}
            onTouchStart={handleTextTouchStart}
            className="absolute max-w-[90%] whitespace-pre-wrap text-center leading-tight"
            style={{
              left: textPos.x,
              top: textPos.y,
              transform: "translate(-50%, -50%)",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              color: selectedColor.color,
              textShadow: selectedColor.shadow,
              fontFamily: selectedFont.family,
              fontSize: getFontSize(selectedSize),
              transition: "font-size 0.2s ease",
              opacity: isPlaceholder ? 0.4 : 1,
            }}
          >
            {displayText}
          </div>

          <div className="bg-thumbnails absolute right-0 bottom-3 left-0 mx-4 flex justify-center rounded-xl bg-black/50 px-3 py-2 backdrop-blur-sm">
            <div className="flex gap-2 overflow-x-auto">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBg(bg.id)}
                  className={cn(
                    "relative h-10 w-14 shrink-0 cursor-pointer overflow-hidden rounded",
                    selectedBg === bg.id && "ring-2 ring-cyber-yellow",
                  )}
                  aria-label={`Fondo ${bg.label}`}
                  aria-pressed={selectedBg === bg.id}
                >
                  {bg.id === "dark" ? (
                    <span className="flex h-full w-full items-center justify-center bg-zinc-900 text-xs text-white">
                      Negro
                    </span>
                  ) : (
                    <Image
                      src={bg.src}
                      alt={bg.label}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 max-h-[70vh] overflow-y-auto border-t border-input bg-card/95 p-6 backdrop-blur-md lg:max-h-[80vh] lg:overflow-y-auto lg:border-t-0">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-8">
              <section className="space-y-3">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  1. Tu texto
                </h2>
                <div className="flex gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label
                      htmlFor="text_content"
                      className="text-muted-foreground"
                    >
                      ¿Qué dirá tu letrero?
                    </Label>
                    <Input
                      id="text_content"
                      placeholder="Ej: Abierto, Bienvenidos, Love..."
                      maxLength={80}
                      {...register("text_content")}
                      aria-invalid={!!errors.text_content}
                    />
                    <div className="flex justify-between gap-2">
                      {errors.text_content && (
                        <p className="text-sm text-destructive">
                          {errors.text_content.message}
                        </p>
                      )}
                      <p className="ml-auto text-xs text-muted-foreground">
                        {textContent?.length ?? 0} / 80
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/diseno-personalizado")}
                    className="w-40 shrink-0 cursor-pointer rounded-xl border-2 border-vite-purple bg-vite-purple/20 p-3 text-center transition-colors hover:bg-vite-purple/30"
                  >
                    <p className="text-xs text-muted-foreground">
                      ¿Tienes un logo?
                    </p>
                    <p className="text-sm font-bold text-vite-purple">
                      SUBIR DISEÑO
                    </p>
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  2. Elige la fuente
                </h2>
                <button
                  type="button"
                  onClick={() => setShowFontPanel((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg border border-input bg-card px-4 py-3 text-foreground"
                >
                  <span style={{ fontFamily: selectedFont.family }}>
                    {selectedFont.label}
                  </span>
                  {showFontPanel ? (
                    <ChevronUp className="size-4 shrink-0" aria-hidden />
                  ) : (
                    <ChevronDown className="size-4 shrink-0" aria-hidden />
                  )}
                </button>
                {showFontPanel && (
                  <div className="grid max-h-[280px] grid-cols-4 gap-2 overflow-y-auto">
                    {NEON_FONTS.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => {
                          setSelectedFont(font);
                          setShowFontPanel(false);
                          setValue("preferred_font", font.label);
                        }}
                        className={cn(
                          "cursor-pointer rounded-lg border p-3 text-center text-[1.1rem]",
                          selectedFont.id === font.id
                            ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                            : "border-input bg-card text-foreground",
                        )}
                        style={{ fontFamily: font.family }}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  3. Color del neón
                </h2>
                <div className="flex flex-wrap gap-3">
                  {NEON_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setValue("preferred_color", color.label);
                      }}
                      className={cn(
                        "h-9 w-9 cursor-pointer rounded-full border-2 border-transparent transition-transform",
                        selectedColor.id === color.id &&
                          "scale-110 ring-2 ring-offset-2 ring-foreground",
                      )}
                      style={{ backgroundColor: color.color }}
                      aria-label={color.label}
                      aria-pressed={selectedColor.id === color.id}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  El taller confirmará disponibilidad del color.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  4. Tamaño
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size.value);
                        setValue("preferred_size", size.value, {
                          shouldValidate: true,
                        });
                      }}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                        selectedSize === size.value
                          ? "border-cyber-yellow bg-cyber-yellow font-semibold text-black"
                          : "border-input bg-card text-foreground hover:border-cyber-yellow",
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                {errors.preferred_size && (
                  <p className="text-sm text-destructive">
                    {errors.preferred_size.message}
                  </p>
                )}
              </section>

              <section className="space-y-3">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  5. Uso
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUsage("interior");
                      setValue("usage_type", "interior", {
                        shouldValidate: true,
                      });
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                      selectedUsage === "interior"
                        ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                        : "border-input bg-card text-foreground",
                    )}
                  >
                    🏠 Interior
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUsage("exterior_ip67");
                      setValue("usage_type", "exterior_ip67", {
                        shouldValidate: true,
                      });
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                      selectedUsage === "exterior_ip67"
                        ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                        : "border-input bg-card text-foreground",
                    )}
                  >
                    🌧️ Exterior
                  </button>
                </div>
                {errors.usage_type && (
                  <p className="text-sm text-destructive">
                    {errors.usage_type.message}
                  </p>
                )}
              </section>

              <section className="space-y-4 border-t border-input pt-6">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Tus datos de contacto
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Nombre o empresa</Label>
                  <Input
                    id="customer_name"
                    {...register("customer_name")}
                    aria-invalid={!!errors.customer_name}
                  />
                  {errors.customer_name && (
                    <p className="text-sm text-destructive">
                      {errors.customer_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_email">Correo electrónico</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    autoComplete="email"
                    {...register("customer_email")}
                    aria-invalid={!!errors.customer_email}
                  />
                  {errors.customer_email && (
                    <p className="text-sm text-destructive">
                      {errors.customer_email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">WhatsApp / Teléfono</Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    autoComplete="tel"
                    {...register("customer_phone")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_notes">Detalles adicionales</Label>
                  <Textarea
                    id="customer_notes"
                    placeholder="Medidas exactas, referencias, urgencia..."
                    rows={3}
                    maxLength={500}
                    {...register("customer_notes")}
                    aria-invalid={!!errors.customer_notes}
                  />
                  {errors.customer_notes && (
                    <p className="text-sm text-destructive">
                      {errors.customer_notes.message}
                    </p>
                  )}
                </div>
              </section>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 h-auto w-full rounded-xl bg-cyber-yellow py-4 text-lg font-bold text-black transition-colors hover:bg-cyber-yellow/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" aria-hidden />
                  Generando diseño...
                </>
              ) : (
                "Cotizar por WhatsApp →"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
