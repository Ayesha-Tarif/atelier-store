"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const BUCKET = "product-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ProductFormState = { error: string };

// "Linen Kurta (Men)" -> "linen-kurta-men"
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Read and check everything the shopkeeper typed in the form.
function readProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const price = Number(formData.get("price"));
  const description = String(formData.get("description") ?? "").trim();
  const chosenSizes = formData.getAll("sizes").map(String);
  const sizes = ALL_SIZES.filter((s) => chosenSizes.includes(s)); // keep XS..XXL order
  const isNew = formData.get("is_new") === "on";
  const isSale = formData.get("is_sale") === "on";

  if (!name) return { error: "Please enter the product name." };
  if (category !== "women" && category !== "men") return { error: "Please choose a category." };
  if (!Number.isInteger(price) || price <= 0) return { error: "Price must be a whole number above 0." };
  if (sizes.length === 0) return { error: "Please choose at least one size." };
  if (!description) return { error: "Please enter a description." };

  return { values: { name, category, price, description, sizes, isNew, isSale } };
}

// Upload the photo to Supabase Storage and return its public address.
async function uploadImage(file: File, slug: string): Promise<{ url?: string; error?: string }> {
  const extension = IMAGE_TYPES[file.type];
  if (!extension) return { error: "Photo must be a JPG, PNG or WEBP image." };
  if (file.size > MAX_IMAGE_BYTES) return { error: "Photo is too big. Maximum size is 5 MB." };

  const path = `${slug}-${Date.now()}.${extension}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type });
  if (error) return { error: `Photo upload failed: ${error.message}` };

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

// Make the next free id: p12 exists -> p13
async function nextProductId(): Promise<string> {
  const { data } = await supabaseAdmin.from("products").select("id");
  const numbers = (data ?? []).map((row) => parseInt(String(row.id).replace(/\D/g, ""), 10) || 0);
  return `p${Math.max(0, ...numbers) + 1}`;
}

// Tell the website to show the fresh data.
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = readProductForm(formData);
  if ("error" in parsed) return { error: parsed.error as string };
  const v = parsed.values!;

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return { error: "Please choose a photo for the product." };
  }

  // Make a web address name from the product name; avoid duplicates.
  let slug = slugify(v.name);
  if (!slug) return { error: "Product name must contain letters or numbers." };
  const { data: existing } = await supabaseAdmin.from("products").select("id").eq("slug", slug);
  if (existing && existing.length > 0) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const upload = await uploadImage(image, slug);
  if (upload.error) return { error: upload.error };

  const id = await nextProductId();
  const { error } = await supabaseAdmin.from("products").insert({
    id,
    slug,
    name: v.name,
    category: v.category,
    price: v.price,
    sizes: v.sizes,
    description: v.description,
    is_new: v.isNew,
    is_sale: v.isSale,
    image_url: upload.url,
  });
  if (error) return { error: `Could not save the product: ${error.message}` };

  refreshSite();
  redirect("/admin/products");
}


export async function updateProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Product id is missing." };

  const parsed = readProductForm(formData);
  if ("error" in parsed) return { error: parsed.error as string };
  const v = parsed.values!;

  const { data: current } = await supabaseAdmin
    .from("products")
    .select("slug, image_url")
    .eq("id", id)
    .single();
  if (!current) return { error: "Product not found." };

  // Keep the old photo unless a new one was chosen.
  let imageUrl: string | null = current.image_url;
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const upload = await uploadImage(image, current.slug);
    if (upload.error) return { error: upload.error };
    imageUrl = upload.url ?? imageUrl;
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update({
      name: v.name,
      category: v.category,
      price: v.price,
      sizes: v.sizes,
      description: v.description,
      is_new: v.isNew,
      is_sale: v.isSale,
      image_url: imageUrl,
    })
    .eq("id", id);
  if (error) return { error: `Could not save the product: ${error.message}` };

  refreshSite();
  redirect("/admin/products");
}


export async function deleteProductAction(id: string): Promise<void> {
  await requireAdmin();
  if (!id) return;

  // Remember the photo address so we can remove the photo too.
  const { data: current } = await supabaseAdmin
    .from("products")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(`Could not delete the product: ${error.message}`);

  // Photos uploaded from the admin live in Supabase Storage. Remove that file.
  const url: string | null = current?.image_url ?? null;
  const marker = `/${BUCKET}/`;
  if (url && url.includes(marker)) {
    const path = url.split(marker)[1];
    if (path) await supabaseAdmin.storage.from(BUCKET).remove([path]);
  }

  refreshSite();
}