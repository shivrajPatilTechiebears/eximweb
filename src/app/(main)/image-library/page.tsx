"use client";

import { useState, useMemo } from "react";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { SidePanel } from "@/components/layout/SidePanel";

// ── Types ─────────────────────────────────────────────────────────────────────

type DocType =
  | "COMMERCIAL INVOICE"
  | "LOADING IMAGE"
  | "BILL OF LADING"
  | "PACKING LIST"
  | "DUTY CHALLAN"
  | "CERTIFICATE OF ANALYSIS"
  | "BILL OF ENTRY"
  | "TRANSPORT DOCUMENT";

type ExplorerView = "all" | "recent" | "starred" | "trash";
type RefCategory = "Shipments" | "Purchase Orders" | "Inventory Items";

interface DocFile {
  id: string;
  name: string;
  ext: "pdf" | "jpg" | "png" | "xlsx" | "docx";
  docType: DocType;
  reference: string;
  refCategory: RefCategory;
  sizeBytes: number;
  lastModified: Date;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const ALL_FILES: DocFile[] = [
  { id: "1", name: "CI_SHP_2023_9941.pdf", ext: "pdf", docType: "COMMERCIAL INVOICE", reference: "SHP-994123", refCategory: "Shipments", sizeBytes: 2516582, lastModified: new Date("2023-10-24T11:20:00") },
  { id: "2", name: "Container_Loading_IMG_1.jpg", ext: "jpg", docType: "LOADING IMAGE", reference: "PO-2023-X9", refCategory: "Purchase Orders", sizeBytes: 4300800, lastModified: new Date("2023-10-23T16:15:00") },
  { id: "3", name: "BoL_Draft_v2.pdf", ext: "pdf", docType: "BILL OF LADING", reference: "SHP-994123", refCategory: "Shipments", sizeBytes: 1153433, lastModified: new Date("2023-10-23T09:00:00") },
  { id: "4", name: "Packing_List_X001.xlsx", ext: "xlsx", docType: "PACKING LIST", reference: "PO-100234", refCategory: "Purchase Orders", sizeBytes: 524288, lastModified: new Date("2023-10-22T14:45:00") },
  { id: "5", name: "Duty_Challan_TXN_002.pdf", ext: "pdf", docType: "DUTY CHALLAN", reference: "TXN-7721", refCategory: "Shipments", sizeBytes: 912384, lastModified: new Date("2023-10-21T11:15:00") },
  { id: "6", name: "COA_Batch_XB12.pdf", ext: "pdf", docType: "CERTIFICATE OF ANALYSIS", reference: "SHP-887001", refCategory: "Shipments", sizeBytes: 1887436, lastModified: new Date("2023-10-20T09:30:00") },
  { id: "7", name: "Bill_of_Entry_IMP_44.pdf", ext: "pdf", docType: "BILL OF ENTRY", reference: "PO-100235", refCategory: "Purchase Orders", sizeBytes: 743321, lastModified: new Date("2023-10-19T16:00:00") },
  { id: "8", name: "CI_SHP_2023_8820.pdf", ext: "pdf", docType: "COMMERCIAL INVOICE", reference: "SHP-882000", refCategory: "Shipments", sizeBytes: 2100000, lastModified: new Date("2023-10-18T12:10:00") },
  { id: "9", name: "Transport_Doc_TXN_003.pdf", ext: "pdf", docType: "TRANSPORT DOCUMENT", reference: "TXN-7890", refCategory: "Shipments", sizeBytes: 658000, lastModified: new Date("2023-10-17T14:00:00") },
  { id: "10", name: "Inventory_Check_Aug.xlsx", ext: "xlsx", docType: "PACKING LIST", reference: "INV-20234", refCategory: "Inventory Items", sizeBytes: 340000, lastModified: new Date("2023-10-16T10:45:00") },
  { id: "11", name: "Container_Photo_2.png", ext: "png", docType: "LOADING IMAGE", reference: "PO-2023-X9", refCategory: "Purchase Orders", sizeBytes: 3600000, lastModified: new Date("2023-10-15T08:30:00") },
  { id: "12", name: "Packing_List_X002.xlsx", ext: "xlsx", docType: "PACKING LIST", reference: "PO-100236", refCategory: "Purchase Orders", sizeBytes: 490000, lastModified: new Date("2023-10-14T13:20:00") },
  { id: "13", name: "BoL_Final_SHP887.pdf", ext: "pdf", docType: "BILL OF LADING", reference: "SHP-887001", refCategory: "Shipments", sizeBytes: 1350000, lastModified: new Date("2023-10-13T11:00:00") },
  { id: "14", name: "Duty_Challan_TXN_004.pdf", ext: "pdf", docType: "DUTY CHALLAN", reference: "TXN-8001", refCategory: "Shipments", sizeBytes: 820000, lastModified: new Date("2023-10-12T09:15:00") },
  { id: "15", name: "COA_Batch_XB13.pdf", ext: "pdf", docType: "CERTIFICATE OF ANALYSIS", reference: "SHP-882000", refCategory: "Shipments", sizeBytes: 2200000, lastModified: new Date("2023-10-11T14:30:00") },
];

const REF_COUNTS: Record<RefCategory, number> = {
  Shipments: 124,
  "Purchase Orders": 42,
  "Inventory Items": 89,
};

const QUICK_ACCESS: DocType[] = [
  "COMMERCIAL INVOICE",
  "PACKING LIST",
  "CERTIFICATE OF ANALYSIS",
  "BILL OF LADING",
  "BILL OF ENTRY",
  "DUTY CHALLAN",
  "TRANSPORT DOCUMENT",
];

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function formatDate(d: Date): string {
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

// ── Document type config ──────────────────────────────────────────────────────

const DOC_TYPE_CFG: Record<DocType, { badge: string; dot: string; label: string }> = {
  "COMMERCIAL INVOICE": { badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70", dot: "bg-emerald-400", label: "Commercial Invoice" },
  "LOADING IMAGE": { badge: "bg-blue-50 text-blue-700 border-blue-200/70", dot: "bg-blue-400", label: "Loading Image" },
  "BILL OF LADING": { badge: "bg-orange-50 text-orange-700 border-orange-200/70", dot: "bg-orange-400", label: "Bill of Lading" },
  "PACKING LIST": { badge: "bg-slate-100 text-slate-600 border-slate-200/80", dot: "bg-slate-400", label: "Packing List" },
  "DUTY CHALLAN": { badge: "bg-violet-50 text-violet-700 border-violet-200/70", dot: "bg-violet-400", label: "Duty Challan" },
  "CERTIFICATE OF ANALYSIS": { badge: "bg-amber-50 text-amber-700 border-amber-200/70", dot: "bg-amber-400", label: "Certificate of Analysis" },
  "BILL OF ENTRY": { badge: "bg-sky-50 text-sky-700 border-sky-200/70", dot: "bg-sky-400", label: "Bill of Entry" },
  "TRANSPORT DOCUMENT": { badge: "bg-teal-50 text-teal-700 border-teal-200/70", dot: "bg-teal-400", label: "Transport Document" },
};

function DocTypeBadge({ type }: { type: DocType }) {
  const { badge, dot, label } = DOC_TYPE_CFG[type];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border whitespace-nowrap ${badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

// ── File icon ─────────────────────────────────────────────────────────────────

function FileIcon({ ext }: { ext: DocFile["ext"] }) {
  if (ext === "pdf") {
    return (
      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-red-50 to-red-100 border border-red-200/60 shadow-sm flex items-center justify-center shrink-0">
        <span className="text-[9px] font-black text-red-500 tracking-tight">PDF</span>
      </div>
    );
  }
  if (ext === "jpg" || ext === "png") {
    return (
      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-50 to-indigo-100 border border-blue-200/60 shadow-sm flex items-center justify-center shrink-0">
        <Icon name="add_photo_alternate" size={15} className="text-blue-500" />
      </div>
    );
  }
  if (ext === "xlsx") {
    return (
      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-50 to-emerald-100 border border-emerald-200/60 shadow-sm flex items-center justify-center shrink-0">
        <span className="text-[9px] font-black text-emerald-600 tracking-tight">XLS</span>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200/60 shadow-sm flex items-center justify-center shrink-0">
      <Icon name="attachment" size={15} className="text-gray-400" />
    </div>
  );
}

// ── View toggle ────────────────────────────────────────────────────────────────

function ViewToggle({ view, onChange }: { view: "list" | "grid"; onChange: (v: "list" | "grid") => void }) {
  return (
    <div className="flex items-center gap-0.5 bg-white/70 border border-gray-200/80 rounded-lg p-0.5 shadow-sm">
      <button
        onClick={() => onChange("list")}
        className={`p-1.5 rounded transition-all ${view === "list" ? "bg-[#884D70] text-white shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/60"}`}
        title="List view"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>
      <button
        onClick={() => onChange("grid")}
        className={`p-1.5 rounded transition-all ${view === "grid" ? "bg-[#884D70] text-white shadow-sm" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/60"}`}
        title="Grid view"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ── Sidebar icons (static, module-level) ─────────────────────────────────────

const folderIcon = (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);
const clockIcon = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeWidth="2" />
  </svg>
);
const starIcon = (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const trashIcon = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeWidth="2" />
  </svg>
);
const tagIcon = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" strokeLinecap="round" strokeWidth="1.5" />
  </svg>
);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ImageLibraryPage() {
  const [explorerView, setExplorerView] = useState<ExplorerView>("all");
  const [activeRefFilter, setActiveRefFilter] = useState<RefCategory | null>(null);
  const [quickFilter, setQuickFilter] = useState<DocType | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let files = [...ALL_FILES];
    if (activeRefFilter) files = files.filter((f) => f.refCategory === activeRefFilter);
    if (quickFilter) files = files.filter((f) => f.docType === quickFilter);
    if (search) {
      const q = search.toLowerCase();
      files = files.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.reference.toLowerCase().includes(q) ||
          f.docType.toLowerCase().includes(q)
      );
    }
    return files;
  }, [activeRefFilter, quickFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allOnPageSelected = paged.length > 0 && paged.every((f) => selected.has(f.id));

  const pdfCount = ALL_FILES.filter((f) => f.ext === "pdf").length;
  const imgCount = ALL_FILES.filter((f) => f.ext === "jpg" || f.ext === "png").length;
  const xlsCount = ALL_FILES.filter((f) => f.ext === "xlsx").length;

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) paged.forEach((f) => next.delete(f.id));
      else paged.forEach((f) => next.add(f.id));
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleQuickFilter(type: DocType) {
    setQuickFilter((prev) => (prev === type ? null : type));
    setCurrentPage(1);
  }

  function handleRefFilter(cat: RefCategory) {
    setActiveRefFilter((prev) => (prev === cat ? null : cat));
    setCurrentPage(1);
  }

  function handleSearch(v: string) {
    setSearch(v);
    setCurrentPage(1);
  }

  const sidebarSections = [
    {
      label: "Explorer",
      items: [
        { icon: folderIcon, label: "All Files", count: ALL_FILES.length, active: explorerView === "all",     onClick: () => { setExplorerView("all"); setActiveRefFilter(null); } },
        { icon: clockIcon,  label: "Recent",    active: explorerView === "recent",  onClick: () => setExplorerView("recent") },
        { icon: starIcon,   label: "Starred",   active: explorerView === "starred", onClick: () => setExplorerView("starred") },
        { icon: trashIcon,  label: "Trash",     active: explorerView === "trash",   onClick: () => setExplorerView("trash") },
      ],
    },
    {
      label: "Ref. Filters",
      items: (Object.entries(REF_COUNTS) as [RefCategory, number][]).map(([cat, count]) => ({
        icon: tagIcon,
        label: cat,
        count,
        active: activeRefFilter === cat,
        onClick: () => handleRefFilter(cat),
      })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">

      <DashboardPageHeader
        title="Image Library"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Image Library" },
        ]}
        summary={`${ALL_FILES.length} documents`}
        buttonText="Upload"
        buttonHref="#"
      />

      <div className="flex flex-1">

        <SidePanel
          sections={sidebarSections}
          storage={{ usedGB: 7.2, totalGB: 10 }}
        />

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0">

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-5 py-2 border-y border-white/40 bg-white/20">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Search…"
              className="shrink-0"
            />
            <div className="w-px h-4 bg-gray-200/80 shrink-0" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 shrink-0">
              Quick Access:
            </span>
            <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
              {QUICK_ACCESS.map((type) => {
                const isActive = quickFilter === type;
                const { dot, label } = DOC_TYPE_CFG[type];
                return (
                  <button
                    key={type}
                    onClick={() => handleQuickFilter(type)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border transition-all whitespace-nowrap ${isActive
                      ? "bg-[#884D70] text-white border-[#884D70] shadow-sm"
                      : "bg-white/70 text-gray-600 border-gray-200/80 hover:border-[#884D70]/40 hover:text-[#884D70]"
                      }`}
                  >
                    {!isActive && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />}
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="w-px h-4 bg-gray-200/80 shrink-0" />
            <Button variant="cta-secondary" icon="download" className="h-7 text-[10px] shrink-0">
              Export
            </Button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="table-th w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAll}
                      className="w-3 h-3 rounded border-gray-300 accent-[#884D70] cursor-pointer"
                    />
                  </th>
                  <th className="table-th">File Name</th>
                  <th className="table-th">Document Type</th>
                  <th className="table-th">Reference</th>
                  <th className="table-th text-right">Size</th>
                  <th className="table-th">Last Modified</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#884D70]/10 to-[#884D70]/5 border border-[#884D70]/15 flex items-center justify-center">
                          <Icon name="photo_library" size={24} className="text-[#884D70]/40" />
                        </div>
                        <p className="text-[13px] font-semibold text-gray-400">No files found</p>
                        <p className="text-[11px] text-gray-300">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paged.map((file, i) => {
                    const isSel = selected.has(file.id);
                    return (
                      <tr
                        key={file.id}
                        className={`group transition-all border-l-2 ${isSel
                          ? "bg-[#884D70]/6 border-l-[#884D70]"
                          : i % 2 === 0
                            ? "bg-white/45 hover:bg-white/70 border-l-transparent hover:border-l-[#884D70]/30"
                            : "bg-white/20 hover:bg-white/50 border-l-transparent hover:border-l-[#884D70]/30"
                          }`}
                      >
                        {/* Checkbox */}
                        <td className="table-td px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSel}
                            onChange={() => toggleOne(file.id)}
                            className="w-3 h-3 rounded border-gray-300 accent-[#884D70] cursor-pointer"
                          />
                        </td>

                        {/* File name */}
                        <td className="table-td px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <FileIcon ext={file.ext} />
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-slate-700 truncate max-w-50">
                                {file.name}
                              </p>
                              <p className="text-[9px] text-gray-400 mt-0.5">{file.ext.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>

                        {/* Document type */}
                        <td className="table-td px-3 py-2.5">
                          <DocTypeBadge type={file.docType} />
                        </td>

                        {/* Reference */}
                        <td className="table-td px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#884D70] bg-[#884D70]/6 px-2 py-0.5 rounded-md">
                            {file.reference}
                          </span>
                        </td>

                        {/* Size */}
                        <td className="table-td px-3 py-2.5 text-right">
                          <span className="text-[11px] text-gray-500 tabular-nums font-medium">
                            {formatSize(file.sizeBytes)}
                          </span>
                        </td>

                        {/* Last modified */}
                        <td className="table-td px-3 py-2.5">
                          <span className="text-[11px] text-gray-500">{formatDate(file.lastModified)}</span>
                        </td>

                        {/* Actions */}
                        <td className="table-td px-3 py-2.5 text-right">
                          <div className="inline-flex items-center gap-0.5 bg-white/60 border border-gray-200/60 rounded-lg p-0.5">
                            <button
                              title="Download"
                              className="p-1.5 rounded hover:bg-[#884D70]/10 text-gray-400 hover:text-[#884D70] transition-colors"
                            >
                              <Icon name="download" size={12} />
                            </button>
                            <button
                              title="View"
                              className="p-1.5 rounded hover:bg-[#884D70]/10 text-gray-400 hover:text-[#884D70] transition-colors"
                            >
                              <Icon name="visibility" size={12} />
                            </button>
                            <button
                              title="Delete"
                              className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Icon name="delete" size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Status bar */}
          <div className="table-status-bar-glass shrink-0">
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span>
                Items: <strong className="text-gray-700 font-semibold">{filtered.length}</strong>
              </span>
              <span className="text-gray-300">·</span>
              <span>
                Selected: <strong className={`font-semibold ${selected.size > 0 ? "text-[#884D70]" : "text-gray-700"}`}>{selected.size}</strong>
              </span>
              {selected.size > 0 && (
                <>
                  <span className="text-gray-300">·</span>
                  <button
                    onClick={() => setSelected(new Set())}
                    className="text-[10px] text-[#884D70] font-semibold hover:underline"
                  >
                    Clear selection
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              <div className="w-px h-4 bg-gray-200/80 shrink-0" />
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span>View:</span>
                <ViewToggle view={view} onChange={setView} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
