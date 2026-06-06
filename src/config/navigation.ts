import type { NavSection } from "@/components/layout/Sidebar";

export const SIDEBAR_CONFIG = {
  logoSrc:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuArEP6GLjK9dTfNvL36S3Z7VgcEh4zisu-IF4o3GdH5RsAnPR6h6GSu29jVxBKwXIbAtyJkO-KZJPp_3B5mAx3mhPBtVdRQLNNTaJLC9YwC7sZNs8X7FgzK1xEY49cLWiA9xlBev7ZJ7cZu4-uVtxJ7nW4pLvq13nBUMXojzlGIY5_MgpAjUmHsyNsMjPSAyrsA6c9i3x3nUJ44FX6VZTSswjX7Hsm0_-_Q9E4odFlPw31rjJ1sdFhP_INUPoMPkgjUX7DEy2el7f5r",
  logoAlt: "EXIM Company Logo",
  appName: "EXIM",
  appSubtitle: "Management",
};

const BASE_NAV_SECTIONS: NavSection[] = [
  {
    label: "MAIN",
    items: [{ icon: "dashboard", label: "Dashboard", href: "/" }],
  },
  {
    label: "MASTERS",
    items: [
      { icon: "local_shipping", label: "Transporters", href: "#" },
      { icon: "inventory_2", label: "Local Supplier", href: "#" },
    ],
  },
  {
    label: "PURCHASE",
    items: [
      { icon: "shopping_cart", label: "Purchase order", href: "/purchase-order" },
      { icon: "dock", label: "Shipment", href: "#" },
      { icon: "science", label: "Test sample", href: "/test-sample" },
    ],
  },
];

/** Returns nav sections with the matching item marked active. */
export function getNavSections(activeLabel: string): NavSection[] {
  return BASE_NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      active: item.label === activeLabel,
    })),
  }));
}
