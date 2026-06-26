"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavCtx } from "./NavProvider";

// ── Tab definitions ───────────────────────────────────────────────────────────

type SubItem = { label: string; href: string; icon?: string };

export type ModuleTab = { label: string; href: string; sub?: SubItem[] };

export const MODULE_TABS: ModuleTab[] = [
  { label: "Image Library", href: "/image-library" },
  {
    label: "Purchase Request",
    href: "/purchase-request",
    sub: [
      { label: "All Requests",  href: "/purchase-request",         icon: "format_list_bulleted" },
      { label: "Open Requests", href: "/purchase-request/open",    icon: "pending_actions" },
      { label: "PR Details",    href: "/purchase-request/details", icon: "description" },
    ],
  },
  {
    label: "Purchase Order",
    href: "/purchase-order",
    sub: [
      { label: "All Orders",    href: "/purchase-order",         icon: "format_list_bulleted" },
      { label: "Open Orders",   href: "/purchase-order/open",    icon: "pending_actions" },
      { label: "Order Details", href: "/purchase-order/details", icon: "receipt_long" },
    ],
  },
  {
    label: "Shipments",
    href: "/shipments",
    sub: [
      { label: "All Shipments", href: "/shipments",           icon: "format_list_bulleted" },
      { label: "Confirmed",     href: "/shipments/confirmed", icon: "task_alt" },
      { label: "Intransit",     href: "/shipments/intransit", icon: "directions_boat" },
    ],
  },
  {
    label: "Bookings",
    href: "/bookings",
    sub: [
      { label: "All Bookings", href: "/bookings",            icon: "format_list_bulleted" },
      { label: "Confirmed",    href: "/bookings/confirmed",  icon: "event_available" },
      { label: "Intransit",    href: "/bookings/intransit",  icon: "flight_takeoff" },
    ],
  },
];

export const WHITE_LABEL_TABS: ModuleTab[] = [
  { label: "Admin Mgmt",    href: "/admin-management" },
  { label: "Company Mgmt",  href: "/company-management" },
  { label: "Role & Permissions", href: "/role-permissions" },
  { label: "Employee Mgmt", href: "/employee-management" },
];

// ── Single tab pill ───────────────────────────────────────────────────────────

function TabPill({ tab }: { tab: ModuleTab }) {
  const pathname = usePathname();
  const isActive =
    pathname.startsWith(tab.href) ||
    (tab.sub?.some(s => pathname.startsWith(s.href)) ?? false);

  return (
    <Link
      href={tab.href}
      className={`flex items-center px-4 py-1.5 rounded-[10px] text-[11px] font-semibold transition-all duration-200 whitespace-nowrap ${
        isActive
          ? "bg-white/95 text-[#884D70] shadow-[0_1px_4px_rgba(0,0,0,0.10),0_0_0_0.5px_rgba(0,0,0,0.04)]"
          : "text-[#884D70]/60 hover:text-[#884D70] hover:bg-[#884D70]/8"
      }`}
    >
      {tab.label}
    </Link>
  );
}

// ── SecondaryNav ──────────────────────────────────────────────────────────────

export function SecondaryNav() {
  const { hoveredSection, enterHover, leaveHover } = useNavCtx();
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

  // Only show while a nav link is hovered
  if (!hoveredSection) return null;

  const isWhiteLabel = hoveredSection === "whiteLabel";
  const tabs         = isWhiteLabel ? WHITE_LABEL_TABS : MODULE_TABS;
  const groupKey     = isWhiteLabel ? "wl" : "cu";

  return (
    <div
      className={`fixed top-0 inset-x-0 z-40 transition-transform duration-500 ease-in-out ${
        navbarVisible ? "translate-y-15" : "translate-y-0"
      }`}
      onMouseEnter={() => enterHover(hoveredSection)}
      onMouseLeave={leaveHover}
    >
      {/* Horizontally scrollable on mobile */}
      <div className="flex justify-center py-2 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="flex items-center bg-[#FFDBCB]/10 border border-[#884D70]/25 rounded-[14px] shadow-[0_4px_24px_rgba(136,77,112,0.13)] p-1 gap-0.5 min-w-max">
          {/*
            Changing `key` unmounts the old group and mounts the new one,
            replaying the CSS enter animation on every section switch.
          */}
          <div
            key={groupKey}
            className="flex items-center gap-0.5"
            style={{ animation: "secNavFadeIn 0.22s ease-out both" }}
          >
            {tabs.map(tab => (
              <TabPill key={tab.href} tab={tab} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
