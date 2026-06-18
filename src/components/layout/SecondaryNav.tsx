"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SubItem = { label: string; href: string; icon?: string };
type ModuleTab = { label: string; href: string; sub?: SubItem[] };

export const MODULE_TABS: ModuleTab[] = [
  { label: "Image Library", href: "/image-library" },
  {
    label: "Purchase Request",
    href: "/purchase-request",
    sub: [
      { label: "All Requests", href: "/purchase-request", icon: "format_list_bulleted" },
      { label: "Open Requests", href: "/purchase-request/open", icon: "pending_actions" },
      { label: "PR Details", href: "/purchase-request/details", icon: "description" },
    ],
  },
  {
    label: "Purchase Order",
    href: "/purchase-order",
    sub: [
      { label: "All Orders", href: "/purchase-order", icon: "format_list_bulleted" },
      { label: "Open Orders", href: "/purchase-order/open", icon: "pending_actions" },
      { label: "Order Details", href: "/purchase-order/details", icon: "receipt_long" },
    ],
  },
  {
    label: "Shipments",
    href: "/shipments",
    sub: [
      { label: "All Shipments", href: "/shipments", icon: "format_list_bulleted" },
      { label: "Confirmed", href: "/shipments/confirmed", icon: "task_alt" },
      { label: "Intransit", href: "/shipments/intransit", icon: "directions_boat" },
    ],
  },
  {
    label: "Bookings",
    href: "/bookings",
    sub: [
      { label: "All Bookings", href: "/bookings", icon: "format_list_bulleted" },
      { label: "Confirmed", href: "/bookings/confirmed", icon: "event_available" },
      { label: "Intransit", href: "/bookings/intransit", icon: "flight_takeoff" },
    ],
  },
];

function SegmentedTabItem({ tab }: { tab: ModuleTab }) {
  const pathname = usePathname();
  const isActive =
    pathname.startsWith(tab.href) ||
    (tab.sub?.some(s => pathname.startsWith(s.href)) ?? false);

  return (
    <Link
      href={tab.href}
      className={`flex items-center px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
        isActive
          ? "bg-white text-[#8470ff] shadow-sm"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {tab.label}
    </Link>
  );
}

function isModulePath(pathname: string) {
  return MODULE_TABS.some(
    tab =>
      pathname.startsWith(tab.href) ||
      (tab.sub?.some(s => pathname.startsWith(s.href)) ?? false)
  );
}

export function SecondaryNav() {
  const pathname = usePathname();
  const [navbarVisible, setNavbarVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavbarVisible(y < 20 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!isModulePath(pathname)) return null;

  return (
    <div className={`fixed top-0 inset-x-0 z-40 bg-white transition-transform duration-500 ease-in-out ${navbarVisible ? "translate-y-15" : "translate-y-0"}`}>
      <div className="flex justify-center py-2.5 px-6">
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
          {MODULE_TABS.map(tab => (
            <SegmentedTabItem key={tab.href} tab={tab} />
          ))}
        </div>
      </div>
    </div>
  );
}
