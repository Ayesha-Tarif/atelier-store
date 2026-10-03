import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { isAdmin } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm border border-line bg-offwhite p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">{siteConfig.name}</p>
        <h1 className="mt-2 text-2xl font-light tracking-tight">Admin login</h1>
        <LoginForm />
      </div>
    </div>
  );
}