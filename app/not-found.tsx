// app/not-found.tsx
// Shown when a page or product does not exist (404).

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-28 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-muted">404</p>
      <h1 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-sm text-charcoal">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal"
      >
        Go to shop
      </Link>
    </div>
  );
}