// components/CartItemRow.tsx
// One product line inside the cart (drawer and /cart page), with its photo.

"use client";

import Link from "next/link";
import type { CartItem } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import PlaceholderImage from "./PlaceholderImage";
import QuantitySelector from "./QuantitySelector";

export default function CartItemRow({
  item,
  onNavigate,
}: {
  item: CartItem;
  onNavigate?: () => void;
}) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <li className="flex gap-4 border-b border-line py-5">
      <Link href={`/product/${item.slug}`} onClick={onNavigate} className="w-20 shrink-0">
        <PlaceholderImage src={`/images/products/${item.slug}.jpg`} label={item.name} />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-3">
          <div>
            <Link href={`/product/${item.slug}`} onClick={onNavigate} className="text-sm font-light">
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-muted">Size: {item.size}</p>
          </div>
          <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.productId, item.size, q)} />
          <button
            onClick={() => removeItem(item.productId, item.size)}
            className="link-underline text-[11px] uppercase tracking-[0.15em] text-muted hover:text-ink"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}