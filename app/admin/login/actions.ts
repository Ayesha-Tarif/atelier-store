"use server";

import { redirect } from "next/navigation";
import {
  checkCredentials,
  createAdminSession,
  destroyAdminSession,
} from "@/lib/adminAuth";

export async function loginAction(
  _prev: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(username, password)) {
    return { error: "Wrong username or password." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}