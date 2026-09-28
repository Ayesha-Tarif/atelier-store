// app/page.tsx
// The home page. It is built from the components we made.

import Link from "next/link";
import { products } from "@/data/products";
import Hero from "@/components/Hero";
import CategoryTiles from "@/components/CategoryTiles";
import ProductGrid from "@/components/ProductGrid";
import BrandStory from "@/components/BrandStory";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  // Show the first 4 products that are marked as new.
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      <Hero />
      <CategoryTiles />

      <section className="container-page pb-16 md:pb-24">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-light tracking-tight md:text-3xl">
            New Arrivals
          </h2>
          <Link
            href="/shop?filter=new"
            className="link-underline text-[11px] uppercase tracking-[0.2em]"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      <BrandStory />
      <Newsletter />
    </>
  );
}