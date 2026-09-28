// app/contact/page.tsx
// A simple Contact page. Details come from config/site.ts.

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const { email, phone, address, hours } = siteConfig.contact;

  return (
    <div className="container-page py-12 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
          Contact
        </p>
        <h1 className="mt-4 text-3xl font-light tracking-tight md:text-5xl">
          We would love to hear from you
        </h1>
        <p className="mt-5 text-sm text-charcoal">
          Questions about an order, sizes or delivery? Get in touch and we will
          reply as soon as we can.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl gap-px border border-line bg-line md:grid-cols-2">
        <div className="bg-white p-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">Email</h2>
          <a href={`mailto:${email}`} className="link-underline mt-3 inline-block text-sm text-charcoal">
            {email}
          </a>
        </div>

        <div className="bg-white p-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">Phone</h2>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="link-underline mt-3 inline-block text-sm text-charcoal">
            {phone}
          </a>
        </div>

        <div className="bg-white p-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">Address</h2>
          <p className="mt-3 text-sm text-charcoal">{address}</p>
        </div>

        <div className="bg-white p-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.2em]">Opening hours</h2>
          <p className="mt-3 text-sm text-charcoal">{hours}</p>
        </div>
      </div>
    </div>
  );
}