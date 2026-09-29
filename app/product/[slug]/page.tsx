// app/product/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/data/products";
import ProductDetails from "@/components/ProductDetails";
import ProductGrid from "@/components/ProductGrid";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="container-page py-8 md:py-12">
      <nav className="mb-8 text-xs text-muted">
        <Link href="/" className="link-underline hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category}`} className="link-underline capitalize hover:text-ink">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductDetails product={product} />

      <section className="mt-24 border-t border-line pt-16">
        <h2 className="mb-10 text-2xl font-light tracking-tight">You may also like</h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}