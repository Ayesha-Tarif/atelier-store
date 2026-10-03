// components/ProductDetails.tsx
// Top part of a product page: photo on the left,
// name, price, size, quantity and Add to Cart on the right.

"use client";

import { useState } from "react";
import type { Product, Size } from "@/types/product";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import PlaceholderImage from "./PlaceholderImage";
import QuantitySelector from "./QuantitySelector";
import SizeSelector from "./SizeSelector";

export default function ProductDetails({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  function handleAddToCart() {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      quantity,
    });
    setError("");
    openCart();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Product photo */}
            <PlaceholderImage className="aspect-[4/5]" src={product.imageUrl ?? `/images/products/${product.slug}.jpg`} label={product.name} />
      {/* Information */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex gap-2">
          {product.isNew && (
            <span className="border border-line bg-offwhite px-2 py-1 text-[10px] uppercase tracking-[0.15em]">New</span>
          )}
          {product.isSale && (
            <span className="bg-sage-dark px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white">Sale</span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-light tracking-tight">{product.name}</h1>
        <p className="mt-3 text-lg">{formatPrice(product.price)}</p>

        <p className="mt-6 text-sm leading-relaxed text-charcoal">{product.description}</p>

        <div className="mt-8">
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em]">
            Size {size && <span className="text-muted">: {size}</span>}
          </p>
          <SizeSelector
            sizes={product.sizes}
            selected={size}
            onSelect={(s) => {
              setSize(s);
              setError("");
            }}
          />
          {error && <p className="mt-2 text-xs text-[#8a3b3b]">{error}</p>}
        </div>

        <div className="mt-6">
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em]">Quantity</p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-8 w-full bg-ink py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-sage-dark"
        >
          Add to Cart
        </button>

        <ul className="mt-8 space-y-2 border-t border-line pt-6 text-xs text-muted">
          <li>Cash on Delivery available</li>
          <li>Free delivery on orders above {formatPrice(siteConfig.freeDeliveryThreshold)}</li>
        </ul>
      </div>
    </div>
  );
}