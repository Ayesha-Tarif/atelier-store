import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatPrice } from "@/lib/utils";
import AdminHeader from "@/components/AdminHeader";
import DeleteProductButton from "@/components/DeleteProductButton";

export const metadata: Metadata = {
  title: "Admin | Products",
  robots: { index: false, follow: false },
};

const columns = ["Name", "Category", "Price", "Sizes", "Badges", "Actions"];

export default async function AdminProductsPage() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("name");

  const products = data ?? [];

  return (
    <>
      <AdminHeader />
      <div className="container-page py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Products</h1>
            <p className="mt-2 text-sm text-muted">{products.length} products in your store</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
          >
            Add product
          </Link>
        </div>

        {error && (
          <p className="mb-6 text-sm text-[#8a3b3b]">Could not load products: {error.message}</p>
        )}

        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink text-[11px] uppercase tracking-[0.15em] text-white">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-4 font-normal">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-line transition-colors hover:bg-sage-light"
                >
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{(p.sizes as string[]).join(", ")}</td>
                  <td className="px-4 py-3">
                    {p.is_new && (
                      <span className="mr-2 border border-line bg-offwhite px-2 py-1 text-[10px] uppercase tracking-[0.15em]">
                        New
                      </span>
                    )}
                    {p.is_sale && (
                      <span className="bg-sage-dark px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white">
                        Sale
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-5">
                      <Link
                        href={`/admin/products/edit?id=${p.id}`}
                        className="link-underline text-[11px] uppercase tracking-[0.2em]"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}