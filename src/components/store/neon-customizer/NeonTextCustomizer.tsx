"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toPng } from "html-to-image";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NeonPriceEstimateCard } from "@/components/store/neon-customizer/NeonPriceEstimateCard";
import { uploadTextDesign } from "@/lib/api";
import { buildNeonShadow } from "@/lib/neon-glow";
import {
  NEON_FONTS,
  neonFontStyle,
  type NeonFontOption,
} from "@/lib/neon-fonts";
import { cn, formatUsd } from "@/lib/utils";
import {
  BACKGROUNDS,
  LETTER_PALETTE,
  NEON_COLORS,
  RGB_CYCLE,
  SIZE_OPTIONS,
  SPECIAL_EFFECTS,
  getFontSize,
  getNeonStyle,
  getSizeLabel,
  type NeonColor,
  type SpecialEffectId,
} from "@/lib/neon-customizer-config";
import { estimateNeonPrice } from "@/lib/neon-price-estimate";
import {
  neonTextFormSchema,
  type NeonTextFormValues,
} from "@/lib/schemas/neon-text-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp-utils";

interface NeonTextCustomizerProps {
  whatsappNumber: string;
}

export function NeonTextCustomizer({ whatsappNumber }: NeonTextCustomizerProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const dragPendingRef = useRef<{
    x: number;
    y: number;
    letterIndex: number | null;
  } | null>(null);

  const DRAG_THRESHOLD = 8;

  const [selectedBg, setSelectedBg] = useState("desing1");
  const [selectedColor, setSelectedColor] = useState<NeonColor>(NEON_COLORS[0]);
  const [selectedFont, setSelectedFont] =
    useState<NeonFontOption>(NEON_FONTS[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedUsage, setSelectedUsage] = useState("");
  const [selectedEffect, setSelectedEffect] =
    useState<SpecialEffectId>("single");
  const [letterColors, setLetterColors] = useState<Record<number, string>>({});
  const [activeLetterIndex, setActiveLetterIndex] = useState<number | null>(
    null,
  );
  const [rgbColorIndex, setRgbColorIndex] = useState(0);
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
      special_effect: "single",
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
  const watchedSize = watch("preferred_size");
  const watchedUsage = watch("usage_type");

  const priceEstimate = useMemo(
    () =>
      estimateNeonPrice({
        textContent,
        size: selectedSize || watchedSize,
        usageType: selectedUsage || watchedUsage,
        effectId: selectedEffect,
      }),
    [
      textContent,
      selectedSize,
      selectedUsage,
      selectedEffect,
      watchedSize,
      watchedUsage,
    ],
  );

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

  const handleWrapperPointerDown = (
    clientX: number,
    clientY: number,
    target: HTMLElement,
  ) => {
    if (target.closest(".letter-palette")) return;

    const letterEl = target.closest("[data-letter-index]");
    const letterIndex = letterEl
      ? Number(letterEl.getAttribute("data-letter-index"))
      : null;

    if (
      selectedEffect === "multicolor" &&
      letterIndex !== null &&
      !Number.isNaN(letterIndex)
    ) {
      dragPendingRef.current = { x: clientX, y: clientY, letterIndex };
      return;
    }

    dragPendingRef.current = null;
    setActiveLetterIndex(null);
    startDrag(clientX, clientY);
  };

  const handleWrapperMouseDown = (e: React.MouseEvent) => {
    handleWrapperPointerDown(
      e.clientX,
      e.clientY,
      e.target as HTMLElement,
    );
  };

  const handleWrapperTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    handleWrapperPointerDown(
      touch.clientX,
      touch.clientY,
      e.target as HTMLElement,
    );
  };

  const handleCanvasPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (selectedEffect !== "multicolor" || activeLetterIndex === null) return;

    const target = e.target as HTMLElement;
    if (
      target.closest("[data-letter-index]") ||
      target.closest(".letter-palette") ||
      target.closest("[data-text-wrapper]")
    ) {
      return;
    }
    setActiveLetterIndex(null);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const pending = dragPendingRef.current;
      if (!pending) return;

      if (
        Math.abs(e.clientX - pending.x) > DRAG_THRESHOLD ||
        Math.abs(e.clientY - pending.y) > DRAG_THRESHOLD
      ) {
        dragPendingRef.current = null;
        setActiveLetterIndex(null);
        startDrag(pending.x, pending.y);
      }
    };

    const onMouseUp = () => {
      const pending = dragPendingRef.current;
      if (!pending) return;

      dragPendingRef.current = null;
      if (pending.letterIndex !== null) {
        setActiveLetterIndex((prev) =>
          prev === pending.letterIndex ? null : pending.letterIndex,
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const pending = dragPendingRef.current;
      if (!pending) return;

      const touch = e.touches[0];
      if (!touch) return;

      if (
        Math.abs(touch.clientX - pending.x) > DRAG_THRESHOLD ||
        Math.abs(touch.clientY - pending.y) > DRAG_THRESHOLD
      ) {
        dragPendingRef.current = null;
        setActiveLetterIndex(null);
        startDrag(pending.x, pending.y);
      }
    };

    const onTouchEnd = () => {
      const pending = dragPendingRef.current;
      if (!pending) return;

      dragPendingRef.current = null;
      if (pending.letterIndex !== null) {
        setActiveLetterIndex((prev) =>
          prev === pending.letterIndex ? null : pending.letterIndex,
        );
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [textPos.x, textPos.y]);

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

  useEffect(() => {
    if (selectedEffect !== "rgb") return;
    const interval = setInterval(() => {
      setRgbColorIndex((prev) => (prev + 1) % RGB_CYCLE.length);
    }, 800);
    return () => clearInterval(interval);
  }, [selectedEffect]);

  const onSubmit = async (values: NeonTextFormValues) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);
    let allAnimated: NodeListOf<Element> | null = null;
    try {
      if (selectedEffect === "dynamic" || selectedEffect === "rgb") {
        canvas.style.setProperty("--animation-play-state", "paused");
        allAnimated = canvas.querySelectorAll("[style*='animation']");
        allAnimated.forEach((el) => {
          (el as HTMLElement).style.animationPlayState = "paused";
        });
      }

      const dataUrl = await toPng(canvas, {
        quality: 0.95,
        pixelRatio: 2,
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return (
              !node.classList.contains("bg-thumbnails") &&
              !node.classList.contains("letter-palette")
            );
          }
          return true;
        },
      });

      if (allAnimated) {
        allAnimated.forEach((el) => {
          (el as HTMLElement).style.animationPlayState = "running";
        });
        canvas.style.removeProperty("--animation-play-state");
      }

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
        `⚡ Efecto: ${
          SPECIAL_EFFECTS.find((e) => e.id === selectedEffect)?.label ??
          "Color único"
        }`,
        ...(selectedEffect === "multicolor" &&
        Object.keys(letterColors).length > 0
          ? [
              `🔤 Colores por letra: ${Object.entries(letterColors)
                .map(([i, c]) => {
                  const char = values.text_content.trim()[Number(i)] ?? "";
                  return `'${char}'→${c}`;
                })
                .join(", ")}`,
            ]
          : []),
        "",
        `👤 Cliente: ${values.customer_name}`,
        `📧 Email: ${values.customer_email}`,
        ...(values.customer_phone
          ? [`📱 WhatsApp: ${values.customer_phone}`]
          : []),
        ...(values.customer_notes
          ? [`📋 Detalles: ${values.customer_notes}`]
          : []),
        ...(priceEstimate
          ? [
              "",
              `💰 Estimación orientativa: ${formatUsd(priceEstimate.amountUsd)} (precio final por confirmar)`,
            ]
          : []),
        "",
        `🖼️ Vista previa: ${previewUrl}`,
      ].join("\n");

      window.open(buildWhatsAppUrl(whatsappNumber, mensaje), "_blank");
    } catch {
      if (allAnimated) {
        allAnimated.forEach((el) => {
          (el as HTMLElement).style.animationPlayState = "running";
        });
        canvas.style.removeProperty("--animation-play-state");
      }
      toast.error(
        "Hubo un problema al procesar tu diseño. Intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayText = textContent?.trim() || "Tu texto aquí...";
  const isPlaceholder = !textContent?.trim();

  const textWrapperStyle: CSSProperties = {
    left: textPos.x,
    top: textPos.y,
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
  };

  const textInnerStyle: CSSProperties = {
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    ...neonFontStyle(selectedFont),
    fontSize: getFontSize(selectedSize),
    transition: "font-size 0.2s ease, font-family 0.15s ease",
    opacity: isPlaceholder ? 0.4 : 1,
    whiteSpace: "pre-wrap",
    textAlign: "center",
  };

  const renderCanvasText = () => {
    switch (selectedEffect) {
      case "dynamic":
        return displayText.split("").map((char, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              animation:
                char === " "
                  ? "none"
                  : "neon-rainbow 2.5s linear infinite",
              animationDelay: `${(i * 0.12) % 2.5}s`,
              color: "#ffffff",
              textShadow: buildNeonShadow("#ff007a"),
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ));
      case "multicolor":
        return displayText.split("").map((char, i) => {
          const letterColor = letterColors[i] || selectedColor.color;
          return (
            <span
              key={`${char}-${i}`}
              data-letter-index={char !== " " ? i : undefined}
              role="presentation"
              style={{
                display: "inline-block",
                color: "#ffffff",
                textShadow: buildNeonShadow(letterColor),
                cursor: char === " " ? "default" : "pointer",
                borderRadius: "3px",
                padding: activeLetterIndex === i ? "0 2px" : "0",
                backgroundColor:
                  activeLetterIndex === i
                    ? "rgba(255, 255, 255, 0.22)"
                    : "transparent",
                transition: "background-color 0.15s ease",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        });
      case "rgb":
      case "single":
      default:
        return displayText;
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[65%_35%] lg:items-start">
      <div className="sticky top-0 z-10 h-[280px] w-full shrink-0 lg:sticky lg:top-6 lg:z-auto lg:h-[calc(100vh-5rem)] lg:px-6 lg:pt-6 lg:pb-8">
        <div
          ref={canvasRef}
          className="relative h-full w-full overflow-hidden bg-black lg:rounded-lg"
          onMouseDown={handleCanvasPointerDown}
          onTouchStart={handleCanvasPointerDown}
        >
          {isDarkBg ? (
            <div className="absolute inset-0 bg-black" aria-hidden />
          ) : (
            activeBackground?.src && (
              <Image
                src={activeBackground.src}
                alt={activeBackground.label}
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 65vw"
                unoptimized
                priority
              />
            )
          )}

          {!isDarkBg && (
            <div className="absolute inset-0 bg-black/40" aria-hidden />
          )}

          <div
            data-text-wrapper
            className="absolute z-10"
            style={textWrapperStyle}
            onMouseDown={handleWrapperMouseDown}
            onTouchStart={handleWrapperTouchStart}
          >
            <div
              ref={textRef}
              role="presentation"
              className="leading-tight"
              style={{
                ...textInnerStyle,
                ...getNeonStyle(
                  selectedEffect,
                  selectedColor,
                  RGB_CYCLE[rgbColorIndex],
                ),
              }}
            >
              {renderCanvasText()}
            </div>

            {activeLetterIndex !== null && selectedEffect === "multicolor" && (
              <div
                ref={paletteRef}
                className="letter-palette pointer-events-auto absolute top-0 left-full z-30 ml-2 w-[7.5rem] overflow-hidden rounded-lg border border-input/40 bg-background/55 p-2 shadow-lg backdrop-blur-md"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <p className="mb-1.5 truncate text-center text-[10px] text-foreground">
                  &apos;{displayText[activeLetterIndex]}&apos;
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {LETTER_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setLetterColors((prev) => ({
                          ...prev,
                          [activeLetterIndex]: color,
                        }));
                        setActiveLetterIndex(null);
                      }}
                      className="size-[18px] shrink-0 cursor-pointer rounded-full border border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLetterIndex(null)}
                  className="mt-1.5 block w-full text-center text-[10px] text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="bg-thumbnails absolute right-0 bottom-3 left-0 z-10 mx-4 flex justify-center rounded-xl bg-black/50 px-3 py-2 backdrop-blur-sm">
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
                      unoptimized
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[65vh] overflow-y-auto bg-background p-4 lg:max-h-none lg:overflow-visible lg:p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-6 lg:gap-8">
        <section className="space-y-2 lg:space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground lg:text-lg">
            1. Tu texto
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-w-0 flex-col space-y-1.5 lg:space-y-2">
              <Label
                htmlFor="text_content"
                className="text-xs text-muted-foreground lg:text-sm"
              >
                ¿Qué dirá tu letrero?
              </Label>
              <Input
                id="text_content"
                placeholder="Ej: Abierto, Bienvenidos, Love..."
                maxLength={80}
                {...register("text_content")}
                className="h-10"
                aria-invalid={!!errors.text_content}
              />
              <div className="flex justify-between gap-2">
                {errors.text_content && (
                  <p className="text-xs text-destructive lg:text-sm">
                    {errors.text_content.message}
                  </p>
                )}
                <p className="ml-auto text-[10px] text-muted-foreground lg:text-xs">
                  {textContent?.length ?? 0} / 80
                </p>
              </div>
            </div>
            <div className="flex min-w-0 flex-col space-y-1.5 lg:space-y-2">
              <span
                className="text-xs text-muted-foreground opacity-0 lg:text-sm"
                aria-hidden
              >
                ¿Qué dirá tu letrero?
              </span>
              <button
                type="button"
                onClick={() => router.push("/diseno-personalizado")}
                className="flex h-10 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-vite-purple bg-vite-purple/20 px-2 text-center transition-colors hover:bg-vite-purple/30"
              >
                <p className="text-[10px] leading-tight text-muted-foreground lg:text-xs">
                  ¿Tienes un logo?
                </p>
                <p className="text-[11px] leading-tight font-bold text-vite-purple lg:text-sm">
                  SUBIR DISEÑO
                </p>
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-2 lg:space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground lg:text-lg">
            2. Elige la fuente
          </h2>
          <button
            type="button"
            onClick={() => setShowFontPanel((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground lg:px-4 lg:py-3 lg:text-base"
          >
            <span style={neonFontStyle(selectedFont)}>
              {selectedFont.label}
            </span>
            {showFontPanel ? (
              <ChevronUp className="size-4 shrink-0" aria-hidden />
            ) : (
              <ChevronDown className="size-4 shrink-0" aria-hidden />
            )}
          </button>
          {showFontPanel && (
            <div className="grid max-h-[400px] grid-cols-3 gap-1.5 overflow-y-auto lg:grid-cols-4 lg:gap-2">
              {NEON_FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => {
                    setSelectedFont(font);
                    setValue("preferred_font", font.label);
                  }}
                  className={cn(
                    "relative cursor-pointer rounded-lg border p-2 text-center text-[0.72rem] leading-tight lg:p-2.5 lg:text-[1rem]",
                    selectedFont.id === font.id
                      ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                      : "border-input bg-card text-foreground",
                  )}
                  style={neonFontStyle(font)}
                >
                  {font.isNew && (
                    <span className="absolute top-0.5 right-0.5 rounded bg-vite-purple px-1 py-px text-[7px] font-bold uppercase tracking-wide text-white lg:text-[8px]">
                      Nuevo
                    </span>
                  )}
                  {font.label}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-2 lg:space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground lg:text-lg">
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
          <p className="text-[10px] text-muted-foreground lg:text-xs">
            El taller confirmará disponibilidad del color.
          </p>
        </section>

        <section className="space-y-2 lg:space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground lg:text-lg">
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
                  "rounded-lg border px-2.5 py-2 text-left text-xs transition-colors lg:px-3 lg:py-2.5 lg:text-sm",
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
            <p className="text-xs text-destructive lg:text-sm">
              {errors.preferred_size.message}
            </p>
          )}
        </section>

        <section className="space-y-2 lg:space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground lg:text-lg">
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
                "rounded-lg border px-2.5 py-2 text-xs transition-colors lg:px-3 lg:py-2.5 lg:text-sm",
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
                "rounded-lg border px-2.5 py-2 text-xs transition-colors lg:px-3 lg:py-2.5 lg:text-sm",
                selectedUsage === "exterior_ip67"
                  ? "border-neon-pink bg-neon-pink/20 text-neon-pink"
                  : "border-input bg-card text-foreground",
              )}
            >
              🌧️ Exterior
            </button>
          </div>
          {errors.usage_type && (
            <p className="text-xs text-destructive lg:text-sm">
              {errors.usage_type.message}
            </p>
          )}
        </section>

        <section className="space-y-2 lg:space-y-3">
          <h2 className="font-heading text-base font-bold text-foreground lg:text-lg">
            6. Efecto especial
          </h2>
          <div className="flex flex-col gap-2">
            {SPECIAL_EFFECTS.map((effect) => (
              <div
                key={effect.id}
                role="radio"
                aria-checked={selectedEffect === effect.id}
                onClick={() => {
                  setSelectedEffect(effect.id);
                  setLetterColors({});
                  setActiveLetterIndex(null);
                  setValue("special_effect", effect.label);
                }}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors lg:gap-3 lg:p-3",
                  selectedEffect === effect.id
                    ? "border-neon-pink bg-neon-pink/10"
                    : "border-input bg-card hover:border-neon-pink/50",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    selectedEffect === effect.id
                      ? "border-neon-pink"
                      : "border-muted-foreground",
                  )}
                >
                  {selectedEffect === effect.id && (
                    <div className="h-2.5 w-2.5 rounded-full bg-neon-pink" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground lg:text-sm">
                    {effect.icon} {effect.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground lg:text-xs">
                    {effect.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {selectedEffect === "multicolor" && (
            <p className="text-[10px] text-neon-pink lg:text-xs">
              💡 Toca cualquier letra en el lienzo para asignarle un color.
            </p>
          )}
        </section>

        <section className="space-y-3 border-t border-input pt-4 lg:space-y-4 lg:pt-6">
          <h2 className="font-heading text-base font-bold text-foreground lg:text-lg">
            7. Tus datos de contacto
          </h2>
          <div className="space-y-1.5 lg:space-y-2">
            <Label htmlFor="customer_name" className="text-xs lg:text-sm">
              Nombre o empresa
            </Label>
            <Input
              id="customer_name"
              {...register("customer_name")}
              aria-invalid={!!errors.customer_name}
            />
            {errors.customer_name && (
              <p className="text-xs text-destructive lg:text-sm">
                {errors.customer_name.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5 lg:space-y-2">
            <Label htmlFor="customer_email" className="text-xs lg:text-sm">
              Correo electrónico
            </Label>
            <Input
              id="customer_email"
              type="email"
              autoComplete="email"
              {...register("customer_email")}
              aria-invalid={!!errors.customer_email}
            />
            {errors.customer_email && (
              <p className="text-xs text-destructive lg:text-sm">
                {errors.customer_email.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5 lg:space-y-2">
            <Label htmlFor="customer_phone" className="text-xs lg:text-sm">
              WhatsApp / Teléfono
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              autoComplete="tel"
              {...register("customer_phone")}
            />
          </div>
          <div className="space-y-1.5 lg:space-y-2">
            <Label htmlFor="customer_notes" className="text-xs lg:text-sm">
              Detalles adicionales
            </Label>
            <Textarea
              id="customer_notes"
              placeholder="Medidas exactas, referencias, urgencia..."
              rows={3}
              maxLength={500}
              {...register("customer_notes")}
              aria-invalid={!!errors.customer_notes}
            />
            {errors.customer_notes && (
              <p className="text-xs text-destructive lg:text-sm">
                {errors.customer_notes.message}
              </p>
            )}
          </div>

          <NeonPriceEstimateCard
            estimate={priceEstimate}
            hasText={textContent.trim().length > 0}
          />
        </section>
      </div>

          <div className="mt-4 border-t border-input pt-4 pb-4 lg:mt-6 lg:pb-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-auto w-full rounded-xl border border-transparent bg-neon-pink py-3 text-base font-bold text-white transition-colors duration-200 hover:bg-neon-pink/90 dark:bg-cyber-yellow dark:text-black dark:hover:bg-cyber-yellow/90 lg:py-4 lg:text-lg"
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
          </div>
        </form>
      </div>
    </div>
  );
}
