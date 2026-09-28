// config/site.ts
// ------------------------------------------------------------
// ONE central place for everything about the brand.
// To rename the store, change `name` below. It updates everywhere
// (navbar, footer, page titles, etc.).
// ------------------------------------------------------------

export const siteConfig = {
  // ----- Brand -----
  name: "ATELIER", // <-- change this to rename the whole store
  tagline: "Considered clothing for everyday life",
  description:
    "Minimal, well-made clothing for women and men. Designed with care and delivered across Pakistan.",

  // ----- Money & delivery rules -----
  currency: "PKR",
  freeDeliveryThreshold: 5000, // orders at or above this get free delivery
  deliveryCharge: 250, // charged when the subtotal is below the threshold

  // Text shown in the thin bar at the very top of the site.
  // (If you change freeDeliveryThreshold above, update this text too.)
  announcement: "Free delivery on orders above PKR 5,000",

  // ----- Main navigation -----
  // Each link points to the Shop page with a filter in the URL.
  // The Shop page will read these filters later.
  navLinks: [
    { label: "Women", href: "/shop?category=women" },
    { label: "Men", href: "/shop?category=men" },
    { label: "New In", href: "/shop?filter=new" },
    { label: "Sale", href: "/shop?filter=sale" },
  ],

  // ----- Footer links -----
  footerLinks: {
    shop: [
      { label: "Women", href: "/shop?category=women" },
      { label: "Men", href: "/shop?category=men" },
      { label: "New In", href: "/shop?filter=new" },
      { label: "Sale", href: "/shop?filter=sale" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },

  // ----- Contact details (placeholders, replace with real ones) -----
  contact: {
    email: "hello@atelier.pk",
    phone: "+92 300 0000000",
    address: "Office 12, Example Plaza, Blue Area, Islamabad, Pakistan",
    hours: "Monday to Saturday, 10:00 am to 6:00 pm",
  },

  // ----- Social links (placeholders) -----
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
  },
} as const;