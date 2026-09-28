// context/CartContext.tsx
// ------------------------------------------------------------
// The shopping cart "brain". React Context lets any component
// read and change the cart without passing props around.
// The cart is saved in localStorage so it survives a refresh.
// ------------------------------------------------------------

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
import type { CartItem, Size } from "@/types/product";
import {
  getDeliveryCharge,
  getItemCount,
  getSubtotal,
  getTotal,
} from "@/lib/utils";

const STORAGE_KEY = "atelier-cart";
const MAX_QUANTITY = 10;

// Everything the cart offers to the rest of the app.
interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean; // true once the saved cart has been loaded
  isOpen: boolean; // is the slide-out drawer open?
  itemCount: number;
  subtotal: number;
  delivery: number;
  total: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, size: Size, quantity: number) => void;
  removeItem: (productId: string, size: Size) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1) When the site first loads in the browser, read the saved cart.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Ignore broken or blocked storage.
    }
    setIsHydrated(true);
  }, []);

  // 2) Every time the cart changes, save it again.
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore if storage is blocked.
    }
  }, [items, isHydrated]);

  // Add a product. If the same product + size exists, increase its quantity.
  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i === existing
            ? {
                ...i,
                quantity: Math.min(MAX_QUANTITY, i.quantity + newItem.quantity),
              }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  // Change quantity (kept between 1 and 10).
  const updateQuantity = useCallback(
    (productId: string, size: Size, quantity: number) => {
      const safe = Math.max(1, Math.min(MAX_QUANTITY, quantity));
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: safe }
            : i
        )
      );
    },
    []
  );

  // Remove one line from the cart.
  const removeItem = useCallback((productId: string, size: Size) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Totals are calculated from the items, so they are always correct.
  const value = useMemo(() => {
    const subtotal = getSubtotal(items);
    const delivery = getDeliveryCharge(subtotal);
    return {
      items,
      isHydrated,
      isOpen,
      itemCount: getItemCount(items),
      subtotal,
      delivery,
      total: getTotal(subtotal, delivery),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    };
  }, [
    items,
    isHydrated,
    isOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// A shortcut hook: const { items, addItem } = useCart();
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}