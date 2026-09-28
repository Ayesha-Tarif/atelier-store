// app/cart/page.tsx
// The full cart page. Same data as the drawer, just bigger.

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/CartItemRow";
import OrderSummary from "@/components/OrderSummary";

export default function CartPage() {
  const { items, isHydrated, subtotal, delivery, total } = useCart();

  // Wait until the saved cart is loaded, so we don't flash "empty".
  if (!isHydrated) return <div className="min-h-[60vh]" />;

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="text-center text-3xl font-light tracking-tight md:text-4xl">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-muted">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-6 inline-block bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <ul className="border-t border-line">
            {items.map((item) => (
              <CartItemRow key={`${item.productId}-${item.size}`} item={item} />
            ))}
          </ul>

          <aside className="h-fit border border-line bg-offwhite p-6 md:p-8">
            <h2 className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em]">
              Order summary
            </h2>
            <OrderSummary
              subtotal={subtotal}
              delivery={delivery}
              total={total}
            />
            <Link
              href="/checkout"
              className="mt-6 block bg-ink py-4 text-center text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="link-underline mt-5 block text-center text-[11px] uppercase tracking-[0.2em] text-muted hover:text-ink"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}