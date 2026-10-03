"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { Product } from "@/types/product";
import type { ProductFormState } from "@/app/admin/products/actions";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function ProductForm({
  action,
  submitLabel,
  initial,
}: {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
  initial?: Product;
}) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(initial?.imageUrl ?? null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    const image = formData.get("image");
    if (image instanceof File && image.size > MAX_IMAGE_BYTES) {
      setError("Photo is too big. Maximum size is 5 MB.");
      return;
    }

    startTransition(async () => {
      const result = await action({ error: "" }, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div>
        <label htmlFor="name" className="mb-2 block text-[11px] uppercase tracking-[0.15em]">
          Product name
        </label>
        <input id="name" name="name" type="text" required defaultValue={initial?.name} className="field-input" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-2 block text-[11px] uppercase tracking-[0.15em]">
            Category
          </label>
          <select id="category" name="category" required defaultValue={initial?.category ?? ""} className="field-input">
            <option value="" disabled>
              Choose...
            </option>
            <option value="women">Women</option>
            <option value="men">Men</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className="mb-2 block text-[11px] uppercase tracking-[0.15em]">
            Price (PKR)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={initial?.price}
            className="field-input"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-[0.15em]">Sizes available</p>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <label key={size} className="flex cursor-pointer items-center gap-2 border border-line bg-offwhite px-4 py-2 text-sm">
              <input
                type="checkbox"
                name="sizes"
                value={size}
                defaultChecked={initial?.sizes.includes(size as never)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-[11px] uppercase tracking-[0.15em]">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          defaultValue={initial?.description}
          className="field-input"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" name="is_new" defaultChecked={initial?.isNew} />
          Show "New" badge
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" name="is_sale" defaultChecked={initial?.isSale} />
          Show "Sale" badge
        </label>
      </div>

      <div>
        <label htmlFor="image" className="mb-2 block text-[11px] uppercase tracking-[0.15em]">
          Product photo {initial ? "(leave empty to keep the current photo)" : ""}
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!initial}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="block w-full text-sm"
        />
        <p className="mt-2 text-xs text-muted">JPG, PNG or WEBP, up to 5 MB. A portrait (tall) photo looks best.</p>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="mt-4 h-56 w-44 border border-line object-cover object-top" />
        )}
      </div>

      {error && <p className="text-sm text-[#8a3b3b]">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-charcoal disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}