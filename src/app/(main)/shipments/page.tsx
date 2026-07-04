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

type ShipmentStatus =
  | "draft" | "scheduled" | "in_transit" | "at_port" | "customs_clearance"
  | "out_for_delivery" | "delivered" | "partially_delivered" | "cancelled";

interface Shipment {
  id: string; shipmentNumber: string; poId: string; poNumber: string; vendorName: string;
  shipmentType: string; transportMode: string;
  transporterName: string; driverName: string; assetNumber: string;
  originCity: string; destinationCity: string;
  estimatedDeparture: string; actualDeparture: string;
  estimatedArrival: string; actualArrival: string;
  trackingNumber: string; status: ShipmentStatus;
}

const STATUS_LABEL: Record<ShipmentStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  in_transit: "In Transit",
  at_port: "At Port",
  customs_clearance: "Customs Clearance",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  partially_delivered: "Partially Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<ShipmentStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  scheduled: "badge-info",
  in_transit: "badge-warning",
  at_port: "badge-info",
  customs_clearance: "badge-warning",
  out_for_delivery: "badge-warning",
  delivered: "badge-success",
  partially_delivered: "badge-warning",
  cancelled: "bg-red-50 text-red-600",
};

const SHIPMENTS: Shipment[] = [
  {
    id: "SHP-001", shipmentNumber: "SHP-2024-0001", poId: "PO-001", poNumber: "PO-2024-00139",
    vendorName: "Global Polymers Ltd", shipmentType: "Import", transportMode: "Ship",
    transporterName: "Maersk Logistics India", driverName: "—", assetNumber: "MEDU8822910",
    originCity: "Shanghai, CN", destinationCity: "Mumbai Port Terminal 2",
    estimatedDeparture: "2026-07-05", actualDeparture: "2026-07-05",
    estimatedArrival: "2026-07-20", actualArrival: "—",
    trackingNumber: "MAEU771822", status: "in_transit",
  },
  {
    id: "SHP-002", shipmentNumber: "SHP-2024-0002", poId: "PO-002", poNumber: "PO-2024-00140",
    vendorName: "Apex Systems Pvt Ltd", shipmentType: "Domestic", transportMode: "Truck",
    transporterName: "SafeLogistics Pvt Ltd", driverName: "Shivraj Patil", assetNumber: "MH-05-1234",
    originCity: "Mumbai Port Terminal 2", destinationCity: "Delhi Warehouse A",
    estimatedDeparture: "2026-07-21", actualDeparture: "—",
    estimatedArrival: "2026-07-24", actualArrival: "—",
    trackingNumber: "SFLG-90231", status: "scheduled",
  },
];

const TABS: { label: string; statuses: ShipmentStatus[] | null }[] = [
  { label: "All", statuses: null },
  { label: "Confirmed", statuses: ["scheduled"] },
  { label: "Intransit", statuses: ["in_transit", "at_port", "customs_clearance", "out_for_delivery"] },
];

const COLUMN_KEYS = [
  "shipmentNumber", "poNumber", "vendorName", "shipmentType", "transportMode", "transporterName", "driverName",
  "assetNumber", "originCity", "destinationCity", "estimatedDeparture", "actualDeparture",
  "estimatedArrival", "actualArrival", "trackingNumber", "status", "actions",
] as const;

const DEFAULT_VISIBLE = new Set<string>(["shipmentNumber", "poNumber", "vendorName", "shipmentType", "originCity", "destinationCity", "transportMode", "status", "actions"]);

const PAGE_SIZE = 10;

