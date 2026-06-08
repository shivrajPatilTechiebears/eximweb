"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { type TableColumn } from "@/components/ui/Table";
import { DataTable } from "@/components/table/DataTable";
import { TimeframeToggle } from "@/components/ui/TimeframeToggle";
import { DateRangeDropdown } from "@/components/ui/DateRangeDropdown";
import { FilterDropdown } from "@/components/ui/FilterDropdown";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PurchaseOrderRow {
  id: string;
  supplier: string;
  etd: string;
  value: string;
  status: "Shipped" | "Delayed" | "Pending";
  avatarBg: string;
}

// ── Static data ───────────────────────────────────────────────────────────────

const PURCHASE_ORDERS: PurchaseOrderRow[] = [
  { id: "PO-2024-001", supplier: "Amex Tech Systems",      etd: "2024-10-15", value: "$12,450.00", status: "Shipped",  avatarBg: "#3b82f6" },
  { id: "PO-2024-002", supplier: "Zenth Global Logistics", etd: "2024-10-18", value: "$4,200.00",  status: "Delayed",  avatarBg: "#ef4444" },
  { id: "PO-2024-003", supplier: "Prime Materials Co.",    etd: "2024-10-22", value: "$8,900.00",  status: "Pending",  avatarBg: "#f59e0b" },
  { id: "PO-2024-004", supplier: "Global Supply Chain",    etd: "2024-10-25", value: "$6,750.00",  status: "Shipped",  avatarBg: "#8b5cf6" },
  { id: "PO-2024-005", supplier: "Eastern Trade Corp.",    etd: "2024-10-28", value: "$3,300.00",  status: "Pending",  avatarBg: "#10b981" },
];

const STATUS_STYLE: Record<PurchaseOrderRow["status"], string> = {
  Shipped: "text-emerald-600 bg-emerald-50",
  Delayed: "text-red-500 bg-red-50",
  Pending: "text-amber-500 bg-amber-50",
};

const STATUS_OPTIONS = ["Shipped", "Pending", "Delayed"];
const DATE_RANGES = ["Today", "Last 7 days", "Jan 1 – Jun 30, 2024", "Jan 1 – Dec 30, 2024"];

// ── Component ─────────────────────────────────────────────────────────────────

export function PurchaseOrdersTable() {
  const [timeframeOn, setTimeframeOn] = useState(true);
  const [selectedRange, setSelectedRange] = useState("Jan 1 – Dec 30, 2024");
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(
    new Set(STATUS_OPTIONS)
  );
  const [orders, setOrders] = useState([...PURCHASE_ORDERS]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);

  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = () => setMoreMenuId(null);
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filteredOrders = timeframeOn
    ? orders.filter((o) => activeStatuses.has(o.status))
    : orders;

  const toggleStatus = (s: string) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setDeleteId(null);
  };

  // ── Column definitions ─────────────────────────────────────────────────────

  const columns: TableColumn<PurchaseOrderRow>[] = [
    {
      field: "id",
      header: "PO ID",
      body: (row) => (
        <span className="text-sm font-semibold text-gray-800">{row.id}</span>
      ),
    },
    {
      field: "supplier",
      header: "Supplier",
      body: (row) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ backgroundColor: row.avatarBg }}
          >
            {row.supplier.charAt(0)}
          </div>
          <span className="text-sm text-gray-700">{row.supplier}</span>
        </div>
      ),
    },
    {
      field: "etd",
      header: "ETD",
      body: (row) => <span className="text-sm text-gray-600">{row.etd}</span>,
    },
    {
      field: "value",
      header: "Value",
      body: (row) => <span className="text-sm font-semibold text-gray-800">{row.value}</span>,
    },
    {
      field: "status",
      header: "Status",
      body: (row) => (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[row.status]}`}>
          {row.status}
        </span>
      ),
    },
    {
      field: "action",
      header: "Action",
      body: (row) => (
        <div className="flex items-center gap-2.5 text-black/30">
          <button
            onClick={() => alert(`Edit ${row.id}`)}
            className="hover:text-gray-700 transition-colors"
            title="Edit"
          >
            <Icon name="edit" className="text-[16px]" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Icon name="delete" className="text-[16px]" />
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMoreMenuId(moreMenuId === row.id ? null : row.id); }}
              className="hover:text-gray-700 transition-colors"
              title="More"
            >
              <Icon name="more_vert" className="text-[16px]" />
            </button>
            {moreMenuId === row.id && (
              <div className="absolute right-0 bottom-6 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 w-36">
                {["View Details", "Duplicate", "Export", "Archive"].map((action) => (
                  <button
                    key={action}
                    onClick={() => { alert(`${action}: ${row.id}`); setMoreMenuId(null); }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <DataTable
      title="Purchase Orders"
      columns={columns}
      data={filteredOrders}
      emptyMessage="No orders match the current filters."
      rowStyle={(row, i) => ({
        backgroundColor: deleteId === row.id
          ? "var(--color-row-danger)"
          : i % 2 === 0
          ? "#ffffff"
          : "var(--color-row-alt)",
      })}
      expandedRow={(row) =>
        deleteId === row.id ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-700 font-medium">
              Delete <strong>{row.id}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(row.id)}
                className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1 bg-white text-gray-700 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null
      }
      headerActions={
        <>
          <TimeframeToggle value={timeframeOn} onChange={setTimeframeOn} />
          <DateRangeDropdown
            value={selectedRange}
            onChange={setSelectedRange}
            options={DATE_RANGES}
          />
          <FilterDropdown
            options={STATUS_OPTIONS}
            active={activeStatuses}
            onChange={toggleStatus}
            groupLabel="Status"
            renderOption={(option) => (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[option as PurchaseOrderRow["status"]]}`}>
                {option}
              </span>
            )}
          />
        </>
      }
    />
  );
}
