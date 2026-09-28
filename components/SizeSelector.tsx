// components/SizeSelector.tsx
// Row of size buttons. The chosen size turns black.

"use client";

import type { Size } from "@/types/product";

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: Size[];
  selected: Size | null;
  onSelect: (size: Size) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = size === selected;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            aria-pressed={isSelected}
            className={`h-11 min-w-12 border px-3 text-xs uppercase tracking-widest transition-colors ${
              isSelected
                ? "border-ink bg-ink text-white"
                : "border-line bg-white hover:border-ink"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}