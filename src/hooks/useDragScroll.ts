"use client";

import { useCallback, useRef, useState } from "react";
import type { DragEvent, MouseEvent, PointerEvent } from "react";

const DRAG_THRESHOLD = 4;

/**
 * Permite desplazar un contenedor horizontalmente arrastrando con el mouse
 * (click izquierdo + mover) en desktop. En táctil se usa el scroll nativo.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const state = useRef({ down: false, startX: 0, startScroll: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = useCallback((e: PointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    state.current = {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<T>) => {
    const s = state.current;
    const el = ref.current;
    if (!s.down || !el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) s.moved = true;
    el.scrollLeft = s.startScroll - dx;
  }, []);

  const endDrag = useCallback(() => {
    if (!state.current.down) return;
    state.current.down = false;
    setIsDragging(false);
  }, []);

  // Evita que un arrastre se interprete como click (navegación) en las tarjetas.
  const onClickCapture = useCallback((e: MouseEvent<T>) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  }, []);

  // Cancela el "drag" nativo de imágenes/enlaces que bloquea el arrastre.
  const onDragStart = useCallback((e: DragEvent<T>) => {
    e.preventDefault();
  }, []);

  return {
    ref,
    isDragging,
    dragProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onClickCapture,
      onDragStart,
    },
  };
}
