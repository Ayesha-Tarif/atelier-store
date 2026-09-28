// components/MobileMenu.tsx
// The slide-in menu shown on phones. It closes when you tap a link
// or tap the dark area outside it.

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { siteConfig } from "@/config/site";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Stop the page behind from scrolling while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 md:hidden ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Dark background: tap to close */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* The white panel */}
      <div
        className={`absolute left-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-r border-line bg-white px-6 py-5 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-light tracking-[0.35em]">
            {siteConfig.name}
          </span>
          <button onClick={onClose} aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        <nav className="mt-10 flex flex-col">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="border-b border-line py-4 text-sm font-light uppercase tracking-[0.2em]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-4 text-xs uppercase tracking-[0.18em] text-muted">
          {siteConfig.footerLinks.company.map((link) => (
            <Link key={link.label} href={link.href} onClick={onClose}>
              {link.label}
            </Link>
          ))}
          <Link href="/cart" onClick={onClose}>
            Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
