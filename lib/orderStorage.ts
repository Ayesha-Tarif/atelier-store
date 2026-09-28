// lib/orderStorage.ts
// ------------------------------------------------------------
// Saves the most recent order in the browser so that the
// /order-success page can show it after checkout.
//
// We use sessionStorage (not localStorage): it keeps the data
// while the tab is open and clears it when the tab is closed.
// That is enough for a confirmation page.
// ------------------------------------------------------------

import type { Order } from "@/types/product";

// The name (key) under which the order is stored in the browser.
const STORAGE_KEY = "atelier-last-order";

// Save an order. Called by the checkout form after a successful submit.
export function saveLastOrder(order: Order): void {
  // "window" only exists in the browser, not on the server,
  // so we check first to avoid errors.
  if (typeof window === "undefined") return;

  try {
    // Browser storage can only hold text, so we convert the object to JSON text.
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // If storage is blocked (e.g. private mode), we just skip saving.
  }
}

// Read the saved order back. Returns null if there is none.
export function getLastOrder(): Order | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    // Convert the JSON text back into an Order object.
    return saved ? (JSON.parse(saved) as Order) : null;
  } catch {
    return null;
  }
}

// Remove the saved order (optional, useful for cleaning up).
export function clearLastOrder(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}