"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { TabbedTable } from "@/components/table/TabbedTable";

// ── Data ───────────────────────────────────────────────────────────────────────

type POStatus = "created" | "pending";

interface PurchaseOrder {
  id: string; poNumber: string; poType: string; deliveryLocation: string;
  itemName: string; itemQty: number; price: string; currency: string;
  shipTerm: string; payTerm: string; transporter: string; truckNo: string;
  driver: string; status: POStatus;
}

const STATUS_STYLE: Record<POStatus, string> = {
  created: "badge-success",
  pending: "badge-warning",
};

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "PO-001", poNumber: "PO-2024-00139", poType: "Paddler", deliveryLocation: "Mumbai Port Terminal 2", itemName: "Steel Wire Mesh G12", itemQty: 150, price: "$12,500", currency: "USD", shipTerm: "EXW - Ex Works", payTerm: "Net 30 Days", transporter: "SafeLogistics Pvt Ltd", truckNo: "MH05-1234", driver: "Shivraj P.", status: "created" },
  { id: "PO-002", poNumber: "PO-2024-00140", poType: "Direct", deliveryLocation: "Delhi Warehouse A", itemName: "Hydraulic Seal Kit", itemQty: 45, price: "$3,400", currency: "USD", shipTerm: "FOB - Free on Board", payTerm: "15% Advance", transporter: "Global Freight", truckNo: "KA01-9988", driver: "Amit S.", status: "pending" },
];

const TABS: { label: string; statuses: POStatus[] | null }[] = [
  { label: "All", statuses: null },
  { label: "Open", statuses: ["pending"] },
  { label: "Created", statuses: ["created"] },
];

const COLUMN_KEYS = [
  "poNumber", "poType", "itemName", "itemQty", "price", "currency",
  "deliveryLocation", "shipTerm", "payTerm", "transporter", "truckNo", "driver",
  "status", "actions",
] as const;

const DEFAULT_VISIBLE = new Set<string>(["poNumber", "itemName", "itemQty", "price", "deliveryLocation", "status", "actions"]);

const PAGE_SIZE = 10;

