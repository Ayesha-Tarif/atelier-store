// data/products.ts
// ------------------------------------------------------------
// Our "fake database": a simple list of 12 products.
// Later, if you connect a real database, only this file changes.
// The rest of the website keeps working the same way.
// ------------------------------------------------------------

import type { Product } from "@/types/product";
// "@/" is a shortcut for the project root folder (set up by Next.js).

export const products: Product[] = [
  // ===================== WOMEN =====================
  {
    id: "p1",
    slug: "embroidered-lawn-suit",
    name: "Embroidered Lawn Suit",
    category: "women",
    price: 6800,
    sizes: ["S", "M", "L", "XL"],
    description:
      "A light three-piece lawn suit with fine thread embroidery on the neckline and sleeves. Soft, breathable fabric made for warm days. Comes with a matching trouser and a printed dupatta.",
    isNew: true,
    isSale: false,
  },
  {
    id: "p2",
    slug: "everyday-cotton-kurta-women",
    name: "Everyday Cotton Kurta",
    category: "women",
    price: 3200,
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A straight-cut kurta in soft combed cotton with a simple round neck and side slits. Easy to wear with trousers or a shalwar, and comfortable for the whole day.",
    isNew: false,
    isSale: false,
  },
  {
    id: "p3",
    slug: "relaxed-linen-shirt",
    name: "Relaxed Linen Shirt",
    category: "women",
    price: 3900,
    sizes: ["XS", "S", "M", "L"],
    description:
      "A relaxed-fit shirt in a breathable linen blend with a clean collar and mother-of-pearl style buttons. Roll the sleeves up or wear them long.",
    isNew: true,
    isSale: false,
  },
  {
    id: "p4",
    slug: "wide-leg-trousers",
    name: "Wide-Leg Trousers",
    category: "women",
    price: 4200,
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "High-waisted trousers with a wide, flowing leg and a hidden side zip. Cut from a smooth, lightweight fabric that drapes well and does not crease easily.",
    isNew: false,
    isSale: true,
  },
  {
    id: "p5",
    slug: "printed-lawn-two-piece",
    name: "Printed Lawn Two-Piece",
    category: "women",
    price: 4800,
    sizes: ["S", "M", "L", "XL"],
    description:
      "A two-piece set with a softly printed lawn shirt and matching trouser. A quiet, muted print that works for university, office or family visits.",
    isNew: false,
    isSale: true,
  },
  {
    id: "p6",
    slug: "pleated-cotton-tunic",
    name: "Pleated Cotton Tunic",
    category: "women",
    price: 3500,
    sizes: ["XS", "S", "M", "L"],
    description:
      "A loose tunic with fine pleats at the front and a gently curved hem. Made from crisp cotton that keeps its shape after washing.",
    isNew: true,
    isSale: false,
  },
  {
    id: "p7",
    slug: "cambric-straight-pants",
    name: "Cambric Straight Pants",
    category: "women",
    price: 2400,
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Simple straight-leg pants in soft cambric with an elastic back waist. A wardrobe basic that pairs with almost every kurta or shirt.",
    isNew: false,
    isSale: false,
  },

  // ======================= MEN =======================
  {
    id: "p8",
    slug: "classic-cotton-kurta-men",
    name: "Classic Cotton Kurta",
    category: "men",
    price: 4500,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A tailored kurta in premium cotton with a band collar and a three-button placket. Clean lines, no decoration, easy to dress up for Friday prayers or events.",
    isNew: true,
    isSale: false,
  },
  {
    id: "p9",
    slug: "wash-and-wear-shalwar-kameez",
    name: "Wash & Wear Shalwar Kameez",
    category: "men",
    price: 5800,
    sizes: ["M", "L", "XL", "XXL"],
    description:
      "A two-piece shalwar kameez in a durable wash-and-wear blend. Stays smooth through the day and needs very little ironing.",
    isNew: false,
    isSale: false,
  },
  {
    id: "p10",
    slug: "oxford-button-down-shirt",
    name: "Oxford Button-Down Shirt",
    category: "men",
    price: 4200,
    sizes: ["S", "M", "L", "XL"],
    description:
      "A regular-fit Oxford shirt with a button-down collar and a soft brushed feel. A dependable everyday shirt in a neutral shade.",
    isNew: false,
    isSale: true,
  },
  {
    id: "p11",
    slug: "slim-fit-chino-trousers",
    name: "Slim-Fit Chino Trousers",
    category: "men",
    price: 4900,
    sizes: ["S", "M", "L", "XL"],
    description:
      "Slim-fit chinos in stretch cotton twill with a mid rise and clean finish. Comfortable enough for long days, sharp enough for work.",
    isNew: true,
    isSale: false,
  },
  {
    id: "p12",
    slug: "linen-blend-kurta-men",
    name: "Linen Blend Kurta",
    category: "men",
    price: 5200,
    sizes: ["M", "L", "XL", "XXL"],
    description:
      "A light linen-blend kurta with a subtle natural texture and side pockets. Cool in summer and easy to pair with white or grey shalwar.",
    isNew: false,
    isSale: true,
  },
];

// ------------------------------------------------------------
// Small helper functions. Pages use these to find products.
// ------------------------------------------------------------

// Find one product by its slug (used on the product page).
// Returns undefined if no product matches.
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

// Get a few other products for the "You may also like" row.
// It prefers products from the same category and skips the current one.
export function getRelatedProducts(current: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.category === current.category && p.id !== current.id
  );
  const others = products.filter(
    (p) => p.category !== current.category && p.id !== current.id
  );
  return [...sameCategory, ...others].slice(0, limit);
}