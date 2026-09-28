// components/PlaceholderImage.tsx
// Shows a photo from /public. If no src is given it shows a default brand photo.
// If a photo file is missing, the soft beige box stays visible instead.

"use client";

const FALLBACK = "/images/products/pleated-cotton-tunic.jpg";

export default function PlaceholderImage({
  label,
  className = "",
  src,
}: {
  label?: string;
  className?: string;
  src?: string;
}) {
  return (
    <div className={`relative aspect-[3/4] w-full overflow-hidden bg-placeholder ${className}`}>
      <img
        src={src ?? FALLBACK}
        alt={label ?? "Product photo"}
        className="h-full w-full object-cover object-top"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}