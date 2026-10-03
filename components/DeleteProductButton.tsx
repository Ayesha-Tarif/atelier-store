"use client";

import { useTransition } from "react";
import { deleteProductAction } from "@/app/admin/products/actions";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteProductAction(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-[11px] uppercase tracking-[0.2em] text-[#8a3b3b] hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}