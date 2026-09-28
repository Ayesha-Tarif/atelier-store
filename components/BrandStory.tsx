// components/BrandStory.tsx
// A short "about us" section on the home page.

import Link from "next/link";
import { siteConfig } from "@/config/site";
import PlaceholderImage from "./PlaceholderImage";

export default function BrandStory() {
  return (
    <section className="border-y border-line bg-offwhite">
      <div className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:gap-20 md:py-24">
        <PlaceholderImage label="Our story" className="aspect-[4/5]" />

        <div className="max-w-md">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
            Our Story
          </p>
          <h2 className="mt-4 text-3xl font-light leading-snug tracking-tight md:text-4xl">
            Made with care, designed to last.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-charcoal">
            {siteConfig.name} began with a simple idea: clothing should be
            calm, comfortable and well made. We choose soft, breathable
            fabrics and clean cuts that suit Pakistani weather and everyday
            life, from lawn suits to easy kurtas and simple trousers.
          </p>
          <Link
            href="/about"
            className="link-underline mt-8 inline-block text-[11px] uppercase tracking-[0.2em]"
          >
            Read more
          </Link>
        </div>
      </div>
    </section>
  );
}