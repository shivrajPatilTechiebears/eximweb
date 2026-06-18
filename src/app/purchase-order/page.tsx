"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import StatCard from "@/components/cards/StatCard";
import { TabBar } from "@/components/ui/Tabs";
import { SearchInput } from "@/components/ui/SearchInput";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";

// ── Data ───────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { title: "Total POs",  value: "6", badge: "+12%", badgeClassName: "text-emerald-600 bg-emerald-50", accentColor: "#8470ff", subtitle: "All time" },
  { title: "Pending",    value: "1", badge: "17%",   badgeClassName: "text-amber-600 bg-amber-50",   accentColor: "#fbbf24", subtitle: "Awaiting approval" },
  { title: "Created",    value: "3", badge: "+50%",  badgeClassName: "text-emerald-600 bg-emerald-50", accentColor: "#34d399", subtitle: "Processed orders" },
  { title: "Approved",   value: "1", badge: "17%",   badgeClassName: "text-sky-600 bg-sky-50",       accentColor: "#38bdf8", subtitle: "Ready to dispatch" },
];

type POStatus = "created" | "pending";

interface PurchaseOrder {
  id: string; poNumber: string; poType: string; deliveryLocation: string;
  itemName: string; itemQty: number; price: string; currency: string;
  shipTerm: string; payTerm: string; transporter: string; truckNo: string;
  driver: string; status: POStatus;
}

const STATUS_STYLE: Record<POStatus, string> = {
  created: "text-emerald-600 bg-emerald-50",
  pending: "text-amber-600 bg-amber-50",
};

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "PO-001", poNumber: "PO-2024-00139", poType: "Paddler", deliveryLocation: "Mumbai Port Terminal 2", itemName: "Steel Wire Mesh G12", itemQty: 150, price: "$12,500", currency: "USD", shipTerm: "EXW - Ex Works", payTerm: "Net 30 Days", transporter: "SafeLogistics Pvt Ltd", truckNo: "MH05-1234", driver: "Shivraj P.", status: "created" },
  { id: "PO-002", poNumber: "PO-2024-00140", poType: "Direct", deliveryLocation: "Delhi Warehouse A", itemName: "Hydraulic Seal Kit", itemQty: 45, price: "$3,400", currency: "USD", shipTerm: "FOB - Free on Board", payTerm: "15% Advance", transporter: "Global Freight", truckNo: "KA01-9988", driver: "Amit S.", status: "pending" },
];

const TABS: { label: string; statuses: POStatus[] | null }[] = [
  { label: "All",     statuses: null },
  { label: "Open",    statuses: ["pending"] },
  { label: "Created", statuses: ["created"] },
];

const ALL_COLS: Column[] = [
  { key: "poNumber",        header: "PO Number",   sortable: true,  align: "left" },
  { key: "poType",          header: "Type",         sortable: true,  align: "left" },
  { key: "itemName",        header: "Item",         sortable: true,  align: "left" },
  { key: "itemQty",         header: "Qty",          sortable: true,  align: "right" },
  { key: "price",           header: "Price",        sortable: true,  align: "right" },
  { key: "currency",        header: "Currency",     sortable: false, align: "center" },
  { key: "deliveryLocation",header: "Delivery",     sortable: true,  align: "left" },
  { key: "shipTerm",        header: "Ship Terms",   sortable: false, align: "left" },
  { key: "payTerm",         header: "Pay Terms",    sortable: false, align: "left" },
  { key: "transporter",     header: "Transporter",  sortable: true,  align: "left" },
  { key: "truckNo",         header: "Truck No",     sortable: false, align: "left" },
  { key: "driver",          header: "Driver",       sortable: true,  align: "left" },
  { key: "status",          header: "Status",       sortable: true,  align: "center" },
  { key: "actions",         header: "Actions",      sortable: false, align: "right" },
];

const DEFAULT_VISIBLE = new Set(["poNumber", "itemName", "itemQty", "price", "deliveryLocation", "status", "actions"]);

