// data/products.ts
// Fetches products from the Supabase database instead of a local list.

import { supabase } from "@/lib/supabase";
import type { Product, Category, Size } from "@/types/product";

// Supabase gives us snake_case column names (is_new, is_sale).
// This turns one database row into the shape our components expect.
function mapRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as Category,
    price: row.price,
    sizes: row.sizes as Size[],
    description: row.description,
    isNew: row.is_new,
    isSale: row.is_sale,
  };
}

// Get every product. Used by the shop page and the home page.
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error || !data) return [];
  return data.map(mapRow);
}

// Find one product by its slug. Used by the product page.
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error || !data) return undefined;
  return mapRow(data);
}

// A few other products for "You may also like": same category first, then others.
export async function getRelatedProducts(current: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const sameCategory = all.filter((p) => p.category === current.category && p.id !== current.id);
  const others = all.filter((p) => p.category !== current.category && p.id !== current.id);
  return [...sameCategory, ...others].slice(0, limit);
}