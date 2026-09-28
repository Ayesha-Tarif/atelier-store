// types/product.ts
// ------------------------------------------------------------
// TypeScript "types" describe the SHAPE of our data.
// They don't create anything on their own. They just tell
// TypeScript (and us) what fields an object must have.
// This catches mistakes early, e.g. a typo in a field name.
// ------------------------------------------------------------

// The only categories our store has.
// Using a fixed list means we can't accidentally write "womens" or "Man".
export type Category = "women" | "men";

// The sizes a product can come in.
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

// One product in the shop.
export interface Product {
  id: string; // unique id, e.g. "p1"
  slug: string; // URL-friendly name, e.g. "cotton-lawn-suit" -> /product/cotton-lawn-suit
  name: string; // display name
  category: Category; // "women" or "men"
  price: number; // price in PKR (a plain number, formatted later)
  sizes: Size[]; // which sizes are available
  description: string; // longer text shown on the product page
  isNew: boolean; // true = appears in "New In" / "New Arrivals"
  isSale: boolean; // true = appears in "Sale"
}

// One line inside the shopping cart.
// We don't copy the whole product. We store only what the cart needs.
export interface CartItem {
  productId: string; // links back to the product
  slug: string; // so the cart can link to the product page
  name: string;
  price: number;
  size: Size; // the size the customer chose
  quantity: number; // how many of that product in that size
}

// The details a customer types into the checkout form.
export interface CheckoutDetails {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string; // optional order notes
}

// A finished order. We save this so the success page can show it.
export interface Order {
  orderNumber: string; // e.g. "AT-482913"
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  customer: CheckoutDetails;
  paymentMethod: "Cash on Delivery";
  createdAt: string; // date/time as text
}