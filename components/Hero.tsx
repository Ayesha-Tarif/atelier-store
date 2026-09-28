// components/Hero.tsx
// Split banner: text on a beige panel, photo on the right.

import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-line bg-offwhite">
      <div className="grid md:grid-cols-2">
        <div className="order-2 flex items-center px-6 py-14 md:order-1 md:px-16 md:py-0 lg:px-24">
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.3em] text-sage-dark">New Season</p>
            <h1 className="mt-4 text-4xl font-light leading-tight tracking-tight md:text-6xl">
              Quiet clothing for everyday life.
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-charcoal">
              Considered pieces in soft fabrics, made for the way you really live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-sage-dark">
                Shop Now
              </Link>
              <Link href="/shop?filter=new" className="border border-ink px-9 py-4 text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-sage-light">
                New In
              </Link>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <img
            src="/images/products/linen-blend-kurta-men.jpg"
            alt="New season collection"
            className="h-[55vh] w-full object-cover object-top md:h-[80vh]"
          />
        </div>
      </div>
    </section>
  );
}