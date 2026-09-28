// components/Footer.tsx
// Bottom section of every page: brand, link columns, contact details.

import Link from "next/link";
import { siteConfig } from "@/config/site";

// A small reusable column of links.
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.2em]">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-muted">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="link-underline hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-offwhite">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div>
          <p className="text-lg font-light tracking-[0.35em]">
            {siteConfig.name}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {siteConfig.tagline}
          </p>
        </div>

        <FooterColumn title="Shop" links={siteConfig.footerLinks.shop} />
        <FooterColumn title="Company" links={siteConfig.footerLinks.company} />

        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.2em]">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li>{siteConfig.contact.email}</li>
            <li>{siteConfig.contact.phone}</li>
            <li className="flex gap-4 pt-1">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ink">
                Instagram
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ink">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Cash on Delivery available across Pakistan</p>
        </div>
      </div>
    </footer>
  );
}