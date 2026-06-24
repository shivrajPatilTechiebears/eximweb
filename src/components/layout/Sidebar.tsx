"use client";

import { useState } from "react";
import Link from "next/link";
import { NavLink } from "./NavLink";
import { Icon } from "@/components/ui/Icon";
import { SpeedDial, type SpeedDialAction } from "@/components/ui/SpeedDial";

// ── Types ─────────────────────────────────────────────────────────────────────

interface HoverSubItem {
  label: string;
  href: string;
}

interface HoverNavItemDef {
  icon: string;
  label: string;
  children: HoverSubItem[];
}

interface SubNavItem {
  icon: string;
  label: string;
  href: string;
}

interface NavItem {
  icon: string;
  label: string;
  href: string;
  children?: SubNavItem[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ── Static config ─────────────────────────────────────────────────────────────

const LOGO_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuArEP6GLjK9dTfNvL36S3Z7VgcEh4zisu-IF4o3GdH5RsAnPR6h6GSu29jVxBKwXIbAtyJkO-KZJPp_3B5mAx3mhPBtVdRQLNNTaJLC9YwC7sZNs8X7FgzK1xEY49cLWiA9xlBev7ZJ7cZu4-uVtxJ7nW4pLvq13nBUMXojzlGIY5_MgpAjUmHsyNsMjPSAyrsA6c9i3x3nUJ44FX6VZTSswjX7Hsm0_-_Q9E4odFlPw31rjJ1sdFhP_INUPoMPkgjUX7DEy2el7f5r";

const NAV_SECTIONS: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        icon: "photo_library",
        label: "Image Library",
        href: "/",
      },
      {
        icon: "request_quote",
        label: "Purchase Request",
        href: "#",
        children: [
          { icon: "format_list_bulleted", label: "All Requests", href: "/purchase-request" },
          { icon: "pending_actions", label: "Open Requests", href: "/purchase-request/open" },
          { icon: "description", label: "PR Details", href: "/purchase-request/details" },
        ],
      },
      {
        icon: "inventory_2",
        label: "Purchase Order",
        href: "#",
        children: [
          { icon: "format_list_bulleted", label: "All Purchase order", href: "/purchase-order" },
          { icon: "pending_actions", label: "Open Purchase order", href: "/purchase-order/open" },
          { icon: "receipt_long", label: "Purchase order details", href: "/purchase-order/details" },
        ],
      },
      {
        icon: "local_shipping",
        label: "Shipments",
        href: "#",
        children: [
          { icon: "format_list_bulleted", label: "All Shipments", href: "/shipments" },
          { icon: "task_alt", label: "Confirmed Shipments", href: "/shipments/confirmed" },
          { icon: "directions_boat", label: "Intransit Shipment", href: "/shipments/intransit" },
        ],
      },
      {
        icon: "book_online",
        label: "Bookings",
        href: "#",
        children: [
          { icon: "format_list_bulleted", label: "All Bookings", href: "/bookings" },
          { icon: "event_available", label: "Booking Confirmed", href: "/bookings/confirmed" },
          { icon: "flight_takeoff", label: "Intransit Bookings", href: "/bookings/intransit" },
        ],
      },
    ],
  },
];

const WHITE_LABEL_ITEM: HoverNavItemDef = {
  icon: "network",
  label: "White Label Mgmt",
  children: [
    { label: "Admin Management",   href: "/admin-management" },
    { label: "Company Management", href: "/company-management" },
  ],
};

