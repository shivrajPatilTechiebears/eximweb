// Single source of truth for the app's top navbar + hover flyout.
// FloatingNavbar and SecondaryNav only render this data; NavProvider only
// matches the current path against it. To add/move a route, edit this file —
// nothing else needs to change.

export type NavSubItem = { label: string; href: string; icon?: string };
export type NavModuleTab = { label: string; href: string; sub?: NavSubItem[] };

export type NavPillKey = "createUpdate" | "whiteLabel";

export interface NavPill {
  key: NavPillKey;
  label: string;
  /** Href for the top pill itself (used as the flyout's default landing link). */
  href: string;
  /** Tabs shown in the SecondaryNav flyout on hover; also defines which routes belong to this pill. */
  tabs: NavModuleTab[];
}

export interface PlainNavLink {
  label: string;
  href: string;
}

export const NAV_PILLS: NavPill[] = [
  {
    key: "createUpdate",
    label: "Create / Update",
    href: "/purchase-order",
    tabs: [
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
      {
        label: "Test Sample",
        href: "/test-sample",
        sub: [
          { label: "All Samples", href: "/test-sample", icon: "format_list_bulleted" },
        ],
      },
    ],
  },
  {
    key: "whiteLabel",
    label: "White Label",
    href: "/admin-management",
    tabs: [
      { label: "Admin Mgmt", href: "/admin-management" },
      { label: "Organisation", href: "/organisation" },
      { label: "Group of Company", href: "/group-company" },
      { label: "Company Mgmt", href: "/company-management" },
      { label: "Branch", href: "/branch" },
      { label: "Department", href: "/department" },
      { label: "Role & Permissions", href: "/role-permissions" },
      { label: "Employee Mgmt", href: "/employee-management" },
    ],
  },
];

// Top-level links that are plain navigation — no hover flyout, no sub-tabs.
export const NAV_PLAIN_LINKS: PlainNavLink[] = [
  { label: "Reports", href: "/reports" },
  { label: "Document Library", href: "/image-library" },
  { label: "Masters", href: "/masters" },
];

/** All route prefixes that belong to a pill — derived from its tabs, never listed by hand. */
export function pillPaths(pill: NavPill): string[] {
  return pill.tabs.map((t) => t.href);
}

export function pillForPath(pathname: string): NavPillKey | null {
  return NAV_PILLS.find((pill) => pillPaths(pill).some((p) => pathname.startsWith(p)))?.key ?? null;
}
