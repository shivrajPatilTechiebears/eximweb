"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MetricCard } from "@/components/cards/MetricCard";
import { DataTable } from "@/components/table/DataTable";
import { type TableColumn } from "@/components/ui/Table";
import { Pagination } from "@/components/table/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { DateRangeDropdown } from "@/components/ui/DateRangeDropdown";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ColumnVisibilitySelector, useColumnVisibility } from "@/components/ui/ColumnVisibilitySelector";

// ─── Types ────────────────────────────────────────────────────────────────────

type POStatus = "created" | "pending";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  poType: string;
  deliveryLocation: string;
  itemName: string;
  itemQty: number;
  price: string;
  currency: string;
  shipTerm: string;
  payTerm: string;
  transporter: string;
  truckNo: string;
  driver: string;
  status: POStatus;
  active: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const METRICS = [
  { title: "Total PRs",  value: 6, subtitle: "All Time",  icon: "shopping_cart", iconBg: "bg-indigo-100", iconColor: "text-indigo-500" },
  { title: "Submitted",  value: 1, subtitle: "Waiting",   icon: "send",          iconBg: "bg-amber-100",  iconColor: "text-amber-500"  },
  { title: "Approved",   value: 1, subtitle: "Ready",     icon: "task_alt",      iconBg: "bg-green-100",  iconColor: "text-green-500"  },
  { title: "PO Created", value: 3, subtitle: "Closed",    icon: "description",   iconBg: "bg-rose-100",   iconColor: "text-rose-500"   },
];

const STATUS_STYLE: Record<POStatus, string> = {
  created: "text-emerald-600 bg-emerald-50",
  pending: "text-amber-500 bg-amber-50",
};

const STATUS_OPTIONS: POStatus[] = ["created", "pending"];
const DATE_RANGES = ["Today", "Last 7 days", "Last 30 days", "Jan 1 – Dec 30, 2024"];

const PAGINATION = { current: 1, total: 10, totalPages: 2 };

