import type { Metadata } from "next";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatPrice } from "@/lib/utils";
import AdminHeader from "@/components/AdminHeader";

export const metadata: Metadata = {
  title: "Admin | Orders",
  robots: { index: false, follow: false },
};

type OrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    timeZone: "Asia/Karachi",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminOrdersPage() {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = data ?? [];

  return (
    <>
      <AdminHeader />
      <div className="container-page py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight">Orders</h1>
          <p className="mt-2 text-sm text-muted">
            {orders.length} {orders.length === 1 ? "order" : "orders"} (newest first)
          </p>
        </div>

        {error && (
          <p className="mb-6 text-sm text-[#8a3b3b]">Could not load orders: {error.message}</p>
        )}

        {orders.length === 0 && !error && (
          <p className="text-sm text-muted">No orders yet.</p>
        )}

        <div className="space-y-6">
          {orders.map((order) => {
            const items = (order.items ?? []) as OrderItem[];
            return (
              <div key={order.id} className="border border-line">
                <div className="flex flex-wrap items-center justify-between gap-3 bg-ink px-5 py-4 text-white">
                  <div>
                    <span className="inline-block bg-offwhite px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink">
                      {order.order_number}
                    </span>
                    <p className="mt-2 text-xs text-white/80">{formatDate(order.created_at)}</p>
                  </div>
                  <span className="inline-block bg-offwhite px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <div className="grid gap-6 px-5 py-5 md:grid-cols-2">
                  <div className="space-y-1 text-sm">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted">Customer</p>
                    <p>{order.customer_name}</p>
                    <p>
                      <a href={`tel:${order.phone}`} className="link-underline">
                        {order.phone}
                      </a>
                    </p>
                    <p>{order.email}</p>
                    <p>
                      {order.address}, {order.city}
                    </p>
                    {order.notes && (
                      <p className="pt-2 text-muted">
                        <span className="text-ink">Notes:</span> {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-sm">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-muted">Items</p>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="flex justify-between gap-4">
                          <span>
                            {item.name}
                            <span className="text-muted">
                              {" "}
                              (Size {item.size}) x {item.quantity}
                            </span>
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 space-y-1 border-t border-line pt-3 text-muted">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery</span>
                        <span>{order.delivery === 0 ? "Free" : formatPrice(order.delivery)}</span>
                      </div>
                      <div className="flex justify-between text-ink">
                        <span>Total ({order.payment_method})</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}