// components/AnnouncementBar.tsx
// The thin black strip at the very top of the site.

import { siteConfig } from "@/config/site";

export default function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2.5 text-center text-[11px] font-light uppercase tracking-[0.2em] text-white">
      {siteConfig.announcement}
    </div>
  );
}