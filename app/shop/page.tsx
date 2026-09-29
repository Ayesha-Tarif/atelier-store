// app/shop/page.tsx
import type { Metadata } from "next";
import { getAllProducts } from "@/data/products";
import ShopClient, { type ShopView } from "@/components/ShopClient";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>;
}) {
  const { category, filter } = await searchParams;
  const products = await getAllProducts();

  let view: ShopView = "all";
  if (category === "women" || category === "men") view = category;
  else if (filter === "new" || filter === "sale") view = filter;

  return <ShopClient key={view} products={products} initialView={view} />;
}