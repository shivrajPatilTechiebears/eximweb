"use client";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { CompactTable, type CompactTableColumn } from "@/components/table/CompactTable";
import { Icon } from "@/components/ui/Icon";
import { FormFooterButton } from "@/components/layout/FormFooter";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PurchaseItem {
  id: number;
  name: string;
  qty: number;
  price: string;
  uom: string;
  taxCode: string;
  packagingType: string;
  containers: number;
  imgSrc: string;
  imgLabel: string;
  imgDesc: string;
}

interface ScheduleRow {
  id: number;
  itemName: string;
  schedule: string;
  qty: number;
  reqDispatch: string;
  reqDelivery: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PO_META = {
  id: "PO-2024-00139",
  status: "Draft",
  backHref: "/purchase-order",
};

const FORM_DATA = {
  poType: "Paddler",
  truckNo: "MH-05-1234",
  driverDetails: "Shivraj Patil",
  deliveryLocations: "Pune, maharastra",
  currency: "USD",
  shipmentTerms: "EWS",
  paymentTerms: "After Delivered",
  transporter: "DHL",
  notes: "Enter material grade",
};

const PURCHASE_ITEMS: PurchaseItem[] = [
  {
    id: 1,
    name: "Steel-01",
    qty: 100,
    price: "$100",
    uom: "Kg",
    taxCode: "GST",
    packagingType: "Box Packaging",
    containers: 2,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl7wTC-rA26wrENnGGuuk9VWDDWe0SvPuZLSfqjHql-merHAkIgCl5ukEtNU7oByRD88G6uecgMMu2BhbjKErWVz74p_R5de7W3wCck8rKoDHKzWSfPSq7CiIT5MhxTjnk4oGwyB5SEkNpWjabCYUvNxsBZJwLkErWxy64jW56Fd4o4Rs1JAFH5Ox18sRywAxMExkYQ6BzOasXbNtAK56_d9WF14quM3bGPuLk7Eg7ECNzj5AcByLN-EVm4DCll-EiRDRMKXo_q3y_",
    imgLabel: "Img-001",
    imgDesc: "Aluminium as lot...",
  },
  {
    id: 2,
    name: "Steel-01",
    qty: 100,
    price: "$100",
    uom: "Kg",
    taxCode: "GST",
    packagingType: "Box Packaging",
    containers: 2,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBADgOxp7tKUKb9NgROGVNM7vxq-T_ruvaqNddRh6XbdoMNLTdCaVNQrvguZAcTHkIG3LdUoZEewyRjiLqQBcXVq4i0rtLpiKltl9IsK5I5NRsZyZe1-PVun9F4O92j7MUpVfcklANPOdQCotWOBYDScA36NDx_tKaXqX6FBhymw4WHlMOd3vfO8bY09rkt8N630R-LxteiDOdYYSe_3d3Hb6C07-RvhWnAKbq8YOxKuwQD2d7eBAZy4R1HSbWxkik6KsFrOtyJLqFT",
    imgLabel: "Img-001",
    imgDesc: "Aluminium as lot...",
  },
];

const SCHEDULE_ROWS: ScheduleRow[] = [
  {
    id: 1,
    itemName: "Steel-01",
    schedule: "Schedule-1",
    qty: 100,
    reqDispatch: "11/02/2026",
    reqDelivery: "13/02/2026",
  },
  {
    id: 2,
    itemName: "Steel-01",
    schedule: "Schedule-1",
    qty: 100,
    reqDispatch: "11/02/2026",
    reqDelivery: "13/02/2026",
  },
];

// ─── Column definitions ───────────────────────────────────────────────────────

const ITEMS_COLUMNS: CompactTableColumn<PurchaseItem>[] = [
  {
    field: "id",
    header: "Sr/N",
    headerClass: "w-12 text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "name",
    header: "Item name",
    headerClass: "uppercase",
    cellClass: "border-r border-outline-variant/30 font-semibold",
  },
  {
    field: "qty",
    header: "Qty",
    headerClass: "w-16 text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "price",
    header: "Price",
    headerClass: "w-20 text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "uom",
    header: "UOM",
    headerClass: "w-16 text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "taxCode",
    header: "Tax Code",
    headerClass: "w-20 text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "packagingType",
    header: "packaging type",
    headerClass: "text-center uppercase",
    cellClass: "border-r border-outline-variant/30",
  },
  {
    field: "containers",
    header: "No of Container",
    headerClass: "text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "imgSrc",
    header: "Link Image",
    headerClass: "uppercase",
    cellClass: "border-r border-outline-variant/30",
    body: (row) => (
      <div className="flex items-center gap-2">
        <img className="w-6 h-6 rounded object-cover shrink-0" src={row.imgSrc} alt={row.imgLabel} />
        <div className="leading-none min-w-0">
          <p className="text-[10px] font-bold">{row.imgLabel}</p>
          <p className="text-[9px] text-on-surface-variant truncate w-24">{row.imgDesc}</p>
        </div>
      </div>
    ),
  },
];

const SCHEDULE_COLUMNS: CompactTableColumn<ScheduleRow>[] = [
  {
    field: "id",
    header: "Sr/N",
    headerClass: "w-12 text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "itemName",
    header: "Item name",
    headerClass: "uppercase",
    cellClass: "border-r border-outline-variant/30",
  },
  {
    field: "schedule",
    header: "Schedule",
    headerClass: "uppercase",
    cellClass: "border-r border-outline-variant/30 text-primary font-medium",
  },
  {
    field: "qty",
    header: "Qty",
    headerClass: "w-16 text-center uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "reqDispatch",
    header: "Requested Dispatch",
    headerClass: "uppercase",
    cellClass: "text-center border-r border-outline-variant/30",
  },
  {
    field: "reqDelivery",
    header: "Requested Delivery",
    headerClass: "uppercase",
    cellClass: "text-center",
  },
];

// ─── Tab content ──────────────────────────────────────────────────────────────

function ScheduleTabContent() {
  return (
    <div className="border border-outline-variant rounded overflow-hidden">
      <CompactTable columns={SCHEDULE_COLUMNS} data={SCHEDULE_ROWS} rowKey={(r) => r.id} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViewPurchaseOrderPage() {
  const tabItems: TabItem[] = [
    { id: "schedule", label: "Schedule", content: <ScheduleTabContent /> },
    { id: "shipment", label: "Shipment", content: <p className="text-sm text-on-surface-variant py-4">Shipment content</p> },
    { id: "test-sample", label: "Test sample", content: <p className="text-sm text-on-surface-variant py-4">Test sample content</p> },
    { id: "goods-receipt", label: "Goods receipt", content: <p className="text-sm text-on-surface-variant py-4">Goods receipt content</p> },
  ];

  return (
    <AppShell title="Purchase order" userName="Shivam Chaudhari" userRole="Purchase Order">
      <div className="p-4 flex-1 bg-background flex flex-col gap-3">

        {/* Breadcrumb / Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link
              href={PO_META.backHref}
              aria-label="Go back"
              className="w-6 h-6 bg-primary-container text-on-primary-container rounded flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
            >
              <Icon name="arrow_back" className="text-sm" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-bold leading-none">View Purchase Order</h3>
                <Badge variant="muted" label={PO_META.status} shape="rounded" size="sm" uppercase />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{PO_META.id}</p>
            </div>
          </div>
        </div>

        {/* Form Fields (Read-only) */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-3 shadow-sm">
          <div className="grid grid-cols-4 gap-x-3 gap-y-2">
            <FormField label="Po Type*">
              <Input value={FORM_DATA.poType} readOnly />
            </FormField>
            <FormField label="Enter Truck No *">
              <Input value={FORM_DATA.truckNo} readOnly />
            </FormField>
            <FormField label="Enter Driver Details*">
              <Input value={FORM_DATA.driverDetails} readOnly />
            </FormField>
            <FormField label="Delivery locations">
              <Input value={FORM_DATA.deliveryLocations} readOnly />
            </FormField>
            <FormField label="Currency *">
              <Input value={FORM_DATA.currency} readOnly />
            </FormField>
            <FormField label="Shipment terms">
              <Input value={FORM_DATA.shipmentTerms} readOnly />
            </FormField>
            <FormField label="Payment terms">
              <Input value={FORM_DATA.paymentTerms} readOnly />
            </FormField>
            <FormField label="Transporter">
              <Input value={FORM_DATA.transporter} readOnly />
            </FormField>
          </div>
        </div>

        {/* Purchase Items Table */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-1.5 flex justify-between items-center border-b border-outline-variant/30 bg-surface-container-low">
            <h4 className="font-table-header text-table-header uppercase text-primary font-bold">
              Purchase Items
            </h4>
          </div>
          <CompactTable
            columns={ITEMS_COLUMNS}
            data={PURCHASE_ITEMS}
            rowKey={(r) => r.id}
            rowClassName={(_, i) => (i % 2 === 1 ? "bg-surface-container-lowest" : "")}
          />
        </div>

        {/* Notes Section */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-3 shadow-sm">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 flex items-center gap-1">
            Notes* <Icon name="info" size={10} />
          </label>
          <div className="border border-outline-variant rounded p-2 bg-surface-container-lowest min-h-[60px] text-[12px] text-on-surface-variant italic">
            {FORM_DATA.notes}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs items={tabItems} defaultActiveId="schedule" />

        {/* Action Footer */}
        <div className="flex justify-end pt-2">
          <Link href="/purchase-order">
            <FormFooterButton variant="primary">
              <Icon name="close" size={16} />
              Close
            </FormFooterButton>
          </Link>
        </div>

      </div>
    </AppShell>
  );
}
