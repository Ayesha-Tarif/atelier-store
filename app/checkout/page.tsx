// app/checkout/page.tsx
// Checkout page. All the work happens inside CheckoutForm.

import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="mb-12 text-center text-3xl font-light tracking-tight md:text-4xl">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}