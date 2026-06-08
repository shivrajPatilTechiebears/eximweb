"use client";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MetricCard } from "@/components/cards/MetricCard";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { Pagination } from "@/components/table/Pagination";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { ColumnVisibilitySelector } from "@/components/ui/ColumnVisibilitySelector";

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = "created" | "pending";

interface MetricItem {
  title: string;
  value: number;
  subtitle: string;
}

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
  status: BadgeVariant;
  active: boolean;
}

interface TableFilter {
  icon: string;
  label: string;
}

// ─── Page data ────────────────────────────────────────────────────────────────

const METRICS: MetricItem[] = [
  { title: "Total PRs", value: 6, subtitle: "All Time" },
  { title: "Submitted", value: 1, subtitle: "Waiting" },
  { title: "Approved", value: 1, subtitle: "Ready" },
  { title: "PO Created", value: 3, subtitle: "Closed" },
];

const TABLE_CONFIG = {
  title: "Purchase Order",
  description: "Materials for Inspection.",
};

const TABLE_FILTERS: TableFilter[] = [
  { icon: "filter_list", label: "Status" },
  { icon: "calendar_today", label: "Date" },
];

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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    poNumber: true,
    poType: true,
    deliveryLocation: true,
    itemName: true,
    itemQty: true,
    price: true,
    currency: true,
    shipTerm: true,
    payTerm: true,
    transporter: true,
    truckNo: true,
    driver: true,
    status: true,
    actions: true,
  });

  const COLUMNS: TableColumn<PurchaseOrder>[] = [
    {
      field: "poNumber",
      header: "PO NUMBER",
      body: (row) => (
        <span className={`text-primary font-bold${row.active ? "" : " opacity-60"}`}>
          {row.poNumber}
        </span>
      ),
    },
    {
      field: "poType",
      header: "Po Type",
      body: (row) => <span className="text-on-surface">{row.poType}</span>,
    },
    {
      field: "deliveryLocation",
      header: "Delivery Location",
      body: (row) => <span className="text-on-surface">{row.deliveryLocation}</span>,
    },
    {
      field: "itemName",
      header: "Item Name",
      body: (row) => <span className="text-on-surface">{row.itemName}</span>,
    },
    {
      field: "itemQty",
      header: "Item Qty",
      center: true,
      body: (row) => <span className="text-on-surface font-semibold">{row.itemQty}</span>,
    },
    {
      field: "price",
      header: "Price",
      body: (row) => (
        <span className={`text-on-surface${row.active ? " font-semibold" : ""}`}>
          {row.price}
        </span>
      ),
    },
    {
      field: "currency",
      header: "Currency",
      body: (row) => <span className="text-on-surface">{row.currency}</span>,
    },
    {
      field: "shipTerm",
      header: "Shipment terms",
      body: (row) => <span className="text-on-surface">{row.shipTerm}</span>,
    },
    {
      field: "payTerm",
      header: "Payment terms",
      body: (row) => <span className="text-on-surface">{row.payTerm}</span>,
    },
    {
      field: "transporter",
      header: "Transporter",
      body: (row) => <span className="text-on-surface">{row.transporter}</span>,
    },
    {
      field: "truckNo",
      header: "Truck No",
      body: (row) => <span className="text-on-surface">{row.truckNo}</span>,
    },
    {
      field: "driver",
      header: "Driver",
      body: (row) => <span className="text-on-surface">{row.driver}</span>,
    },
    {
      field: "status",
      header: "Status",
      body: (row) => <Badge variant={row.status} label={row.status} />,
    },
    {
      field: "actions",
      header: "Action",
      center: true,
      body: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          {row.active ? (
            <>
              <Link href="/purchase-order/view">
                <Button variant="icon" title="View">
                  <Icon name="visibility" size={18} />
                </Button>
              </Link>
              <Link href="/purchase-order/details">
                <Button variant="icon" title="Details">
                  <Icon name="info" size={18} />
                </Button>
              </Link>
              <Link href="/purchase-order/edit">
                <Button variant="icon" title="Edit">
                  <Icon name="edit" size={18} />
                </Button>
              </Link>
              <Button variant="icon-danger" title="Delete">
                <Icon name="delete" size={18} />
              </Button>
            </>
          ) : (
            <>
              <Icon name="visibility" size={18} className="opacity-30" />
              <Icon name="info" size={18} className="opacity-30" />
              <Icon name="edit" size={18} className="opacity-30" />
              <Icon name="delete" size={18} className="opacity-30" />
            </>
          )}
        </div>
      ),
    },
  ];

  const filteredColumns = COLUMNS.filter((col) => visibleColumns[col.field]);
  return (
    <AppShell title="Purchase order" userName="Shivam Chaudhari" userRole="Purchase order">
      <main className="p-lg space-y-lg flex-1 overflow-x-hidden">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {METRICS.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        {/* Purchase Order Table */}
        <DataTable
          title={TABLE_CONFIG.title}
          description={TABLE_CONFIG.description}
          toolbarActions={
            <>
              <SearchBar />
              {TABLE_FILTERS.map((f) => (
                <FilterDropdown key={f.label} icon={f.icon} label={f.label} />
              ))}
              
              <ColumnVisibilitySelector
                columns={COLUMNS}
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
          data={PURCHASE_ORDERS}
          rowKey={(row) => row.id}
          rowClassName={(row) => (!row.active ? "opacity-60" : "")}
          showingCurrent={PAGINATION.current}
          showingTotal={PAGINATION.total}
          pagination={<Pagination {...PAGINATION} />}
        />
      </main>

      <Footer />
    </AppShell>
  );
}
