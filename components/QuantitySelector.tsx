// components/QuantitySelector.tsx
// A  [ - 1 + ]  control. Used on the product page and in the cart.

"use client";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
}: {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="h-9 w-9 text-lg font-light transition-colors hover:bg-offwhite disabled:text-muted/40"
      >
        −
      </button>
      <span className="w-10 text-center text-sm">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="h-9 w-9 text-lg font-light transition-colors hover:bg-offwhite disabled:text-muted/40"
      >
        +
      </button>
    </div>
  );
}