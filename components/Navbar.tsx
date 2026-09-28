// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { useCart } from "@/context/CartContext";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-offwhite">
      <div className="container-page grid h-16 grid-cols-3 items-center">
        <div className="flex items-center">
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="md:hidden">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {siteConfig.navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="link-underline text-[11px] uppercase tracking-[0.18em]">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="justify-self-center text-lg font-light tracking-[0.35em] md:text-xl">
          {siteConfig.name}
        </Link>

        <div className="flex items-center justify-end gap-5">
          <Link href="/shop" aria-label="Search products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Link>
          <button onClick={openCart} aria-label={`Open cart, ${itemCount} items`} className="relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 8h14l-1 12H6L5 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}