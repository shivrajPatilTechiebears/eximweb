"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TableActions } from "@/components/table/TableActions";
import { ColumnSelector } from "@/components/ui/ColumnSelector";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { TabbedTable } from "@/components/table/TabbedTable";
import { ViewWeighmentModal, type WeighmentDetail } from "@/components/weighment/ViewWeighmentModal";
import { EditWeighmentModal, type WeighmentWeights } from "@/components/weighment/EditWeighmentModal";

// ── Data ───────────────────────────────────────────────────────────────────────

type WeighmentStatus = "reported" | "in_weighment" | "completed" | "picked";

interface Weighment {
  id: string; itemName: string; shipmentQty: number; price: string; uom: string;
  taxCode: string; packagingType: string; driver: string; truck: string; status: WeighmentStatus;
  grossWeight: string; emptyWeight: string; weightUom: string;
}

const STATUS_LABEL: Record<WeighmentStatus, string> = {
  reported: "Reported",
  in_weighment: "In Weighment",
  completed: "Completed",
  picked: "Picked",
};

const STATUS_STYLE: Record<WeighmentStatus, string> = {
  reported: "badge-info",
  in_weighment: "bg-indigo-50 text-indigo-600",
  completed: "badge-success",
  picked: "bg-violet-50 text-violet-600",
};

const WEIGHMENTS: Weighment[] = [
  { id: "WG-001", itemName: "Steel-01", shipmentQty: 30, price: "$100", uom: "Kg", taxCode: "GST", packagingType: "Box Packaging", driver: "—", truck: "—", status: "reported", grossWeight: "", emptyWeight: "", weightUom: "Tons" },
  { id: "WG-002", itemName: "Steel-01", shipmentQty: 30, price: "$100", uom: "Kg", taxCode: "GST", packagingType: "Box Packaging", driver: "Shivam", truck: "MH-05-1244", status: "in_weighment", grossWeight: "", emptyWeight: "", weightUom: "Tons" },
  { id: "WG-003", itemName: "Steel-01", shipmentQty: 30, price: "$100", uom: "Kg", taxCode: "GST", packagingType: "Box Packaging", driver: "Farben", truck: "MH-05-1244", status: "completed", grossWeight: "8.4", emptyWeight: "3.1", weightUom: "Tons" },
  { id: "WG-004", itemName: "Steel-01", shipmentQty: 30, price: "$100", uom: "Kg", taxCode: "GST", packagingType: "Box Packaging", driver: "Farben", truck: "MH-05-1244", status: "picked", grossWeight: "8.4", emptyWeight: "3.1", weightUom: "Tons" },
];

const TABS: { label: string; statuses: WeighmentStatus[] | null }[] = [
  { label: "All", statuses: null },
  { label: "Reported", statuses: ["reported"] },
  { label: "In Weighment", statuses: ["in_weighment"] },
  { label: "Completed", statuses: ["completed"] },
  { label: "Picked", statuses: ["picked"] },
];

const COLUMN_KEYS = [
  "itemName", "shipmentQty", "price", "uom", "taxCode", "packagingType", "driver", "truck", "status", "actions",
] as const;

const DEFAULT_VISIBLE = new Set<string>(COLUMN_KEYS);

const PAGE_SIZE = 10;

