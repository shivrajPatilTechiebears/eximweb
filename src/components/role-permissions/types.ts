import type { PermKey, PermState } from "@/components/ui/PermissionMatrix";

// ── Form data shape ───────────────────────────────────────────────────────────

export interface RoleFormData {
  roleName: string;
  description: string;
}

// ── Status ────────────────────────────────────────────────────────────────────

export type RoleStatus = "active" | "inactive";

export const STATUS_STYLE: Record<RoleStatus, { label: string; color: "success" | "warning" }> = {
  active:   { label: "Active",   color: "success" },
  inactive: { label: "Inactive", color: "warning" },
};

// ── Mock data ─────────────────────────────────────────────────────────────────

const MODULE_IDS = [
  "dashboard", "dash_overview", "dash_analytics", "dash_reports",
  "masters", "masters_transporter", "masters_supplier", "masters_materials", "masters_services",
  "shipment", "ship_booking", "ship_invoice", "ship_container", "ship_tracking",
  "warehouse", "wh_inward", "wh_outward", "wh_stock",
  "po", "po_request", "po_order", "po_vendor",
];

const ALL_PERMS: PermKey[] = ["create", "update", "view", "delete", "export"];

function buildPermState(overrides: Record<string, PermKey[]>): PermState {
  const state: PermState = {};
  for (const id of MODULE_IDS) {
    const active = overrides[id] ?? [];
    state[id] = {
      create: active.includes("create"),
      update: active.includes("update"),
      view:   active.includes("view"),
      delete: active.includes("delete"),
      export: active.includes("export"),
    };
  }
  return state;
}

export interface RoleRecord {
  roleName: string;
  description: string;
  status: RoleStatus;
  permissions: PermState;
}

export const MOCK_ROLES: Record<string, RoleRecord> = {
  "ROLE-001": {
    roleName: "Super Admin",
    description: "Full system access with all permissions",
    status: "active",
    permissions: buildPermState(Object.fromEntries(MODULE_IDS.map((id) => [id, ALL_PERMS]))),
  },
  "ROLE-002": {
    roleName: "Admin",
    description: "Manage admins, companies and employees",
    status: "active",
    permissions: buildPermState({
      dashboard: ["view"], dash_overview: ["view"], dash_reports: ["view", "export"],
      masters: ["view", "create", "update"], masters_transporter: ["view", "create", "update"], masters_supplier: ["view", "create", "update"],
      po: ["view", "create", "update"], po_request: ["view", "create", "update"], po_order: ["view", "create", "update"],
    }),
  },
  "ROLE-003": {
    roleName: "Manager",
    description: "Oversee operations and access reports",
    status: "active",
    permissions: buildPermState({
      dashboard: ["view"], dash_reports: ["view", "export"], dash_analytics: ["view"],
      shipment: ["view"], ship_booking: ["view"], ship_tracking: ["view"],
    }),
  },
  "ROLE-004": {
    roleName: "Staff",
    description: "Basic access for day-to-day tasks",
    status: "active",
    permissions: buildPermState({
      dashboard: ["view"], dash_overview: ["view"],
      warehouse: ["view"], wh_inward: ["view", "create"], wh_outward: ["view", "create"],
    }),
  },
  "ROLE-005": {
    roleName: "Read Only",
    description: "View-only access across all modules",
    status: "inactive",
    permissions: buildPermState(Object.fromEntries(MODULE_IDS.map((id) => [id, ["view"] as PermKey[]]))),
  },
  "ROLE-006": {
    roleName: "Partner Access",
    description: "Limited access for partner integrations",
    status: "inactive",
    permissions: buildPermState({
      po: ["view"], po_vendor: ["view", "create"],
      masters_transporter: ["view"],
    }),
  },
};
