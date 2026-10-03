import type { Metadata } from "next";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AdminHeader from "@/components/AdminHeader";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const label =
  "inline-block bg-offwhite px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [products, orders] = await Promise.all([
    supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("*", { count: "exact", head: true }),
  ]);

  const failed = products.error || orders.error;

  return (
    <>
      <AdminHeader />
      <div className="container-page py-10">
        <h1 className="mb-8 text-3xl font-light tracking-tight">Dashboard</h1>

        {failed ? (
          <p className="text-sm text-[#8a3b3b]">
            Could not reach the database. Check SUPABASE_SERVICE_ROLE_KEY in .env.local.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-ink p-6 text-white">
              <span className={label}>Products</span>
              <p className="mt-5 text-5xl font-light">{products.count}</p>
            </div>
            <div className="bg-ink p-6 text-white">
              <span className={label}>Orders</span>
              <p className="mt-5 text-5xl font-light">{orders.count}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}