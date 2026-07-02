"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavCtx } from "./NavProvider";

// ── Tab definitions ───────────────────────────────────────────────────────────

type SubItem = { label: string; href: string; icon?: string };

export type ModuleTab = { label: string; href: string; sub?: SubItem[] };

export const MODULE_TABS: ModuleTab[] = [
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

export const WHITE_LABEL_TABS: ModuleTab[] = [
  { label: "Admin Mgmt", href: "/admin-management" },
  { label: "Organisation", href: "/organisation" },
  { label: "Group of Company", href: "/group-company" },
  { label: "Company Mgmt", href: "/company-management" },
  { label: "Branch", href: "/branch" },
  { label: "Department", href: "/department" },
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
      className={`tab-pill ${isActive ? "tab-pill-active" : "tab-pill-inactive"}`}
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
  const tabs = isWhiteLabel ? WHITE_LABEL_TABS : MODULE_TABS;
  const groupKey = isWhiteLabel ? "wl" : "cu";

  return (
    // left-1/2 -translate-x-1/2 (instead of inset-x-0 + flex justify-center) makes this
    // box shrink-wrap to its own content and centers it by its own width, so the fixed
    // box never extends past the visible pill — no dead zone to swallow clicks elsewhere.
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-2rem)] transition-transform duration-500 ease-in-out ${navbarVisible ? "translate-y-14" : "translate-y-0"
        }`}
      onMouseEnter={() => enterHover(hoveredSection)}
      onMouseLeave={leaveHover}
    >
      {/* Horizontally scrollable when the pill is wider than the viewport */}
      <div className="py-2 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="nav-surface rounded-[14px] flex items-center p-1 gap-0.5 min-w-max">
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
