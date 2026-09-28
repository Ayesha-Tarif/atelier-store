// components/Newsletter.tsx
// Email signup box in soft sage green. Only checks the email format for now.

"use client";

import { useState, type FormEvent } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="container-page py-16 md:py-24">
      <div className="border border-line bg-sage-light px-6 py-14 text-center md:px-16">
        <h2 className="text-2xl font-light tracking-tight md:text-3xl">Join our newsletter</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-charcoal">
          Be the first to hear about new arrivals and offers.
        </p>

        {status === "success" ? (
          <p className="mt-8 text-sm">Thank you. You are on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              placeholder="Your email address"
              aria-label="Email address"
              aria-invalid={status === "error" ? true : undefined}
              className="field-input flex-1"
            />
            <button type="submit" className="bg-ink px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-sage-dark">
              Subscribe
            </button>
          </form>
        )}

        {status === "error" && <p className="mt-3 text-xs text-[#8a3b3b]">Please enter a valid email address.</p>}
      </div>
    </section>
  );
}