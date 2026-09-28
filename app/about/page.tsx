// app/about/page.tsx
// A simple About page. Edit the text to match your real brand.

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import PlaceholderImage from "@/components/PlaceholderImage";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-page py-12 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
          About us
        </p>
        <h1 className="mt-4 text-3xl font-light leading-snug tracking-tight md:text-5xl">
          Clothing that feels calm and looks considered.
        </h1>
      </div>

      <div className="mx-auto mt-14 max-w-4xl">
        <PlaceholderImage label="About" className="aspect-[16/9]" />
      </div>

      <div className="mx-auto mt-14 max-w-2xl space-y-6 text-sm leading-relaxed text-charcoal">
        <p>
          {siteConfig.name} is a Pakistani clothing brand for women and men.
          We design simple, well-made pieces such as lawn suits, kurtas, shirts
          and trousers that are easy to wear every day.
        </p>
        <p>
          We choose soft, breathable fabrics that suit our climate, and we keep
          the designs clean and quiet, with no loud prints or unnecessary
          decoration. Each piece is made to fit into your wardrobe and stay
          there for a long time.
        </p>
        <p>
          We deliver across Pakistan and offer Cash on Delivery, so you can
          order with confidence.
        </p>
      </div>
    </div>
  );
}