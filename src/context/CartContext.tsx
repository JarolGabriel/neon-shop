"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCart,
  getCartSessionId,
  removeCartItem as apiRemoveCartItem,
  updateCartItem as apiUpdateCartItem,
} from "@/lib/api";
import { runAfterPageReady } from "@/lib/defer-client-request";
import {
  calculateCartPricing,
  getCartItemCount,
  type CartPricing,
} from "@/lib/cart-pricing";
import type { CartItem } from "@/types/cart";

export type { CartItem };

export interface CartContextValue extends CartPricing {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  updateNotes: (itemId: string, notes: string | null) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (typeof window === "undefined" || !getCartSessionId()) {
      setItems([]);
      return;
    }

    try {
      const data = await getCart();
      setItems(data);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const cancelDeferred = runAfterPageReady(() => {
      void (async () => {
        setIsLoading(true);
        try {
          if (typeof window !== "undefined" && getCartSessionId()) {
            const data = await getCart();
            if (mounted) setItems(data);
          }
        } catch {
          if (mounted) setItems([]);
        } finally {
          if (mounted) setIsLoading(false);
        }
      })();
    }, 800);

    return () => {
      mounted = false;
      cancelDeferred();
    };
  }, []);

  const removeItem = useCallback(
    async (itemId: string) => {
      const previous = items;
      setItems((current) => current.filter((item) => item.id !== itemId));

      try {
        await apiRemoveCartItem(itemId);
      } catch {
        setItems(previous);
        throw new Error("No se pudo eliminar el producto del carrito");
      }
    },
    [items],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const previous = items;
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      );

      try {
        await apiUpdateCartItem(itemId, { quantity });
      } catch {
        setItems(previous);
        throw new Error("No se pudo actualizar la cantidad");
      }
    },
    [items],
  );

  const updateNotes = useCallback(
    async (itemId: string, notes: string | null) => {
      const previous = items;
      const currentItem = items.find((item) => item.id === itemId);
      if (!currentItem) return;

      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, notes } : item,
        ),
      );

      try {
        await apiUpdateCartItem(itemId, {
          quantity: currentItem.quantity,
          notes,
        });
      } catch {
        setItems(previous);
        throw new Error("No se pudo guardar la personalización");
      }
    },
    [items],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const pricing = useMemo(() => calculateCartPricing(items), [items]);
  const itemCount = useMemo(() => getCartItemCount(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      isLoading,
      fetchCart,
      removeItem,
      updateQuantity,
      updateNotes,
      clearCart,
      ...pricing,
    }),
    [
      items,
      itemCount,
      isLoading,
      fetchCart,
      removeItem,
      updateQuantity,
      updateNotes,
      clearCart,
      pricing,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }

  return context;
}
