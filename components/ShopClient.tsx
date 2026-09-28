// components/ShopClient.tsx
// The shop page's filters: category, size, sort and search.
// It runs in the browser ("use client") because it reacts to clicks.

"use client";

import { useMemo, useState } from "react";
import type { Product, Size } from "@/types/product";
import ProductGrid from "./ProductGrid";

// "view" = which group of products to show.
export type ShopView = "all" | "women" | "men" | "new" | "sale";
type SortOption = "featured" | "price-asc" | "price-desc";

const VIEWS: { value: ShopView; label: string }[] = [
  { value: "all", label: "All" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "new", label: "New In" },
  { value: "sale", label: "Sale" },
];

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ShopClient({
  products,
  initialView,
}: {
  products: Product[];
  initialView: ShopView;
}) {
  const [view, setView] = useState<ShopView>(initialView);
  const [size, setSize] = useState<Size | "all">("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [search, setSearch] = useState("");

  // Recalculate the visible products only when a filter changes.
  const visible = useMemo(() => {
    const text = search.trim().toLowerCase();

    const filtered = products.filter((p) => {
      if ((view === "women" || view === "men") && p.category !== view)
        return false;
      if (view === "new" && !p.isNew) return false;
      if (view === "sale" && !p.isSale) return false;
      if (size !== "all" && !p.sizes.includes(size)) return false;
      if (text && !p.name.toLowerCase().includes(text)) return false;
      return true;
    });

    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, view, size, sort, search]);

  const hasFilters = view !== "all" || size !== "all" || search !== "";

  function clearFilters() {
    setView("all");
    setSize("all");
    setSearch("");
    setSort("featured");
  }

  const title = VIEWS.find((v) => v.value === view)?.label ?? "All";

  return (
    <div className="container-page py-12 md:py-16">
      {/* Page heading */}
      <div className="text-center">
        <h1 className="text-3xl font-light tracking-tight md:text-4xl">
          {view === "all" ? "Shop" : title}
        </h1>
        <p className="mt-2 text-sm text-muted">{visible.length} products</p>
      </div>

      {/* Filters */}
      <div className="mt-10 space-y-6 border-y border-line py-6">
        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          aria-label="Search products by name"
          className="field-input"
        />

        {/* Category buttons */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${
                view === v.value
                  ? "border-b border-ink text-ink"
                  : "border-b border-transparent text-muted hover:text-ink"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Size filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[11px] uppercase tracking-[0.18em] text-muted">
              Size
            </span>
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(size === s ? "all" : s)} // click again to remove
                aria-pressed={size === s}
                className={`h-9 min-w-10 border px-2 text-xs transition-colors ${
                  size === s
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="sort"
              className="text-[11px] uppercase tracking-[0.18em] text-muted"
            >
              Sort
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="border border-line bg-white px-3 py-2 text-xs outline-none focus:border-ink"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="link-underline text-[11px] uppercase tracking-[0.18em] text-muted hover:text-ink"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Products */}
      <div className="mt-10">
        <ProductGrid products={visible} />
      </div>
    </div>
  );
}