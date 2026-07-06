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
import { GlassModal } from "@/components/ui/GlassModal";
import { TestSampleForm, type TestSampleFields } from "@/components/test-sample/TestSampleForm";

// ── Data ───────────────────────────────────────────────────────────────────────

type TestSampleStatus = "pending" | "open" | "failed";

interface TestSample {
  id: string; sampleNo: string; itemName: string; sampleQty: number;
  uom: string; sampleBatchNo: string; status: TestSampleStatus;
  poId: string; shipmentNumber: string;
  sampleImages: { src: string; label: string }[];
  documents: { label: string }[];
  testReports: { label: string }[];
}

const STATUS_STYLE: Record<TestSampleStatus, string> = {
  pending: "bg-gray-100 text-gray-600",
  open: "badge-info",
  failed: "bg-red-50 text-red-600",
};

const TEST_SAMPLES: TestSample[] = [
  {
    id: "TS-001", sampleNo: "SM-00012", itemName: "Steel-01", sampleQty: 5, uom: "Kg", sampleBatchNo: "Batch-1", status: "pending",
    poId: "PO-001", shipmentNumber: "SHP-2024-0001",
    sampleImages: [{ src: "/images/gallery/1.jpg", label: "Img-001" }, { src: "/images/gallery/2.png", label: "Img-002" }],
    documents: [{ label: "Invoice-PDF" }],
    testReports: [],
  },
  {
    id: "TS-002", sampleNo: "SM-00012", itemName: "Iron-01", sampleQty: 5, uom: "Kg", sampleBatchNo: "Batch-2", status: "open",
    poId: "PO-001", shipmentNumber: "SHP-2024-0001",
    sampleImages: [{ src: "/images/gallery/3.png", label: "Img-003" }],
    documents: [{ label: "Packing-List-PDF" }],
    testReports: [],
  },
  {
    id: "TS-003", sampleNo: "SM-00012", itemName: "Iron-01", sampleQty: 5, uom: "Kg", sampleBatchNo: "Batch-2", status: "failed",
    poId: "PO-002", shipmentNumber: "SHP-2024-0002",
    sampleImages: [{ src: "/images/gallery/4.png", label: "Img-004" }],
    documents: [{ label: "Invoice-PDF" }],
    testReports: [{ label: "Report-001" }, { label: "Report-002" }],
  },
];

const TABS: { label: string; statuses: TestSampleStatus[] | null }[] = [
  { label: "All", statuses: null },
  { label: "Pending", statuses: ["pending"] },
  { label: "Open", statuses: ["open"] },
  { label: "Failed", statuses: ["failed"] },
];

const COLUMN_KEYS = [
  "sampleNo", "itemName", "sampleQty", "uom", "sampleBatchNo", "status", "actions",
] as const;

const DEFAULT_VISIBLE = new Set<string>(COLUMN_KEYS);

const PAGE_SIZE = 10;

const CX = {
  statVal: "text-gray-700 font-semibold",
  statSep: "text-gray-300",
} as const;

// ── Page ───────────────────────────────────────────────────────────────────────

type ModalState = { mode: "create" | "view" | "edit"; row?: TestSample };

const MODAL_TITLE: Record<ModalState["mode"], string> = {
  create: "Create Sample",
  view: "View Test Sample Details",
  edit: "Edit Test Sample Details",
};

const toFields = (row: TestSample): TestSampleFields => ({
  poId: row.poId, shipmentNumber: row.shipmentNumber, itemName: row.itemName,
  sampleQty: String(row.sampleQty), sampleBatchNo: row.sampleBatchNo, uom: row.uom,
  sampleImages: row.sampleImages, documents: row.documents, testReports: row.testReports,
});

