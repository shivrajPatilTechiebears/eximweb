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

type PRStatus = "approved" | "pending";

interface PurchaseRequest {
  id: string; prNumber: string; prType: string; department: string;
  itemName: string; itemQty: number; estimatedPrice: string; currency: string;
  requiredDate: string; priority: string; requestedBy: string; approver: string;
  status: PRStatus;
}

const STATUS_STYLE: Record<PRStatus, string> = {
  approved: "badge-success",
  pending: "badge-warning",
};

const PURCHASE_REQUESTS: PurchaseRequest[] = [
  { id: "PR-001", prNumber: "PR-2024-00087", prType: "Material", department: "Production", itemName: "Steel Wire Mesh G12", itemQty: 150, estimatedPrice: "$12,500", currency: "USD", requiredDate: "2026-07-15", priority: "High", requestedBy: "Rohit Sharma", approver: "Aniket M.", status: "approved" },
  { id: "PR-002", prNumber: "PR-2024-00088", prType: "Consumable", department: "Warehouse", itemName: "Hydraulic Seal Kit", itemQty: 45, estimatedPrice: "$3,400", currency: "USD", requiredDate: "2026-07-20", priority: "Medium", requestedBy: "Priya N.", approver: "Aniket M.", status: "pending" },
];

const TABS: { label: string; statuses: PRStatus[] | null }[] = [
  { label: "All", statuses: null },
  { label: "Open", statuses: ["pending"] },
  { label: "Approved", statuses: ["approved"] },
];

const COLUMN_KEYS = [
  "prNumber", "prType", "itemName", "itemQty", "estimatedPrice", "currency",
  "department", "requiredDate", "priority", "requestedBy", "approver",
  "status", "actions",
] as const;

const DEFAULT_VISIBLE = new Set<string>(["prNumber", "itemName", "itemQty", "estimatedPrice", "department", "status", "actions"]);

const PAGE_SIZE = 10;

const CX = {
  statVal: "text-gray-700 font-semibold",
  statSep: "text-gray-300",
} as const;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PurchaseRequestListPage() {
  const [requests, setRequests] = useState([...PURCHASE_REQUESTS]);
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

  const filteredRequests = [...requests]
    .filter((r) => {
      if (tabStatuses && !tabStatuses.includes(r.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return r.prNumber.toLowerCase().includes(q) || r.itemName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv, undefined, { numeric: true }) : bv.localeCompare(av, undefined, { numeric: true });
    });

  const totalValue = requests.reduce((s, r) => s + parseFloat(r.estimatedPrice.replace(/[$,]/g, "")), 0);
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const pagedRequests = filteredRequests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Column definitions ────────────────────────────────────────────────────────

  const allColumns: Column<PurchaseRequest>[] = [
    {
      key: "prNumber", header: "PR Number", sortable: true, align: "left",
      cell: (row) => (
        <Link href={`/purchase-request/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
          {row.prNumber}
        </Link>
      ),
    },
    {
      key: "prType", header: "Type", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.prType}</span>,
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
      key: "estimatedPrice", header: "Est. Price", sortable: true, align: "right",
      cell: (row) => <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.estimatedPrice}</span>,
    },
    {
      key: "currency", header: "Currency", sortable: false, align: "center",
      cell: (row) => <span className="text-[11px] text-gray-600 font-medium tracking-wide">{row.currency}</span>,
    },
    {
      key: "department", header: "Department", sortable: true, align: "left",
      cell: (row) => <span className="text-[11px] text-gray-700 max-w-40 truncate block">{row.department}</span>,
    },
    {
      key: "requiredDate", header: "Required By", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.requiredDate}</span>,
    },
    {
      key: "priority", header: "Priority", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.priority}</span>,
    },
    {
      key: "requestedBy", header: "Requested By", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.requestedBy}</span>,
    },
    {
      key: "approver", header: "Approver", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.approver}</span>,
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
          viewHref={`/purchase-request/${row.id}`}
          editHref={`/purchase-request/${row.id}/edit`}
          onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
        />
      ),
    },
  ];

  const shownCols = allColumns.filter((c) => visibleCols.has(c.key));

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: PurchaseRequest, colSpan: number) =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.prNumber}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => { setRequests((p) => p.filter((r) => r.id !== row.id)); setDeleteId(null); }}
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
        <span>Count: <strong className={CX.statVal}>{filteredRequests.length}</strong></span>
        <span className={CX.statSep}>|</span>
        <span>Total Est. Value: <strong className={CX.statVal}>${totalValue.toLocaleString()}</strong></span>
        <span className={CX.statSep}>|</span>
        <span>Approved: <strong className="text-emerald-600 font-semibold">{requests.filter((r) => r.status === "approved").length}</strong></span>
        <span className={CX.statSep}>·</span>
        <span>Pending: <strong className="text-amber-600 font-semibold">{requests.filter((r) => r.status === "pending").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800">


      <main className="flex-1 px-6 pt-3 pb-4 flex flex-col gap-2">

        <div className="flex items-center justify-between gap-2 px-1">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Purchase Requests" }]} />
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearchChange} placeholder="Search requests…" />
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
            <Link href="/purchase-request/create">
              <Button variant="cta-sunset" icon="add">Create PR</Button>
            </Link>
          </div>
        </div>

        <TabbedTable
          selectedIndex={activeTab}
          onChange={handleTabChange}
          tabs={TABS.map((tab) => ({
            label: tab.label,
            count: tab.statuses
              ? requests.filter((r) => tab.statuses!.includes(r.status)).length
              : requests.length,
            content: (
              <ExcelTable<PurchaseRequest>
                columns={shownCols}
                data={pagedRequests}
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
                emptyMessage="No purchase requests found."
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
