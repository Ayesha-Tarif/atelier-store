// app/shop/page.tsx
// The shop page. It reads the URL (?category=women or ?filter=sale)
// and tells ShopClient which group to show first.

import type { Metadata } from "next";
import { products } from "@/data/products";
import ShopClient, { type ShopView } from "@/components/ShopClient";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>;
}) {
  const { category, filter } = await searchParams;

  let view: ShopView = "all";
  if (category === "women" || category === "men") view = category;
  else if (filter === "new" || filter === "sale") view = filter;

  // "key" makes the filters reset when the URL changes (e.g. clicking Men in the navbar).
  return <ShopClient key={view} products={products} initialView={view} />;
}