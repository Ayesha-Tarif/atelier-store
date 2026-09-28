// lib/utils.ts
// ------------------------------------------------------------
// Small helper functions used all over the website.
// Keeping them here means we write each calculation only once.
// ------------------------------------------------------------

import { siteConfig } from "@/config/site";
import type { CartItem } from "@/types/product";

// Turns a number into a price text.  6800  ->  "PKR 6,800"
// We add the commas ourselves so the server and browser always
// show exactly the same text (avoids display mismatch errors).
export function formatPrice(amount: number): string {
  const withCommas = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${siteConfig.currency} ${withCommas}`;
}

// Adds up price x quantity for every item in the cart.
export function getSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Delivery rule: free at or above the threshold (PKR 5,000),
// otherwise a fixed charge (PKR 250).
// An empty cart has no delivery charge.
export function getDeliveryCharge(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= siteConfig.freeDeliveryThreshold
    ? 0
    : siteConfig.deliveryCharge;
}

// Subtotal + delivery = the final amount the customer pays.
export function getTotal(subtotal: number, delivery: number): number {
  return subtotal + delivery;
}

// Total number of pieces in the cart (shown as the small badge on the bag icon).
export function getItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

// Creates a random order number like "AT-482913".
export function generateOrderNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `AT-${digits}`;
}