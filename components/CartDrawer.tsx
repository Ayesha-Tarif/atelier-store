// components/CartDrawer.tsx
// The cart that slides in from the right side.
// It opens when the bag icon is clicked or after "Add to Cart".

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItemRow from "./CartItemRow";
import OrderSummary from "./OrderSummary";

export default function CartDrawer() {
  const { items, isOpen, closeCart, itemCount, subtotal, delivery, total } =
    useCart();

  // While open: close with the Escape key and stop the page scrolling.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Dark background: click to close */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* The drawer panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">
            Your Bag ({itemCount})
          </h2>
          <button onClick={closeCart} aria-label="Close cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-muted">Your bag is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="link-underline mt-5 inline-block text-[11px] uppercase tracking-[0.2em]"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul>
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.size}`}
                  item={item}
                  onNavigate={closeCart}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer with totals and buttons */}
        {items.length > 0 && (
          <div className="space-y-5 border-t border-line px-6 py-6">
            <OrderSummary
              subtotal={subtotal}
              delivery={delivery}
              total={total}
            />
            <div className="grid gap-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="bg-ink py-4 text-center text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="border border-ink py-4 text-center text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-offwhite"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}