const PAGE_SIZE = 10;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PurchaseOrderListPage() {
  const [orders, setOrders] = useState([...PURCHASE_ORDERS]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);
  const [moreMenuPos, setMoreMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE);
  const [currentPage, setCurrentPage] = useState(1);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuId(null);
        setMoreMenuPos(null);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleTabChange = (tab: number) => { setActiveTab(tab); setCurrentPage(1); };
  const handleSearchChange = (value: string) => { setSearch(value); setCurrentPage(1); };

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

  const shownCols = ALL_COLS.filter((c) => visibleCols.has(c.key));

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); n.add("actions"); return n; });

  // ── Cell renderer — all PO-specific display logic lives here ─────────────────

  const renderCell = (row: PurchaseOrder, col: Column): ReactNode => {
    switch (col.key) {
      case "poNumber": return (
        <Link href={`/purchase-order/${row.id}`} className="text-[11px] font-semibold text-[#8470ff] hover:underline underline-offset-2">
          {row.poNumber}
        </Link>
      );
      case "poType":           return <span className="text-[11px] text-gray-700">{row.poType}</span>;
      case "itemName":         return <span className="text-[11px] text-slate-800 font-medium">{row.itemName}</span>;
      case "itemQty":          return <span className="text-[11px] font-semibold text-slate-800 tabular-nums">{row.itemQty}</span>;
      case "price":            return <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.price}</span>;
      case "currency":         return <span className="text-[11px] text-gray-600 font-medium tracking-wide">{row.currency}</span>;
      case "deliveryLocation": return <span className="text-[11px] text-gray-700 max-w-[160px] truncate block">{row.deliveryLocation}</span>;
      case "shipTerm":         return <span className="text-[11px] text-gray-700">{row.shipTerm}</span>;
      case "payTerm":          return <span className="text-[11px] text-gray-700">{row.payTerm}</span>;
      case "transporter":      return <span className="text-[11px] text-gray-700">{row.transporter}</span>;
      case "truckNo":          return <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.truckNo}</span>;
      case "driver":           return <span className="text-[11px] text-gray-700">{row.driver}</span>;
      case "status": return (
        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
          {row.status}
        </span>
      );
      case "actions": return (
        <TableActions
          viewHref={`/purchase-order/${row.id}`}
          editHref={`/purchase-order/${row.id}/edit`}
          onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
          onMore={(e) => {
            e.stopPropagation();
            if (moreMenuId === row.id) { setMoreMenuId(null); setMoreMenuPos(null); }
            else {
              const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
              setMoreMenuPos({ top: rect.bottom + 4, left: rect.right - 160 });
              setMoreMenuId(row.id);
            }
          }}
        />
      );
      default: return null;
    }
  };

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: PurchaseOrder, colSpan: number): ReactNode =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-50">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.poNumber}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => { setOrders((p) => p.filter((o) => o.id !== row.id)); setDeleteId(null); }}
                className="px-3 py-1 bg-red-500 text-white text-[10px] font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1 bg-white text-gray-700 text-[10px] font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </td>
      </tr>
    );

  // ── Status bar ────────────────────────────────────────────────────────────────

  const statusBar = (
    <>
      <div className="flex items-center gap-4 text-[10px] text-gray-500">
        <span>Count: <strong className="text-gray-700 font-semibold">{filteredOrders.length}</strong></span>
        <span className="text-gray-300">|</span>
        <span>Total Value: <strong className="text-gray-700 font-semibold">${totalValue.toLocaleString()}</strong></span>
        <span className="text-gray-300">|</span>
        <span>Created: <strong className="text-emerald-600 font-semibold">{orders.filter((o) => o.status === "created").length}</strong></span>
        <span className="text-gray-300">·</span>
        <span>Pending: <strong className="text-amber-600 font-semibold">{orders.filter((o) => o.status === "pending").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />
      <SecondaryNav />

      {/* ═══ WHITE PAGE HEADER ═══ */}
      <DashboardPageHeader
        title="Purchase Orders"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Purchase Orders" },
        ]}
        summary={`${orders.length} total · ${orders.filter((o) => o.status === "pending").length} pending`}
        buttonText="Create PO"
        buttonHref="/purchase-order/create"
      />

      {/* ═══ STAT TILES ═══ */}
      <div className="px-6 pt-4 pb-0 bg-[#eaecf1] grid grid-cols-4 gap-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ═══ TABLE SECTION ═══ */}
      <main className="flex-1 px-6 pt-3 pb-4 bg-[#eaecf1]">

        {/* ── Tabs + Controls ── */}
        <div className="flex items-center px-1 pb-2 gap-2">
          <TabBar
            tabs={TABS.map((tab) => ({
              label: tab.label,
              count: tab.statuses
                ? orders.filter((o) => tab.statuses!.includes(o.status)).length
                : orders.length,
            }))}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="flex-1" />

          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search orders…"
          />

          <div className="w-px h-4 bg-gray-300/60 shrink-0" />

          <ColumnSelector
            columns={ALL_COLS.filter((c) => c.key !== "actions")}
            visibleColumns={visibleCols}
            onToggle={toggleCol}
          />

          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8470ff] to-[#6366f1] hover:from-[#9480ff] hover:to-[#7375f5] shadow-[0_2px_10px_rgba(132,112,255,0.35)] hover:shadow-[0_4px_16px_rgba(132,112,255,0.5)] transition-all">
            <Icon name="download" size={13} />
            Export
          </button>
        </div>

        {/* ── Table ── */}
        <ExcelTable
          columns={shownCols}
          data={pagedOrders}
          rowKey={(row) => row.id}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          renderCell={renderCell}
          rowClassName={(row, i) =>
            deleteId === row.id
              ? "bg-red-50"
              : i % 2 === 0
              ? "bg-white hover:bg-[#eef3fe]"
              : "bg-[#f2f4f8] hover:bg-[#eef3fe]"
          }
          expandedRow={expandedRow}
          emptyMessage="No purchase orders found."
          statusBar={statusBar}
        />

      </main>

      {/* ═══ MORE MENU (fixed portal — escapes overflow clipping) ═══ */}
      {moreMenuId && moreMenuPos && (
        <div
          ref={moreMenuRef}
          style={{ position: "fixed", top: moreMenuPos.top, left: moreMenuPos.left, zIndex: 9999 }}
          className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-1 w-40"
        >
          {[
            { label: "View Details", href: `/purchase-order/${moreMenuId}` },
            { label: "Duplicate",    href: "#" },
            { label: "Export PDF",   href: "#" },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <button
                onClick={() => { setMoreMenuId(null); setMoreMenuPos(null); }}
                className="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </button>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