const CX = {
  statVal: "text-gray-700 font-semibold",
  statSep: "text-gray-300",
} as const;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PurchaseOrderListPage() {
  const [orders, setOrders] = useState([...PURCHASE_ORDERS]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE);
  const [currentPage, setCurrentPage] = useState(1);
  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleTabChange = (tab: number) => { setActiveTab(tab); setCurrentPage(1); };
  const handleSearchChange = (value: string) => { setSearch(value); setCurrentPage(1); };
  const toggleCol = (key: string) =>
    setVisibleCols((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); n.add("actions"); return n; });

  const tabStatuses = TABS[activeTab].statuses;

  const filteredOrders = [...orders]
    .filter((o) => {
      if (tabStatuses && !tabStatuses.includes(o.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return o.poNumber.toLowerCase().includes(q) || o.itemName.toLowerCase().includes(q) || o.deliveryLocation.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv, undefined, { numeric: true }) : bv.localeCompare(av, undefined, { numeric: true });
    });

  const totalValue = orders.reduce((s, o) => s + parseFloat(o.price.replace(/[$,]/g, "")), 0);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pagedOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Column definitions ────────────────────────────────────────────────────────

  const allColumns: Column<PurchaseOrder>[] = [
    {
      key: "poNumber", header: "PO Number", sortable: true, align: "left",
      cell: (row) => (
        <Link href={`/purchase-order/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
          {row.poNumber}
        </Link>
      ),
    },
    {
      key: "poType", header: "Type", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.poType}</span>,
    },
    {
      key: "itemName", header: "Item", sortable: true, align: "left",
      cell: (row) => <span className="text-[11px] text-slate-800 font-medium">{row.itemName}</span>,
    },
    {
      key: "itemQty", header: "Qty", sortable: true, align: "right",
      cell: (row) => <span className="text-[11px] font-semibold text-slate-800 tabular-nums">{row.itemQty}</span>,
    },
    {
      key: "price", header: "Price", sortable: true, align: "right",
      cell: (row) => <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.price}</span>,
    },
    {
      key: "currency", header: "Currency", sortable: false, align: "center",
      cell: (row) => <span className="text-[11px] text-gray-600 font-medium tracking-wide">{row.currency}</span>,
    },
    {
      key: "deliveryLocation", header: "Delivery", sortable: true, align: "left",
      cell: (row) => <span className="text-[11px] text-gray-700 max-w-40 truncate block">{row.deliveryLocation}</span>,
    },
    {
      key: "shipTerm", header: "Ship Terms", sortable: false, align: "left",
      cell: (row) => <span className="cell-text">{row.shipTerm}</span>,
    },
    {
      key: "payTerm", header: "Pay Terms", sortable: false, align: "left",
      cell: (row) => <span className="cell-text">{row.payTerm}</span>,
    },
    {
      key: "transporter", header: "Transporter", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.transporter}</span>,
    },
    {
      key: "truckNo", header: "Truck No", sortable: false, align: "left",
      cell: (row) => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.truckNo}</span>,
    },
    {
      key: "driver", header: "Driver", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.driver}</span>,
    },
    {
      key: "status", header: "Status", sortable: true, align: "center",
      cell: (row) => (
        <span className={`status-badge ${STATUS_STYLE[row.status]}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "actions", header: "Actions", sortable: false, align: "right",
      cell: (row) => (
        <TableActions
          viewHref={`/purchase-order/${row.id}`}
          editHref={`/purchase-order/${row.id}/edit`}
          onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
        />
      ),
    },
  ];

  const shownCols = allColumns.filter((c) => visibleCols.has(c.key));

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: PurchaseOrder, colSpan: number) =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.poNumber}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => { setOrders((p) => p.filter((o) => o.id !== row.id)); setDeleteId(null); }}
              >
                Confirm
              </Button>
              <Button variant="ghost-glass" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </td>
      </tr>
    );

  // ── Status bar ────────────────────────────────────────────────────────────────

  const statusBar = (
    <>
      <div className="flex items-center gap-4 text-[10px] text-gray-500">
        <span>Count: <strong className={CX.statVal}>{filteredOrders.length}</strong></span>
        <span className={CX.statSep}>|</span>
        <span>Total Value: <strong className={CX.statVal}>${totalValue.toLocaleString()}</strong></span>
        <span className={CX.statSep}>|</span>
        <span>Created: <strong className="text-emerald-600 font-semibold">{orders.filter((o) => o.status === "created").length}</strong></span>
        <span className={CX.statSep}>·</span>
        <span>Pending: <strong className="text-amber-600 font-semibold">{orders.filter((o) => o.status === "pending").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800">


      <main className="flex-1 px-6 pt-3 pb-4 flex flex-col gap-2">

        <div className="flex items-center justify-between gap-2 px-1">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Purchase Orders" }]} />
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearchChange} placeholder="Search orders…" />
            <div className="w-px h-4 bg-gray-300/60 shrink-0" />
            <ColumnSelector
              columns={allColumns.filter((c) => c.key !== "actions")}
              visibleColumns={visibleCols}
              onToggle={toggleCol}
            />
            <Button variant="cta-secondary">
              <Icon name="download" size={13} />
              Export
            </Button>
            <Link href="/purchase-order/create">
              <Button variant="cta-sunset" icon="add">Create PO</Button>
            </Link>
          </div>
        </div>

        <TabbedTable
          selectedIndex={activeTab}
          onChange={handleTabChange}
          tabs={TABS.map((tab) => ({
            label: tab.label,
            count: tab.statuses
              ? orders.filter((o) => tab.statuses!.includes(o.status)).length
              : orders.length,
            content: (
              <ExcelTable<PurchaseOrder>
                columns={shownCols}
                data={pagedOrders}
                rowKey={(row) => row.id}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                rowClassName={(row, i) =>
                  deleteId === row.id
                    ? "bg-red-100/60"
                    : i % 2 === 0
                      ? "bg-white/45 hover:bg-white/70"
                      : "bg-white/20 hover:bg-white/50"
                }
                expandedRow={expandedRow}
                emptyMessage="No purchase orders found."
                statusBar={statusBar}
                className=""
                statusBarClassName="table-status-bar-glass"
              />
            ),
          }))}
        />

      </main>

    </div>
  );
}