const FAB_ACTIONS: SpeedDialAction[] = [
  {
    icon: "description",
    label: "Create PO",
    sub: "New purchase order",
    href: "/purchase-order/create",
    iconBg: "bg-[#FFDBCB]/60",
    iconColor: "text-[#884D70]",
  },
  {
    icon: "request_quote",
    label: "Create PR",
    sub: "Purchase request",
    href: "#",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    icon: "local_shipping",
    label: "New Shipment",
    sub: "Add shipment",
    href: "#",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
];

// ── Hover nav item (hover to open, click to toggle) ───────────────────────────

function HoverNavItem({
  item,
  activeLabel,
}: {
  item: HoverNavItemDef;
  activeLabel?: string;
}) {
  const [clickOpen, setClickOpen] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);
  const isOpen = clickOpen || hoverOpen;
  const isChildActive = item.children.some((c) => c.label === activeLabel);

  return (
    <div
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => setHoverOpen(false)}
    >
      <button
        type="button"
        onClick={() => setClickOpen((v) => !v)}
        className={`flex items-center gap-3 px-2 py-1.5 rounded-lg w-full transition-colors ${
          isChildActive
            ? "text-white bg-teal-600/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        }`}
      >
        <Icon
          name={item.icon}
          size={16}
          className={`shrink-0 pointer-events-none ${isChildActive ? "text-teal-400" : "text-slate-500"}`}
        />
        <span className={`text-[13px] flex-1 leading-none text-left pointer-events-none ${isChildActive ? "font-bold" : "font-normal"}`}>
          {item.label}
        </span>
        <Icon
          name="expand_less"
          size={14}
          className={`pointer-events-none transition-transform duration-200 ${isOpen ? "rotate-0" : "rotate-180"} ${isChildActive ? "text-slate-300" : "text-slate-600"}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-[22px] mt-1 pb-1 border-l border-slate-700 space-y-1.5">
          {item.children.map((child) => (
            <div key={child.label} className="relative pl-4">
              <div className="absolute left-0 top-[50%] w-3.5 h-px bg-black/10 -translate-y-px" />
              <Link
                href={child.href}
                className={`flex items-center px-2 py-1.5 rounded-lg text-[12px] leading-none transition-colors ${
                  child.label === activeLabel
                    ? "text-white bg-teal-600/20 font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-normal"
                }`}
              >
                {child.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitialExpanded(activeLabel?: string): Set<string> {
  const set = new Set<string>();
  NAV_SECTIONS.flatMap((s) => s.items).forEach((item) => {
    if (item.children?.some((c) => c.label === activeLabel)) set.add(item.label);
  });
  return set;
}

// ── Sub-item row ──────────────────────────────────────────────────────────────

function CollapsibleNavItem({
  item,
  activeLabel,
  expanded,
  onToggle,
}: {
  item: NavItem;
  activeLabel?: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasChildren = (item.children?.length ?? 0) > 0;
  const isChildActive = item.children?.some((c) => c.label === activeLabel) ?? false;
  const isActive = item.label === activeLabel || isChildActive;

  if (!hasChildren) {
    return (
      <NavLink
        icon={item.icon}
        label={item.label}
        href={item.href}
        active={item.label === activeLabel}
        iconSize={16}
        textSize="text-[13px]"
      />
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-3 px-2 py-1.5 rounded-lg w-full transition-colors ${isActive ? "text-white bg-teal-600/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
      >
        <Icon
          name={item.icon}
          size={16}
          className={`shrink-0 pointer-events-none ${isActive ? "text-teal-400" : "text-slate-500"}`}
        />
        <span className={`text-[13px] flex-1 leading-none text-left pointer-events-none ${isActive ? "font-bold" : "font-normal"}`}>
          {item.label}
        </span>
        <Icon
          name="expand_less"
          size={14}
          className={`pointer-events-none transition-transform duration-200 ${expanded ? "rotate-0" : "rotate-180"} ${isActive ? "text-slate-300" : "text-slate-600"
            }`}
        />
      </button>

      {expanded && (
        <div className="ml-[22px] mt-1 pb-1 border-l border-slate-700 space-y-1.5">
          {item.children!.map((child) => (
            <div key={child.label} className="relative pl-4">
              <div className="absolute left-0 top-[50%] w-3.5 h-px bg-black/10 -translate-y-px" />
              <NavLink
                icon={child.icon}
                label={child.label}
                href={child.href}
                active={child.label === activeLabel}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeNavLabel?: string;
}

export function Sidebar({ activeNavLabel }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => getInitialExpanded(activeNavLabel)
  );

  const toggle = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] flex flex-col z-50 bg-[#0f172a]">

      {/* Scrollable body */}
      <div className="px-4 pt-3 pb-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">

        {/* Logo */}
        <div className="flex items-center gap-2.5 h-8 mb-5">
          <div className="bg-teal-500 p-1.5 rounded-lg flex items-center justify-center shrink-0">
            <img
              alt="EXIM Logo"
              className="w-4 h-4 object-contain brightness-0 invert"
              src={LOGO_SRC}
            />
          </div>
          <span className="text-base font-bold tracking-tight text-white">EXIM</span>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[16px]" />
          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-7 py-1.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 text-slate-300 placeholder:text-slate-500"
            placeholder="Search here .."
            type="text"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">/</span>
        </div>

        {/* Nav */}
        <nav className="space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-2">
                {section.label}
              </p>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <CollapsibleNavItem
                      item={item}
                      activeLabel={activeNavLabel}
                      expanded={expandedItems.has(item.label)}
                      onToggle={() => toggle(item.label)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 px-2">
              WHITE LABEL
            </p>
            <ul className="space-y-1.5">
              <li>
                <HoverNavItem item={WHITE_LABEL_ITEM} activeLabel={activeNavLabel} />
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom — FAB + Settings */}
      <div className="px-4 pb-4 space-y-2 border-t border-slate-800 pt-3">
        <SpeedDial actions={FAB_ACTIONS} />
        <a
          href="#"
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <Icon name="settings" className="text-slate-500 text-[20px] shrink-0" />
          <span className="text-sm font-normal">Settings</span>
        </a>
      </div>

    </aside>
  );
}
