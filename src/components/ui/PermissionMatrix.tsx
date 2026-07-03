"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { PermCheckbox } from "@/components/ui/PermCheckbox";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PermKey   = "create" | "update" | "view" | "delete" | "export";
export type PermMap   = Record<PermKey, boolean>;
export type PermState = Record<string, PermMap>;

export interface ModuleNode {
  id: string;
  label: string;
  children?: ModuleNode[];
}

// ── Static data ───────────────────────────────────────────────────────────────

const PERM_COLS: { key: PermKey; label: string }[] = [
  { key: "create", label: "Create" },
  { key: "update", label: "Update" },
  { key: "view",   label: "View"   },
  { key: "delete", label: "Delete" },
  { key: "export", label: "Export" },
];

const MODULE_TREE: ModuleNode[] = [
  {
    id: "dashboard", label: "Dashboard",
    children: [
      { id: "dash_overview",  label: "Overview"  },
      { id: "dash_analytics", label: "Analytics" },
      { id: "dash_reports",   label: "Reports"   },
    ],
  },
  {
    id: "masters", label: "Masters",
    children: [
      { id: "masters_transporter", label: "Transporter" },
      { id: "masters_supplier",    label: "Supplier"    },
      { id: "masters_materials",   label: "Materials"   },
      { id: "masters_services",    label: "Services"    },
    ],
  },
  {
    id: "shipment", label: "Shipment",
    children: [
      { id: "ship_booking",   label: "Booking"   },
      { id: "ship_invoice",   label: "Invoice"   },
      { id: "ship_container", label: "Container" },
      { id: "ship_tracking",  label: "Tracking"  },
    ],
  },
  {
    id: "warehouse", label: "Warehouse",
    children: [
      { id: "wh_inward",  label: "Inward"           },
      { id: "wh_outward", label: "Outward"          },
      { id: "wh_stock",   label: "Stock Management" },
    ],
  },
  {
    id: "po", label: "PO",
    children: [
      { id: "po_request", label: "Purchase Request"  },
      { id: "po_order",   label: "Purchase Order"    },
      { id: "po_vendor",  label: "Vendor Management" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildEmptyState(): PermState {
  const state: PermState = {};
  const traverse = (node: ModuleNode) => {
    state[node.id] = { create: false, update: false, view: false, delete: false, export: false };
    node.children?.forEach(traverse);
  };
  MODULE_TREE.forEach(traverse);
  return state;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface PermissionMatrixProps {
  initialState?: PermState;
  disabled?: boolean;
  onChange?: (totalActive: number, permState: PermState) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PermissionMatrix({ initialState, disabled = false, onChange }: PermissionMatrixProps) {
  const [permState, setPermState] = useState<PermState>(() => initialState ?? buildEmptyState());
  const [expanded,  setExpanded]  = useState<Set<string>>(() =>
    initialState ? new Set(MODULE_TREE.map((m) => m.id)) : new Set()
  );

  const totalActive = Object.values(permState).reduce(
    (s, p) => s + Object.values(p).filter(Boolean).length, 0
  );

  useEffect(() => {
    onChange?.(totalActive, permState);
  }, [totalActive]);

  const toggleExpand = (id: string) =>
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const allExpanded = MODULE_TREE.every(m => expanded.has(m.id));

  const expandAll   = () => setExpanded(new Set(MODULE_TREE.map(m => m.id)));
  const collapseAll = () => setExpanded(new Set());

  const toggleNode = (id: string, key: PermKey) => {
    if (disabled) return;
    setPermState(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: !prev[id]?.[key] },
    }));
  };

  return (
    <div className="card-glass rounded-xl overflow-hidden">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100/80 bg-white/30">
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold text-slate-700">Permission Matrix</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#884D70]/10 text-[#884D70] font-semibold tabular-nums">
            {totalActive} selected
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#884D70] px-2.5 py-1 rounded-lg hover:bg-[#884D70]/5 transition-all"
          >
            <Icon name={allExpanded ? "unfold_less" : "unfold_more"} size={12} />
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "38%" }} />
            {PERM_COLS.map(c => <col key={c.key} style={{ width: "12.4%" }} />)}
          </colgroup>

          <thead className="sticky top-0 z-20">
            <tr className="bg-gray-50/95 backdrop-blur-sm border-b border-gray-200/60">
              <th className="pl-[44px] pr-5 py-3 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modules</span>
              </th>
              {PERM_COLS.map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {MODULE_TREE.flatMap((module) => {
              const isOpen     = expanded.has(module.id);
              const childCount = module.children?.length ?? 0;

              const parentRow = (
                <tr
                  key={`p-${module.id}`}
                  onClick={() => toggleExpand(module.id)}
                  className={`border-b cursor-pointer transition-colors ${
                    isOpen
                      ? "border-[#884D70]/10 bg-[#884D70]/[0.05] hover:bg-[#884D70]/[0.08]"
                      : "border-gray-100 bg-slate-50/60 hover:bg-[#884D70]/[0.04]"
                  }`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                      >
                        <Icon name="chevron_right" size={14} className={isOpen ? "text-[#884D70]" : "text-gray-400"} />
                      </span>
                      <span className={`text-[12px] font-semibold ${isOpen ? "text-[#884D70]" : "text-slate-800"}`}>
                        {module.label}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium">({childCount})</span>
                    </div>
                  </td>
                  {PERM_COLS.map(({ key }) => (
                    <td key={key} className="px-4 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-center">
                        <PermCheckbox
                          state={(permState[module.id]?.[key] ?? false) ? "checked" : "unchecked"}
                          onToggle={() => toggleNode(module.id, key)}
                          disabled={disabled}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );

              const childRows = isOpen
                ? (module.children ?? []).map((child, idx) => {
                    const isLast = idx === childCount - 1;
                    return (
                      <tr
                        key={`c-${child.id}`}
                        className="border-b border-[#884D70]/[0.06] bg-white/60 hover:bg-[#884D70]/[0.04] transition-colors"
                      >
                        <td className="py-0 pr-4">
                          <div className="relative flex items-center py-2.5 ml-7">
                            <div className={`absolute left-0 w-px bg-gray-200 ${isLast ? "top-0 h-1/2" : "top-0 h-full"}`} />
                            <div className="absolute left-0 top-1/2 w-4 h-px bg-gray-200 -translate-y-px" />
                            <span className="text-[11px] text-slate-700 font-medium pl-5">{child.label}</span>
                          </div>
                        </td>
                        {PERM_COLS.map(({ key }) => (
                          <td key={key} className="px-4 py-2.5 text-center">
                            <div className="flex justify-center">
                              <PermCheckbox
                                state={(permState[child.id]?.[key] ?? false) ? "checked" : "unchecked"}
                                onToggle={() => toggleNode(child.id, key)}
                                disabled={disabled}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })
                : [];

              return [parentRow, ...childRows];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