const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "PO-001",
    poNumber: "PO-2024-00139",
    poType: "Paddler",
    deliveryLocation: "Mumbai Port Terminal 2",
    itemName: "Steel Wire Mesh G12",
    itemQty: 150,
    price: "$12,500",
    currency: "USD",
    shipTerm: "EXW - Ex Works",
    payTerm: "Net 30 Days",
    transporter: "SafeLogistics Pvt Ltd",
    truckNo: "MH05-1234",
    driver: "Shivraj P.",
    status: "created",
    active: true,
  },
  {
    id: "PO-002",
    poNumber: "PO-2024-00140",
    poType: "Direct",
    deliveryLocation: "Delhi Warehouse A",
    itemName: "Hydraulic Seal Kit",
    itemQty: 45,
    price: "$3,400",
    currency: "USD",
    shipTerm: "FOB - Free on Board",
    payTerm: "15% Advance",
    transporter: "Global Freight",
    truckNo: "KA01-9988",
    driver: "Amit S.",
    status: "pending",
    active: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PurchaseOrderListPage() {
  const [orders, setOrders]               = useState([...PURCHASE_ORDERS]);
  const [deleteId, setDeleteId]           = useState<string | null>(null);
  const [moreMenuId, setMoreMenuId]       = useState<string | null>(null);
  const [activeStatuses, setActiveStatuses] = useState<Set<string>>(new Set(STATUS_OPTIONS));
  const [selectedRange, setSelectedRange] = useState(DATE_RANGES[3]);
  const moreMenuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handle = () => setMoreMenuId(null);
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setDeleteId(null);
  };

  const toggleStatus = (s: string) => {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const filteredOrders = orders.filter((o) => activeStatuses.has(o.status));

  const ALL_COLUMNS: TableColumn<PurchaseOrder>[] = [
    {
      field: "poNumber",
      header: "PO NUMBER",
      body: (row) => (
        <span className="text-sm font-semibold text-primary">{row.poNumber}</span>
      ),
    },
    {
      field: "poType",
      header: "PO Type",
      body: (row) => <span className="text-sm text-gray-700">{row.poType}</span>,
    },
    {
      field: "deliveryLocation",
      header: "Delivery Location",
      body: (row) => <span className="text-sm text-gray-700">{row.deliveryLocation}</span>,
    },
    {
      field: "itemName",
      header: "Item Name",
      body: (row) => <span className="text-sm text-gray-700">{row.itemName}</span>,
    },
    {
      field: "itemQty",
      header: "Item Qty",
      center: true,
      body: (row) => <span className="text-sm font-semibold text-gray-800 tabular-nums">{row.itemQty}</span>,
    },
    {
      field: "price",
      header: "Price",
      body: (row) => <span className="text-sm font-semibold text-gray-800 tabular-nums">{row.price}</span>,
    },
    {
      field: "currency",
      header: "Currency",
      body: (row) => <span className="text-sm text-gray-500">{row.currency}</span>,
    },
    {
      field: "shipTerm",
      header: "Shipment Terms",
      body: (row) => <span className="text-sm text-gray-600">{row.shipTerm}</span>,
    },
    {
      field: "payTerm",
      header: "Payment Terms",
      body: (row) => <span className="text-sm text-gray-600">{row.payTerm}</span>,
    },
    {
      field: "transporter",
      header: "Transporter",
      body: (row) => <span className="text-sm text-gray-700">{row.transporter}</span>,
    },
    {
      field: "truckNo",
      header: "Truck No",
      body: (row) => <span className="text-sm text-gray-600 tabular-nums">{row.truckNo}</span>,
    },
    {
      field: "driver",
      header: "Driver",
      body: (row) => <span className="text-sm text-gray-700">{row.driver}</span>,
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
      field: "actions",
      header: "Action",
      center: true,
      body: (row) => (
        <div className="flex items-center justify-center gap-2.5 text-black/30">
          <Link href="/purchase-order/view">
            <button className="hover:text-gray-700 transition-colors" title="View">
              <Icon name="visibility" size={16} />
            </button>
          </Link>
          <Link href="/purchase-order/edit">
            <button className="hover:text-gray-700 transition-colors" title="Edit">
              <Icon name="edit" size={16} />
            </button>
          </Link>
          <button
            onClick={() => setDeleteId(row.id)}
            className="hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Icon name="delete" size={16} />
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMoreMenuId(moreMenuId === row.id ? null : row.id); }}
              className="hover:text-gray-700 transition-colors"
              title="More"
            >
              <Icon name="more_vert" size={16} />
            </button>
            {moreMenuId === row.id && (
              <div className="absolute right-0 bottom-6 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 w-40">
                {[
                  { label: "View Details", href: "/purchase-order/details" },
                  { label: "Duplicate",    href: "#" },
                  { label: "Export PDF",   href: "#" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setMoreMenuId(null)}
                    >
                      {item.label}
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  const { visibleColumns, setVisibleColumns, filteredColumns } = useColumnVisibility(ALL_COLUMNS);

  return (
    <AppShell title="Purchase Orders" activeNavLabel="All Purchase order">
      <main className="p-6 space-y-5 flex-1 overflow-x-hidden">

        {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {METRICS.map((m) => (
            <MetricCard key={m.title} {...m} />
          ))}
        </div>

        {/* ── Purchase Orders Table ─────────────────────────────────────────── */}
        <DataTable
          title="Purchase Orders"
          description="All purchase order records."
          toolbarActions={
            <>
              <SearchBar />
              <FilterDropdown
                label="Status"
                groupLabel="Status"
                options={STATUS_OPTIONS}
                active={activeStatuses}
                onChange={toggleStatus}
                renderOption={(option) => (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[option as POStatus]}`}>
                    {option}
                  </span>
                )}
              />
              <DateRangeDropdown
                value={selectedRange}
                onChange={setSelectedRange}
                options={DATE_RANGES}
              />
              <ColumnVisibilitySelector
                columns={ALL_COLUMNS}
                visibleColumns={visibleColumns}
                onVisibilityChange={setVisibleColumns}
              />
              <Button variant="outlined">Export</Button>
              <Link href="/purchase-order/create">
                <Button variant="primary" icon="add">Create PO</Button>
              </Link>
            </>
          }
          columns={filteredColumns}
          data={filteredOrders}
          rowKey={(row) => row.id}
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
                  Delete <strong>{row.poNumber}</strong>? This cannot be undone.
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
          showingCurrent={PAGINATION.current}
          showingTotal={PAGINATION.total}
          pagination={<Pagination current={PAGINATION.current} totalPages={PAGINATION.totalPages} />}
        />

      </main>
      <Footer />
    </AppShell>
  );
}
