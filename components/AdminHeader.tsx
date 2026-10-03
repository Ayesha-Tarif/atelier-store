"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { logoutAction } from "@/app/admin/login/actions";

const links = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
];

const boxBase =
  "px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors";

export default function AdminHeader() {
  const pathname = usePathname();

  // Dashboard is active only on /admin itself.
  // Products and Orders stay active on their inner pages too (add, edit).
  function isActive(href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <header className="bg-ink text-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-sm uppercase tracking-[0.3em]">{siteConfig.name} Admin</span>
          <nav className="flex flex-wrap gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${boxBase} ${
                  isActive(link.href) ? "bg-beige" : "bg-offwhite hover:bg-beige"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="border border-white/60 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/15"
          >
            View site
          </Link>
          <form action={logoutAction}>
            <button className={`${boxBase} bg-offwhite hover:bg-beige`}>Log out</button>
          </form>
        </div>
      </div>
    </header>
  );
}