const CX = {
  statVal: "text-gray-700 font-semibold",
  statSep: "text-gray-300",
} as const;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ShipmentsListPage() {
  const [shipments, setShipments] = useState([...SHIPMENTS]);
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

  const filteredShipments = [...shipments]
    .filter((s) => {
      if (tabStatuses && !tabStatuses.includes(s.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return s.shipmentNumber.toLowerCase().includes(q) || s.poNumber.toLowerCase().includes(q) || s.vendorName.toLowerCase().includes(q) || s.originCity.toLowerCase().includes(q) || s.destinationCity.toLowerCase().includes(q) || s.trackingNumber.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv, undefined, { numeric: true }) : bv.localeCompare(av, undefined, { numeric: true });
    });

  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / PAGE_SIZE));
  const pagedShipments = filteredShipments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // ── Column definitions ────────────────────────────────────────────────────────

  const allColumns: Column<Shipment>[] = [
    {
      key: "shipmentNumber", header: "Shipment No.", sortable: true, align: "left",
      cell: (row) => (
        <Link href={`/shipments/${row.id}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
          {row.shipmentNumber}
        </Link>
      ),
    },
    {
      key: "poNumber", header: "PO Number", sortable: true, align: "left",
      cell: (row) => (
        <Link href={`/purchase-order/${row.poId}`} className="text-[11px] font-semibold text-[#884D70] hover:underline underline-offset-2">
          {row.poNumber}
        </Link>
      ),
    },
    {
      key: "vendorName", header: "Vendor", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.vendorName}</span>,
    },
    {
      key: "shipmentType", header: "Type", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.shipmentType}</span>,
    },
    {
      key: "transportMode", header: "Transport Mode", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.transportMode}</span>,
    },
    {
      key: "transporterName", header: "Transporter", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.transporterName}</span>,
    },
    {
      key: "driverName", header: "Driver", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.driverName}</span>,
    },
    {
      key: "assetNumber", header: "Asset No.", sortable: false, align: "left",
      cell: (row) => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.assetNumber}</span>,
    },
    {
      key: "originCity", header: "Origin", sortable: true, align: "left",
      cell: (row) => <span className="text-[11px] text-gray-700 max-w-40 truncate block">{row.originCity}</span>,
    },
    {
      key: "destinationCity", header: "Destination", sortable: true, align: "left",
      cell: (row) => <span className="text-[11px] text-slate-800 font-medium max-w-40 truncate block">{row.destinationCity}</span>,
    },
    {
      key: "estimatedDeparture", header: "Est. Departure", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.estimatedDeparture}</span>,
    },
    {
      key: "actualDeparture", header: "Actual Departure", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.actualDeparture}</span>,
    },
    {
      key: "estimatedArrival", header: "Est. Arrival", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.estimatedArrival}</span>,
    },
    {
      key: "actualArrival", header: "Actual Arrival", sortable: true, align: "left",
      cell: (row) => <span className="cell-text">{row.actualArrival}</span>,
    },
    {
      key: "trackingNumber", header: "Tracking No.", sortable: false, align: "left",
      cell: (row) => <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.trackingNumber}</span>,
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
          viewHref={`/shipments/${row.id}`}
          editHref={`/shipments/${row.id}/edit`}
          onDelete={() => setDeleteId(deleteId === row.id ? null : row.id)}
        />
      ),
    },
  ];

  const shownCols = allColumns.filter((c) => visibleCols.has(c.key));

  // ── Delete confirmation row ───────────────────────────────────────────────────

  const expandedRow = (row: Shipment, colSpan: number) =>
    deleteId !== row.id ? null : (
      <tr className="bg-red-100/50 backdrop-blur-sm">
        <td colSpan={colSpan} className="px-4 py-2.5 border-b border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-red-700 font-medium">
              Delete <strong>{row.shipmentNumber}</strong>? This cannot be undone.
            </span>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={() => { setShipments((p) => p.filter((s) => s.id !== row.id)); setDeleteId(null); }}
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
        <span>Count: <strong className={CX.statVal}>{filteredShipments.length}</strong></span>
        <span className={CX.statSep}>|</span>
        <span>In Transit: <strong className="text-amber-600 font-semibold">{shipments.filter((s) => ["in_transit", "at_port", "customs_clearance", "out_for_delivery"].includes(s.status)).length}</strong></span>
        <span className={CX.statSep}>·</span>
        <span>Delivered: <strong className="text-emerald-600 font-semibold">{shipments.filter((s) => s.status === "delivered" || s.status === "partially_delivered").length}</strong></span>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800">


      <main className="flex-1 px-6 pt-3 pb-4 flex flex-col gap-2">

        <div className="flex items-center justify-between gap-2 px-1">
          <Breadcrumbs items={[{ label: "Dashboard", href: "/" }, { label: "Shipments" }]} />
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={handleSearchChange} placeholder="Search shipments…" />
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
            <Link href="/shipments/create">
              <Button variant="cta-sunset" icon="add">Create Shipment</Button>
            </Link>
          </div>
        </div>

        <TabbedTable
          selectedIndex={activeTab}
          onChange={handleTabChange}
          tabs={TABS.map((tab) => ({
            label: tab.label,
            count: tab.statuses
              ? shipments.filter((s) => tab.statuses!.includes(s.status)).length
              : shipments.length,
            content: (
              <ExcelTable<Shipment>
                columns={shownCols}
                data={pagedShipments}
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
                emptyMessage="No shipments found."
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
