// components/CategoryTiles.tsx
// Four tiles: Women, Men, New In, Sale. Each uses one of your product photos.

import Link from "next/link";
import { siteConfig } from "@/config/site";

const TILE_PHOTOS = [
  "/images/products/embroidered-lawn-suit.jpg",
  "/images/products/wash-and-wear-shalwar-kameez.jpg",
  "/images/products/pleated-cotton-tunic.jpg",
  "/images/products/oxford-button-down-shirt.jpg",
];

export default function CategoryTiles() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {siteConfig.navLinks.map((link, index) => (
          <Link key={link.label} href={link.href} className="group relative block aspect-[4/5] overflow-hidden bg-placeholder">
            <img
              src={TILE_PHOTOS[index]}
              alt={link.label}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 bg-offwhite px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-ink transition-colors duration-300 group-hover:bg-sage-dark group-hover:text-white">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}