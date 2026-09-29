// components/CheckoutForm.tsx
// The checkout form with validation. It checks every field and shows
// a clear message under each wrong one. Payment: Cash on Delivery only.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import type { CheckoutDetails, Order } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { saveLastOrder } from "@/lib/orderStorage";
import { supabase } from "@/lib/supabase";
import OrderSummary from "./OrderSummary";

type FormErrors = Partial<Record<keyof CheckoutDetails, string>>;

const EMPTY_FORM: CheckoutDetails = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
};

// Checks all fields and returns an object of error messages.
// An empty object means everything is valid.
function validate(values: CheckoutDetails): FormErrors {
  const errors: FormErrors = {};

  const name = values.fullName.trim();
  if (!name) errors.fullName = "Please enter your full name.";
  else if (name.length < 3)
    errors.fullName = "Name must be at least 3 characters.";
  else if (!/^[A-Za-z\u0600-\u06FF .'-]+$/.test(name))
    errors.fullName = "Name can only contain letters and spaces.";

  // Pakistani mobile: 03001234567, +923001234567, 923001234567
  const phone = values.phone.replace(/[\s-]/g, "");
  if (!phone) errors.phone = "Please enter your phone number.";
  else if (!/^(\+92|0092|92|0)?3\d{9}$/.test(phone))
    errors.phone = "Enter a valid mobile number, e.g. 0300 1234567.";

  const email = values.email.trim();
  if (!email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = "Enter a valid email, e.g. name@example.com.";

  const city = values.city.trim();
  if (!city) errors.city = "Please enter your city.";
  else if (city.length < 2) errors.city = "City name is too short.";

  const address = values.address.trim();
  if (!address) errors.address = "Please enter your full address.";
  else if (address.length < 10)
    errors.address = "Please add more detail (house no., street, area).";

  if (values.notes.length > 300)
    errors.notes = "Notes can be at most 300 characters.";

  return errors;
}

// A small wrapper: label + input + error message.
function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[11px] uppercase tracking-[0.15em]"
      >
        {label}
        {optional && (
          <span className="normal-case tracking-normal text-muted">
            {" "}
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-[#8a3b3b]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const { items, isHydrated, subtotal, delivery, total, clearCart } = useCart();

  const [values, setValues] = useState<CheckoutDetails>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [placed, setPlaced] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Update a field while typing. If it already had an error, re-check it.
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const name = e.target.name as keyof CheckoutDetails;
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(next)[name] }));
    }
  }

  // Check a single field when the user leaves it.
  function handleBlur(
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const name = e.target.name as keyof CheckoutDetails;
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // stop if anything is wrong

    // Build the order and save it for the success page.
    const order: Order = {
      orderNumber: generateOrderNumber(),
      items,
      subtotal,
      delivery,
      total,
      customer: {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        city: values.city.trim(),
        address: values.address.trim(),
        notes: values.notes.trim(),
      },
      paymentMethod: "Cash on Delivery",
      createdAt: new Date().toLocaleString("en-GB"),
    };

    // Save the order in the Supabase database.
    const { error } = await supabase.from("orders").insert({
      order_number: order.orderNumber,
      customer_name: order.customer.fullName,
      phone: order.customer.phone,
      email: order.customer.email,
      city: order.customer.city,
      address: order.customer.address,
      notes: order.customer.notes || null,
      items: order.items,
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      payment_method: order.paymentMethod,
    });

    if (error) {
      // If saving to the database fails, tell the person instead of
      // silently moving on, so the order isn't lost without them knowing.
      setSubmitError("Something went wrong placing your order. Please try again.");
      return;
    }

    saveLastOrder(order);
    setPlaced(true);
    router.push("/order-success");
    clearCart();
  }

  // Wait until the saved cart is loaded.
  if (!isHydrated) return <div className="min-h-[50vh]" />;

  if (placed) {
    return <p className="py-24 text-center text-sm text-muted">Placing your order...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-muted">Your cart is empty.</p>
        <Link
          href="/shop"
          className="link-underline mt-5 inline-block text-[11px] uppercase tracking-[0.2em]"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
      {/* LEFT: the form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">
          Delivery details
        </h2>

        <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="field-input"
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Phone" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="0300 1234567"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className="field-input"
            />
          </Field>

          <Field label="Email" htmlFor="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="field-input"
            />
          </Field>
        </div>

        <Field label="City" htmlFor="city" error={errors.city}>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.city ? true : undefined}
            aria-describedby={errors.city ? "city-error" : undefined}
            className="field-input"
          />
        </Field>

        <Field label="Full address" htmlFor="address" error={errors.address}>
          <textarea
            id="address"
            name="address"
            rows={3}
            autoComplete="street-address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.address ? true : undefined}
            aria-describedby={errors.address ? "address-error" : undefined}
            className="field-input"
          />
        </Field>

        <Field label="Order notes" htmlFor="notes" error={errors.notes} optional>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={values.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={errors.notes ? "notes-error" : undefined}
            className="field-input"
          />
        </Field>

        {/* Payment: only Cash on Delivery */}
        <div>
          <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em]">
            Payment
          </h2>
          <div className="flex items-start gap-3 border border-ink p-4">
            <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-ink">
              <span className="h-2 w-2 rounded-full bg-ink" />
            </span>
            <div>
              <p className="text-sm">Cash on Delivery</p>
              <p className="mt-1 text-xs text-muted">
                Pay in cash when your order arrives.
              </p>
            </div>
          </div>
        </div>

        {submitError && (
          <p className="text-xs text-[#8a3b3b]">{submitError}</p>
        )}

        {hasErrors && (
          <p className="text-xs text-[#8a3b3b]">
            Please fix the highlighted fields and try again.
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-ink py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
        >
          Place Order
        </button>
      </form>

      {/* RIGHT: order summary */}
      <aside className="h-fit border border-line bg-offwhite p-6 md:p-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">
          Your order
        </h2>
        <ul className="mt-5 divide-y divide-line">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.size}`}
              className="flex justify-between gap-4 py-3 text-sm"
            >
              <div>
                <p className="font-light">{item.name}</p>
                <p className="mt-1 text-xs text-muted">
                  Size {item.size} × {item.quantity}
                </p>
              </div>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-line pt-5">
          <OrderSummary subtotal={subtotal} delivery={delivery} total={total} />
        </div>
      </aside>
    </div>
  );
}