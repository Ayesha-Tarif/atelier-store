// lib/adminAuth.ts
// Simple admin login. After a correct username/password we give the
// browser a signed cookie. Every admin page checks that cookie.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "atelier-admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // login lasts 8 hours

function sign(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is missing in .env.local");
  return createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Is the typed username/password correct?
export function checkCredentials(username: string, password: string): boolean {
  const realUser = process.env.ADMIN_USERNAME ?? "";
  const realPass = process.env.ADMIN_PASSWORD ?? "";
  if (!realUser || !realPass) return false;
  const userOk = safeEqual(username, realUser);
  const passOk = safeEqual(password, realPass);
  return userOk && passOk;
}

// Give the browser a login cookie.
export async function createAdminSession(): Promise<void> {
  const expires = String(Date.now() + MAX_AGE_SECONDS * 1000);
  const token = `${expires}.${sign(expires)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

// Is the visitor logged in as admin?
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

// Put this at the top of every admin page. Not logged in = sent to login.
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}