export default function TestSampleListPage() {
  const [samples, setSamples] = useState([...TEST_SAMPLES]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);
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

  const filteredSamples = [...samples]
    .filter((s) => {
      if (tabStatuses && !tabStatuses.includes(s.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return s.sampleNo.toLowerCase().includes(q) || s.itemName.toLowerCase().includes(q) || s.sampleBatchNo.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv, undefined, { numeric: true }) : bv.localeCompare(av, undefined, { numeric: true });
    });

  const totalPages = Math.max(1, Math.ceil(filteredSamples.length / PAGE_SIZE));
  const pagedSamples = filteredSamples.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Column definitions ────────────────────────────────────────────────────────

  const allColumns: Column<TestSample>[] = [
    {
      key: "sampleNo", header: "Sample No", sortable: true, align: "left",
      cell: (row) => (
        <button
          onClick={() => setModal({ mode: "view", row })}
          className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2"
        >
          {row.sampleNo}
        </button>
      ),
    },
    {
      key: "itemName", header: "Item Name", sortable: true, align: "left",
      cell: (row) => <span className="text-[11px] text-slate-800 font-medium">{row.itemName}</span>,
    },
    {
      key: "sampleQty", header: "Sample Qty", sortable: true, align: "right",
      cell: (row) => <span className="text-[11px] font-semibold text-slate-800 tabular-nums">{row.sampleQty}</span>,
    },
    {
      key: "uom", header: "UOM", sortable: false, align: "center",
      cell: (row) => <span className="text-[11px] text-gray-600 font-medium tracking-wide">{row.uom}</span>,
    },
    {
      key: "sampleBatchNo", header: "Sample Batch No", sortable: true, align: "left",
      cell: (row) => <span className="cell-text font-semibold">{row.sampleBatchNo}</span>,
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
          onView={() => setModal({ mode: "view", row })}
          onEdit={() => setModal({ mode: "edit", row })}
          onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
        />
      ),
    },
  ];

  const shownCols = allColumns.filter((c) => visibleCols.has(c.key));

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: TestSample, colSpan: number) =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.sampleNo}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => { setSamples((p) => p.filter((s) => s.id !== row.id)); setDeleteId(null); }}
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
        <span>Count: <strong className={CX.statVal}>{filteredSamples.length}</strong></span>
        <span className={CX.statSep}>|</span>
        <span>Pending: <strong className="text-gray-600 font-semibold">{samples.filter((s) => s.status === "pending").length}</strong></span>
        <span className={CX.statSep}>·</span>
        <span>Open: <strong className="text-sky-600 font-semibold">{samples.filter((s) => s.status === "open").length}</strong></span>
        <span className={CX.statSep}>·</span>
        <span>Failed: <strong className="text-red-600 font-semibold">{samples.filter((s) => s.status === "failed").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800">


      <main className="flex-1 px-6 pt-3 pb-4 flex flex-col gap-2">

        <div className="flex items-center justify-between gap-2 px-1">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Test Sample" }]} />
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearchChange} placeholder="Search samples…" />
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
            <Button variant="cta-sunset" icon="add" onClick={() => setModal({ mode: "create" })}>
              Create Sample
            </Button>
          </div>
        </div>

        <TabbedTable
          selectedIndex={activeTab}
          onChange={handleTabChange}
          tabs={TABS.map((tab) => ({
            label: tab.label,
            count: tab.statuses
              ? samples.filter((s) => tab.statuses!.includes(s.status)).length
              : samples.length,
            content: (
              <ExcelTable<TestSample>
                columns={shownCols}
                data={pagedSamples}
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
                emptyMessage="No test samples found."
                statusBar={statusBar}
                className=""
                statusBarClassName="table-status-bar-glass"
              />
            ),
          }))}
        />

      </main>

      <GlassModal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal ? MODAL_TITLE[modal.mode] : ""}
        icon="description"
      >
        {modal && (
          <TestSampleForm
            mode={modal.mode}
            initial={modal.row ? toFields(modal.row) : undefined}
            onCancel={() => setModal(null)}
            onSubmit={(fields) => {
              if (modal.mode === "create") {
                const nextNum = Math.max(0, ...samples.map((s) => parseInt(s.id.replace("TS-", ""), 10) || 0)) + 1;
                setSamples((prev) => [...prev, {
                  id: `TS-${String(nextNum).padStart(3, "0")}`,
                  sampleNo: `SM-${String(10011 + nextNum).padStart(5, "0")}`,
                  itemName: fields.itemName,
                  sampleQty: Number(fields.sampleQty) || 0,
                  uom: fields.uom,
                  sampleBatchNo: fields.sampleBatchNo,
                  status: "pending",
                  poId: fields.poId,
                  shipmentNumber: fields.shipmentNumber,
                  sampleImages: fields.sampleImages,
                  documents: fields.documents,
                  testReports: [],
                }]);
              } else if (modal.mode === "edit" && modal.row) {
                const rowId = modal.row.id;
                setSamples((prev) => prev.map((s) => (s.id === rowId ? {
                  ...s,
                  itemName: fields.itemName,
                  sampleQty: Number(fields.sampleQty) || 0,
                  uom: fields.uom,
                  sampleBatchNo: fields.sampleBatchNo,
                  poId: fields.poId,
                  shipmentNumber: fields.shipmentNumber,
                  sampleImages: fields.sampleImages,
                  documents: fields.documents,
                  testReports: fields.testReports,
                } : s)));
              }
              setModal(null);
            }}
          />
        )}
      </GlassModal>
    </div>
  );
}
