import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminHeader from "@/components/AdminHeader";
import ProductForm from "@/components/ProductForm";
import type { Product } from "@/types/product";
import { updateProductAction } from "../actions";

export const metadata: Metadata = {
  title: "Admin | Edit product",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  await requireAdmin();

  const { id } = await searchParams;
  if (!id) notFound();

  const { data } = await supabaseAdmin.from("products").select("*").eq("id", id).single();
  if (!data) notFound();

  const product: Product = {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    price: data.price,
    sizes: data.sizes,
    description: data.description,
    isNew: data.is_new,
    isSale: data.is_sale,
    // old products use the photo from the public folder
    imageUrl: data.image_url ?? `/images/products/${data.slug}.jpg`,
  };

  return (
    <>
      <AdminHeader />
      <div className="container-page py-10">
        <Link href="/admin/products" className="link-underline text-xs text-muted">
          &larr; Back to products
        </Link>
        <h1 className="mb-8 mt-4 text-3xl font-light tracking-tight">Edit product</h1>
        <ProductForm action={updateProductAction} submitLabel="Save changes" initial={product} />
      </div>
    </>
  );
}