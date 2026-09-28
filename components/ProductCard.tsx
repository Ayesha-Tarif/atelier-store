// components/ProductCard.tsx
// One product tile: its own photo (zooms slightly on hover), name and price.

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import PlaceholderImage from "./PlaceholderImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <div className="transition-transform duration-700 ease-out group-hover:scale-105">
          <PlaceholderImage src={`/images/products/${product.slug}.jpg`} label={product.name} />
        </div>

        {(product.isNew || product.isSale) && (
          <div className="absolute left-3 top-3 flex gap-2">
            {product.isNew && (
              <span className="bg-offwhite px-2 py-1 text-[10px] uppercase tracking-[0.15em]">New</span>
            )}
            {product.isSale && (
              <span className="bg-sage-dark px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white">Sale</span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-light transition-colors group-hover:text-sage-dark">{product.name}</h3>
        <p className="text-sm text-muted">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}