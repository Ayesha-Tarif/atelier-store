// app/order-success/page.tsx
// Shown after a successful order. It reads the order that
// CheckoutForm saved in sessionStorage.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order } from "@/types/product";
import { getLastOrder } from "@/lib/orderStorage";
import { formatPrice } from "@/lib/utils";
import OrderSummary from "@/components/OrderSummary";

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Storage only exists in the browser, so we read it after the page loads.
  useEffect(() => {
    setOrder(getLastOrder());
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="min-h-[60vh]" />;

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-sm text-muted">No recent order found.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-12 md:py-20">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
          Thank you
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
          Your order is confirmed
        </h1>
        <p className="mt-4 text-sm text-charcoal">
          Order number:{" "}
          <span className="font-medium">{order.orderNumber}</span>
        </p>
        <p className="mt-1 text-xs text-muted">{order.createdAt}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="border border-line p-6">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em]">
            Delivery details
          </h2>
          <div className="space-y-1 text-sm text-charcoal">
            <p>{order.customer.fullName}</p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.email}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}</p>
            {order.customer.notes && (
              <p className="pt-2 text-muted">Notes: {order.customer.notes}</p>
            )}
          </div>
        </div>

        <div className="border border-line p-6">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em]">
            Payment
          </h2>
          <p className="text-sm text-charcoal">{order.paymentMethod}</p>
          <p className="mt-1 text-xs text-muted">
            Please keep the exact amount ready when your order arrives.
          </p>
        </div>
      </div>

      <div className="mt-6 border border-line bg-offwhite p-6">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">
          Order summary
        </h2>
        <ul className="mt-5 divide-y divide-line">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.size}`}
              className="flex justify-between gap-4 py-3 text-sm"
            >
              <div>
                <p className="font-light">{item.name}</p>
                <p className="mt-1 text-xs text-muted">
                  Size {item.size} × {item.quantity}
                </p>
              </div>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-line pt-5">
          <OrderSummary
            subtotal={order.subtotal}
            delivery={order.delivery}
            total={order.total}
          />
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/shop"
          className="inline-block bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}