const CX = {
  statVal: "text-gray-700 font-semibold",
  statSep: "text-gray-300",
} as const;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function WeighmentListPage() {
  const [weighments, setWeighments] = useState([...WEIGHMENTS]);
  const [viewWeighment, setViewWeighment] = useState<WeighmentDetail | null>(null);
  const [editRowId, setEditRowId] = useState<string | null>(null);
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

  const filteredWeighments = [...weighments]
    .filter((w) => {
      if (tabStatuses && !tabStatuses.includes(w.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return w.itemName.toLowerCase().includes(q) || w.driver.toLowerCase().includes(q) || w.truck.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv, undefined, { numeric: true }) : bv.localeCompare(av, undefined, { numeric: true });
    });

  const totalPages = Math.max(1, Math.ceil(filteredWeighments.length / PAGE_SIZE));
  const pagedWeighments = filteredWeighments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Column definitions ────────────────────────────────────────────────────────

  const allColumns: Column<Weighment>[] = [
    {
      key: "itemName", header: "Item Name", sortable: true, align: "left",
      cell: (row) => <span className="text-[11px] text-slate-800 font-medium">{row.itemName}</span>,
    },
    {
      key: "shipmentQty", header: "Shipment Qty", sortable: true, align: "right",
      cell: (row) => <span className="text-[11px] font-semibold text-slate-800 tabular-nums">{row.shipmentQty}</span>,
    },
    {
      key: "price", header: "Price", sortable: true, align: "right",
      cell: (row) => <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.price}</span>,
    },
    {
      key: "uom", header: "UOM", sortable: false, align: "center",
      cell: (row) => <span className="text-[11px] text-gray-600 font-medium tracking-wide">{row.uom}</span>,
    },
    {
      key: "taxCode", header: "Tax Code", sortable: true, align: "center",
      cell: (row) => <span className="cell-text">{row.taxCode}</span>,
    },
    {
      key: "packagingType", header: "Packaging Type", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.packagingType}</span>,
    },
    {
      key: "driver", header: "Driver", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.driver}</span>,
    },
    {
      key: "truck", header: "Truck", sortable: false, align: "left",
      cell: (row) => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.truck}</span>,
    },
    {
      key: "status", header: "Status", sortable: true, align: "center",
      cell: (row) => (
        <span className={`status-badge ${STATUS_STYLE[row.status]}`}>
          {STATUS_LABEL[row.status]}
        </span>
      ),
    },
    {
      key: "actions", header: "Actions", sortable: false, align: "right",
      cell: (row) => (
        <TableActions
          onView={() => setViewWeighment({
            itemName: row.itemName, shipmentQty: row.shipmentQty, price: row.price, uom: row.uom,
            taxCode: row.taxCode, packagingType: row.packagingType, driver: row.driver, truck: row.truck,
            status: STATUS_LABEL[row.status],
          })}
          onEdit={() => setEditRowId(row.id)}
        />
      ),
    },
  ];

  const editRow = weighments.find((w) => w.id === editRowId) ?? null;

  const shownCols = allColumns.filter((c) => visibleCols.has(c.key));

  // ── Status bar ────────────────────────────────────────────────────────────────

  const statusBar = (
    <>
      <div className="flex items-center gap-4 text-[10px] text-gray-500">
        <span>Count: <strong className={CX.statVal}>{filteredWeighments.length}</strong></span>
        <span className={CX.statSep}>|</span>
        <span>Reported: <strong className="text-sky-600 font-semibold">{weighments.filter((w) => w.status === "reported").length}</strong></span>
        <span className={CX.statSep}>·</span>
        <span>In Weighment: <strong className="text-indigo-600 font-semibold">{weighments.filter((w) => w.status === "in_weighment").length}</strong></span>
        <span className={CX.statSep}>·</span>
        <span>Completed: <strong className="text-emerald-600 font-semibold">{weighments.filter((w) => w.status === "completed").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800">

      <main className="flex-1 px-6 pt-3 pb-4 flex flex-col gap-2">

        <div className="flex items-center justify-between gap-2 px-1">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Weighment" }]} />
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearchChange} placeholder="Search weighments…" />
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
          </div>
        </div>

        <TabbedTable
          selectedIndex={activeTab}
          onChange={handleTabChange}
          tabs={TABS.map((tab) => ({
            label: tab.label,
            count: tab.statuses
              ? weighments.filter((w) => tab.statuses!.includes(w.status)).length
              : weighments.length,
            content: (
              <ExcelTable<Weighment>
                columns={shownCols}
                data={pagedWeighments}
                rowKey={(row) => row.id}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                rowClassName={(_row, i) =>
                  i % 2 === 0 ? "bg-white/45 hover:bg-white/70" : "bg-white/20 hover:bg-white/50"
                }
                emptyMessage="No weighments found."
                statusBar={statusBar}
                className=""
                statusBarClassName="table-status-bar-glass"
              />
            ),
          }))}
        />

      </main>

      <ViewWeighmentModal
        isOpen={viewWeighment !== null}
        onClose={() => setViewWeighment(null)}
        weighment={viewWeighment}
      />

      <EditWeighmentModal
        isOpen={editRow !== null}
        onClose={() => setEditRowId(null)}
        initial={editRow ?? { grossWeight: "", emptyWeight: "", weightUom: "Tons" }}
        onSave={(weights: WeighmentWeights) => {
          setWeighments((prev) => prev.map((w) => (w.id === editRowId ? { ...w, ...weights } : w)));
        }}
      />
    </div>
  );
}
