"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

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
    <div className="relative group">
      <Link
        href={tab.href}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
          isActive
            ? "bg-white text-[#8470ff] shadow-sm"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        {tab.label}
        {tab.sub && (
          <svg
            className="w-2 h-2 opacity-50 transition-transform duration-150 group-hover:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        )}
      </Link>

      {tab.sub && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-60 opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-1.5 min-w-42">
            {tab.sub.map(s => (
              <Link
                key={s.href}
                href={s.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {s.icon && (
                  <Icon name={s.icon} size={13} className="shrink-0 text-gray-400" strokeWidth={1.5} />
                )}
                <span className="flex-1">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
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

  if (!isModulePath(pathname)) return null;

  return (
    <div className="fixed top-15 inset-x-0 z-40 bg-white">
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
