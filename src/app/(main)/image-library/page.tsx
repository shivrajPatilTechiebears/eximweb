"use client";

import { useState, useMemo, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { SidePanel } from "@/components/layout/SidePanel";
import { Checkbox } from "@/components/ui/Checkbox";
import { TagBadge } from "@/components/ui/TagBadge";
import { FileTypeIcon, type FileExt } from "@/components/ui/FileTypeIcon";
import { ViewToggle, type ViewMode } from "@/components/ui/ViewToggle";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { ToggleChip } from "@/components/ui/ToggleChip";

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
  ext: FileExt;
  docType: DocType;
  reference: string;
  refCategory: RefCategory;
  sizeBytes: number;
  lastModified: Date;
  /** Real preview image for the file, when one exists — falls back to the ext placeholder otherwise */
  thumbnailUrl?: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────────

const ALL_FILES: DocFile[] = [
  { id: "1", name: "CI_SHP_2023_9941.pdf", ext: "pdf", docType: "COMMERCIAL INVOICE", reference: "SHP-994123", refCategory: "Shipments", sizeBytes: 2516582, lastModified: new Date("2023-10-24T11:20:00") },
  { id: "2", name: "Container_Loading_IMG_1.jpg", ext: "jpg", docType: "LOADING IMAGE", reference: "PO-2023-X9", refCategory: "Purchase Orders", sizeBytes: 4300800, lastModified: new Date("2023-10-23T16:15:00"), thumbnailUrl: "/images/gallery/1.jpg" },
  { id: "3", name: "BoL_Draft_v2.pdf", ext: "pdf", docType: "BILL OF LADING", reference: "SHP-994123", refCategory: "Shipments", sizeBytes: 1153433, lastModified: new Date("2023-10-23T09:00:00") },
  { id: "4", name: "Packing_List_X001.xlsx", ext: "xlsx", docType: "PACKING LIST", reference: "PO-100234", refCategory: "Purchase Orders", sizeBytes: 524288, lastModified: new Date("2023-10-22T14:45:00") },
  { id: "5", name: "Duty_Challan_TXN_002.pdf", ext: "pdf", docType: "DUTY CHALLAN", reference: "TXN-7721", refCategory: "Shipments", sizeBytes: 912384, lastModified: new Date("2023-10-21T11:15:00") },
  { id: "6", name: "COA_Batch_XB12.pdf", ext: "pdf", docType: "CERTIFICATE OF ANALYSIS", reference: "SHP-887001", refCategory: "Shipments", sizeBytes: 1887436, lastModified: new Date("2023-10-20T09:30:00") },
  { id: "7", name: "Bill_of_Entry_IMP_44.pdf", ext: "pdf", docType: "BILL OF ENTRY", reference: "PO-100235", refCategory: "Purchase Orders", sizeBytes: 743321, lastModified: new Date("2023-10-19T16:00:00") },
  { id: "8", name: "CI_SHP_2023_8820.pdf", ext: "pdf", docType: "COMMERCIAL INVOICE", reference: "SHP-882000", refCategory: "Shipments", sizeBytes: 2100000, lastModified: new Date("2023-10-18T12:10:00") },
  { id: "9", name: "Transport_Doc_TXN_003.pdf", ext: "pdf", docType: "TRANSPORT DOCUMENT", reference: "TXN-7890", refCategory: "Shipments", sizeBytes: 658000, lastModified: new Date("2023-10-17T14:00:00") },
  { id: "10", name: "Inventory_Check_Aug.xlsx", ext: "xlsx", docType: "PACKING LIST", reference: "INV-20234", refCategory: "Inventory Items", sizeBytes: 340000, lastModified: new Date("2023-10-16T10:45:00") },
  { id: "11", name: "Container_Photo_2.png", ext: "png", docType: "LOADING IMAGE", reference: "PO-2023-X9", refCategory: "Purchase Orders", sizeBytes: 3600000, lastModified: new Date("2023-10-15T08:30:00"), thumbnailUrl: "/images/gallery/4.png" },
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
  return <TagBadge label={label} badgeClassName={badge} dotClassName={dot} />;
}

// ── Grid card ─────────────────────────────────────────────────────────────────

function GridCard({ file, selected, onToggle }: { file: DocFile; selected: boolean; onToggle: () => void }) {
  const { dot, label } = DOC_TYPE_CFG[file.docType];

  return (
    <div
      className={`doc-card group ${selected ? "doc-card-selected" : ""}`}
      onClick={onToggle}
      title={`${file.name}\n${label} · ${file.reference}\n${formatSize(file.sizeBytes)} · ${formatDate(file.lastModified)}`}
    >
      {/* Checkbox */}
      <div className="absolute top-1.5 left-1.5 z-10">
        <Checkbox checked={selected} onChange={onToggle} />
      </div>

      {/* Hover actions */}
      <div className="absolute top-1.5 right-1.5 z-10 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="icon-brand" title="Download" onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-md bg-white/90 border border-gray-200/60 shadow-sm">
          <Icon name="download" size={10} />
        </Button>
        <Button variant="icon-brand" title="View" onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-md bg-white/90 border border-gray-200/60 shadow-sm">
          <Icon name="visibility" size={10} />
        </Button>
        <Button variant="icon-brand-danger" title="Delete" onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-md bg-white/90 border border-gray-200/60 shadow-sm">
          <Icon name="delete" size={10} />
        </Button>
      </div>

      {/* Preview strip */}
      <FileTypeIcon ext={file.ext} variant="tile" compact thumbnailUrl={file.thumbnailUrl} />

      {/* Info */}
      <div className="px-2 py-1.5">
        <p className="text-[10.5px] font-semibold text-slate-700 truncate leading-tight">{file.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
          <span className="text-[9px] text-slate-500 truncate">{file.reference}</span>
        </div>
      </div>
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

// ── Fit-count measuring: shows only as many items as fully fit on one line ─────

function useVisibleFitCount(itemCount: number, gapPx: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(itemCount);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const recalc = () => {
      const available = container.clientWidth;
      const items = Array.from(measure.children) as HTMLElement[];
      let used = 0;
      let fit = 0;
      for (const item of items) {
        const next = used + item.offsetWidth + (fit > 0 ? gapPx : 0);
        if (next > available) break;
        used = next;
        fit++;
      }
      setVisibleCount(fit);
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(container);
    return () => ro.disconnect();
  }, [itemCount, gapPx]);

  return { containerRef, measureRef, visibleCount };
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ImageLibraryPage() {
  const [explorerView, setExplorerView] = useState<ExplorerView>("all");
  const [activeRefFilter, setActiveRefFilter] = useState<RefCategory | null>(null);
  const [quickFilter, setQuickFilter] = useState<DocType | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [view, setView] = useState<ViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const { containerRef: quickAccessRef, measureRef: quickAccessMeasureRef, visibleCount: quickAccessVisibleCount } =
    useVisibleFitCount(QUICK_ACCESS.length, 4);

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

  const fileColumns: Column<DocFile>[] = [
    {
      key: "select",
      header: "",
      cell: (file) => <Checkbox checked={selected.has(file.id)} onChange={() => toggleOne(file.id)} />,
    },
    {
      key: "name",
      header: "File Name",
      cell: (file) => (
        <div className="flex items-center gap-2.5">
          <FileTypeIcon ext={file.ext} thumbnailUrl={file.thumbnailUrl} />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-700 truncate max-w-50">{file.name}</p>
            <p className="text-[9px] text-slate-600 mt-0.5">{file.ext.toUpperCase()}</p>
          </div>
        </div>
      ),
    },
    {
      key: "docType",
      header: "Document Type",
      cell: (file) => <DocTypeBadge type={file.docType} />,
    },
    {
      key: "reference",
      header: "Reference",
      cell: (file) => (
        <span className="doc-ref-chip inline-flex items-center gap-1 text-[11px] px-2 py-0.5">
          {file.reference}
        </span>
      ),
    },
    {
      key: "size",
      header: "Size",
      align: "right",
      cell: (file) => (
        <div className="text-right">
          <span className="text-[11px] text-slate-600 tabular-nums font-medium">{formatSize(file.sizeBytes)}</span>
        </div>
      ),
    },
    {
      key: "lastModified",
      header: "Last Modified",
      cell: (file) => <span className="text-[11px] text-slate-600">{formatDate(file.lastModified)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: () => (
        <div className="flex justify-end">
          <div className="inline-flex items-center gap-0.5 bg-white/60 border border-gray-200/60 rounded-lg p-0.5">
            <Button variant="icon-brand" title="Download" className="p-1.5 rounded">
              <Icon name="download" size={12} />
            </Button>
            <Button variant="icon-brand" title="View" className="p-1.5 rounded">
              <Icon name="visibility" size={12} />
            </Button>
            <Button variant="icon-brand-danger" title="Delete" className="p-1.5 rounded">
              <Icon name="delete" size={12} />
            </Button>
          </div>
        </div>
      ),
    },
  ];

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
    <div className="flex-1 flex flex-col antialiased text-slate-800">

      <div className="flex flex-1">

        <SidePanel
          topContent={<Breadcrumbs variant="muted" items={[{ label: "Dashboard", href: "/" }, { label: "Image Library" }]} />}
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
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 shrink-0">
              Quick Access:
            </span>
            <div ref={quickAccessRef} className="relative flex-1 min-w-0 h-5">
              {/* Hidden measuring row: renders every chip at natural width to decide how many fit */}
              <div
                ref={quickAccessMeasureRef}
                className="absolute invisible flex items-center gap-1 whitespace-nowrap pointer-events-none"
                aria-hidden="true"
              >
                {QUICK_ACCESS.map((type) => {
                  const { dot, label } = DOC_TYPE_CFG[type];
                  return <ToggleChip key={type} label={label} active={quickFilter === type} onClick={() => {}} dotClassName={dot} />;
                })}
              </div>

              <div className="flex items-center gap-1">
                {QUICK_ACCESS.slice(0, quickAccessVisibleCount).map((type) => {
                  const { dot, label } = DOC_TYPE_CFG[type];
                  return (
                    <ToggleChip
                      key={type}
                      label={label}
                      active={quickFilter === type}
                      onClick={() => handleQuickFilter(type)}
                      dotClassName={dot}
                    />
                  );
                })}
              </div>
            </div>
            <div className="w-px h-4 bg-gray-200/80 shrink-0" />
            <Button variant="cta-secondary" icon="download" className="h-7 text-[10px] shrink-0">
              Export
            </Button>
            <Link href="#">
              <Button variant="cta-sunset" icon="add" className="h-7 text-[10px] shrink-0">Upload</Button>
            </Link>
            <ViewToggle view={view} onChange={setView} className="shrink-0" />
          </div>

          {/* Table / Grid */}
          <div className="flex-1 overflow-auto">
            {view === "list" ? (
              <ExcelTable<DocFile>
                columns={fileColumns}
                data={paged}
                rowKey={(file) => file.id}
                rowClassName={(file, i) =>
                  selected.has(file.id)
                    ? "doc-row-selected"
                    : i % 2 === 0
                      ? "bg-white/45 hover:bg-white/70 doc-row-hover"
                      : "bg-white/20 hover:bg-white/50 doc-row-hover"
                }
                emptyMessage="No files found — try adjusting your search or filters"
                className=""
                cellClassName="px-3 py-2.5"
                headerContent={{ select: <Checkbox checked={allOnPageSelected} onChange={toggleAll} /> }}
              />
            ) : (
              /* ── Grid view ── */
              paged.length === 0 ? (
                <EmptyState
                  icon="photo_library"
                  title="No files found"
                  description="Try adjusting your search or filters"
                />
              ) : (
                <div className="p-3 grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2.5">
                  {paged.map((file) => (
                    <GridCard
                      key={file.id}
                      file={file}
                      selected={selected.has(file.id)}
                      onToggle={() => toggleOne(file.id)}
                    />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Status bar */}
          <div className="table-status-bar-glass shrink-0">
            <div className="flex items-center gap-3 text-[10px] text-slate-600">
              <span>
                Items: <strong className="text-slate-700 font-semibold">{filtered.length}</strong>
              </span>
              <span className="text-slate-400">·</span>
              <span>
                Selected: <strong className={`font-semibold ${selected.size > 0 ? "doc-link-brand" : "text-slate-700"}`}>{selected.size}</strong>
              </span>
              {view === "grid" && paged.length > 0 && !allOnPageSelected && (
                <>
                  <span className="text-slate-400">·</span>
                  <Button variant="text-brand" onClick={toggleAll} className="text-[10px]">
                    Select all
                  </Button>
                </>
              )}
              {selected.size > 0 && (
                <>
                  <span className="text-slate-400">·</span>
                  <Button variant="text-brand" onClick={() => setSelected(new Set())} className="text-[10px]">
                    Clear selection
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
