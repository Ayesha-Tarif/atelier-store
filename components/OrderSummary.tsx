// components/OrderSummary.tsx
// Subtotal, delivery and total. Used in the drawer, cart page and checkout.

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";

export default function OrderSummary({
  subtotal,
  delivery,
  total,
}: {
  subtotal: number;
  delivery: number;
  total: number;
}) {
  const remaining = siteConfig.freeDeliveryThreshold - subtotal;

  return (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between">
        <span className="text-muted">Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-muted">Delivery</span>
        <span>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
      </div>

      {/* Friendly hint when the customer is close to free delivery */}
      {subtotal > 0 && remaining > 0 && (
        <p className="bg-beige/25 px-3 py-2 text-xs text-charcoal">
          Add {formatPrice(remaining)} more for free delivery.
        </p>
      )}

      <div className="flex justify-between border-t border-line pt-3 text-base">
        <span>Total</span>
        <span className="font-medium">{formatPrice(total)}</span>
      </div>
    </div>
  );
}