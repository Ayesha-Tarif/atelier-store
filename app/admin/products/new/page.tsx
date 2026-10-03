import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import AdminHeader from "@/components/AdminHeader";
import ProductForm from "@/components/ProductForm";
import { createProductAction } from "../actions";

export const metadata: Metadata = {
  title: "Admin | Add product",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <AdminHeader />
      <div className="container-page py-10">
        <Link href="/admin/products" className="link-underline text-xs text-muted">
          &larr; Back to products
        </Link>
        <h1 className="mb-8 mt-4 text-3xl font-light tracking-tight">Add product</h1>
        <ProductForm action={createProductAction} submitLabel="Save product" />
      </div>
    </>
  );
}