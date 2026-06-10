"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type SubItem = { label: string; href: string; icon: string; badge?: string };
type NavItemDef = { label: string; href: string; sub?: SubItem[] };

const NAV_ITEMS: NavItemDef[] = [
  { label: "Dashboard", href: "/" },
  { label: "Image Library", href: "/" },
  {
    label: "Purchase Request", href: "/purchase-request",
    sub: [
      { label: "All Requests", href: "/purchase-request", icon: "format_list_bulleted" },
      { label: "Open Requests", href: "/purchase-request/open", icon: "pending_actions" },
      { label: "PR Details", href: "/purchase-request/details", icon: "description" },
    ],
  },
  {
    label: "Purchase Order", href: "/purchase-order",
    sub: [
      { label: "All Purchase order", href: "/purchase-order", icon: "format_list_bulleted" },
      { label: "Open Purchase order", href: "/purchase-order/open", icon: "pending_actions" },
      { label: "Purchase order details", href: "/purchase-order/details", icon: "receipt_long" },
    ],
  },
  {
    label: "Shipments", href: "/shipments",
    sub: [
      { label: "All Shipments", href: "/shipments", icon: "format_list_bulleted" },
      { label: "Confirmed Shipments", href: "/shipments/confirmed", icon: "task_alt" },
      { label: "Intransit Shipment", href: "/shipments/intransit", icon: "directions_boat" },
    ],
  },
  {
    label: "Bookings", href: "/bookings",
    sub: [
      { label: "All Bookings", href: "/bookings", icon: "format_list_bulleted" },
      { label: "Booking Confirmed", href: "/bookings/confirmed", icon: "event_available" },
      { label: "Intransit Bookings", href: "/bookings/intransit", icon: "flight_takeoff" },
    ],
  },
];

function NavItem({ item }: { item: NavItemDef }) {
  const pathname = usePathname();
  const isActive = item.href === "/"
    ? pathname === "/"
    : pathname.startsWith(item.href);

  return (
    <div className="relative group">
      <Link
        href={item.href}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${isActive
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }`}
      >
        {item.label}
        {item.sub && (
          <svg className="w-2 h-2 opacity-30 transition-transform duration-150 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        )}
      </Link>

      {item.sub && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-[60] opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-1.5 min-w-[168px]">
            {item.sub.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Icon name={s.icon} size={13} className="shrink-0 text-gray-400" strokeWidth={1.5} />
                <span className="flex-1">{s.label}</span>
                {s.badge && (
                  <span className="text-[9px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full leading-none">
                    {s.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FloatingNavbar() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 20 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-3 inset-x-0 z-50 flex justify-center transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
        }`}
    >
      <div className="flex items-center bg-white/90 backdrop-blur-md border border-gray-200/70 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-1.5 py-1.5 gap-0.5">

        {/* Logo */}
        <div className="flex items-center gap-1.5 px-2.5 pr-3 shrink-0">
          <div className="w-4 h-4 bg-[#8470ff] rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm" />
          </div>
          <span className="text-gray-900 font-bold text-[11px] tracking-tight">EXIM</span>
        </div>

        <div className="w-px h-3.5 bg-gray-200 shrink-0" />

        {/* Nav links */}
        <div className="flex items-center gap-0.5 px-1.5">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </div>

        <div className="w-px h-3.5 bg-gray-200 shrink-0" />

        {/* Bell */}
        <button className="p-1.5 mx-0.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        {/* User */}
        <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded-full transition-colors shrink-0">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">S</div>
          <span className="text-[11px] text-gray-600">Shivam</span>
          <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

      </div>
    </div>
  );
}
