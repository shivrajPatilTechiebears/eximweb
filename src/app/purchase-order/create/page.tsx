"use client";
import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { CompactTable, type CompactTableColumn } from "@/components/table/CompactTable";
import { FormFooter, FormFooterButton } from "@/components/layout/FormFooter";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { Icon } from "@/components/ui/Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectField {
  type: "select";
  label: string;
  options: string[];
}

interface InputField {
  type: "input";
  label: string;
  placeholder: string;
  inputType?: string;
}

type FormFieldDef = SelectField | InputField;

interface PurchaseItem {
  id: number;
  name: string;
  qty: number;
  price: number;
  uom: string;
  taxCode: string;
  packaging: string;
}

interface ScheduleRow {
  id: number;
  phase: string;
  qty: number;
  reqDispatch: string;
  reqDelivery: string;
  actionLog: string;
}

// ─── Page data ────────────────────────────────────────────────────────────────

const FORM_FIELDS: FormFieldDef[] = [
  { type: "select", label: "Po Type*", options: ["Paddler", "Direct", "Consignment"] },
  { type: "input", label: "Truck No*", placeholder: "MH-12-AQ-9082" },
  { type: "input", label: "Driver Details*", placeholder: "Ramesh Kumar (+91 98...)" },
  { type: "input", label: "Delivery Locations", placeholder: "Mumbai Port Terminal 2" },
  { type: "select", label: "Currency*", options: ["INR (₹)", "USD ($)", "EUR (€)"] },
  { type: "select", label: "Shipment Terms", options: ["EXW - Ex Works", "FOB - Free on Board"] },
  { type: "select", label: "Payment Terms", options: ["Net 30 Days", "15% Advance"] },
  { type: "select", label: "Transporter", options: ["SafeLogistics Pvt Ltd", "Global Freight"] },
];

const INITIAL_ITEMS: PurchaseItem[] = [
  { id: 1, name: "Steel Wire Mesh G12", qty: 150, price: 12500, uom: "Roll", taxCode: "GST_18", packaging: "Boxed" },
  { id: 2, name: "Hydraulic Seal Kit", qty: 45, price: 3400, uom: "Sets", taxCode: "GST_12", packaging: "Plastic" },
];

const SCHEDULE_ROWS: ScheduleRow[] = [
  { id: 1, phase: "Initial Inventory Batch", qty: 100, reqDispatch: "24-Oct-2023", reqDelivery: "26-Oct-2023", actionLog: "Waiting for supplier confirm" },
  { id: 2, phase: "Residual Balance Shipment", qty: 50, reqDispatch: "02-Nov-2023", reqDelivery: "05-Nov-2023", actionLog: "Scheduled for Q4" },
];

const SUMMARY_METRICS = [
  { label: "Total Quantity", value: "195.00" },
  { label: "Net Amount", value: "₹ 1,87,500" },
  { label: "Tax Estimate", value: "₹ 33,750" },
];

const DRAFT_LABEL = "Draft PO-9284";

const TABS: Omit<TabItem, "content">[] = [
  { id: "schedule", label: "Schedule" },
  { id: "shipment-logs", label: "Shipment Logs" },
  { id: "test-samples", label: "Test Samples" },
  { id: "remarks", label: "Remarks" },
];

// ─── Column definitions ───────────────────────────────────────────────────────

// ITEMS_COLUMNS is defined inside the component to close over deleteItem

const SCHEDULE_COLUMNS: CompactTableColumn<ScheduleRow>[] = [
  { field: "id", header: "#", headerClass: "w-10", cellClass: "text-center" },
  { field: "phase", header: "Delivery Phase", headerClass: "text-left" },
  { field: "qty", header: "Qty", headerClass: "w-20 text-center", cellClass: "text-center font-semibold" },
  { field: "reqDispatch", header: "Req Dispatch", headerClass: "w-32 text-center", cellClass: "text-center" },
  { field: "reqDelivery", header: "Req Delivery", headerClass: "w-32 text-center", cellClass: "text-center" },
  { field: "actionLog", header: "Action Logs", headerClass: "text-left", cellClass: "text-on-surface-variant" },
  {
    field: "edit",
    header: "",
    headerClass: "w-16",
    cellClass: "text-center",
    body: () => <Icon name="edit" size={16} className="text-outline cursor-pointer" />,
  },
];

// ─── Schedule tab content ─────────────────────────────────────────────────────

function ScheduleTable() {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 overflow-hidden flex flex-col">
      <div className="px-4 py-1.5 bg-surface-container-low flex justify-between items-center border-b border-outline-variant/20">
        <span className="text-[10px] font-bold uppercase text-on-surface-variant">
          Logistics Delivery Plan
        </span>
        <button className="text-primary-container text-[11px] font-bold flex items-center gap-1 hover:underline">
          <Icon name="add" size={14} /> Add Schedule
        </button>
      </div>
      <CompactTable columns={SCHEDULE_COLUMNS} data={SCHEDULE_ROWS} rowKey={(row) => row.id} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatePurchaseOrderPage() {
  const [items, setItems] = useState<PurchaseItem[]>(INITIAL_ITEMS);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, name: "", qty: 0, price: 0, uom: "", taxCode: "", packaging: "" },
    ]);
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const ITEMS_COLUMNS: CompactTableColumn<PurchaseItem>[] = [
    { field: "id", header: "Sr/N", headerClass: "w-10", cellClass: "text-center text-on-surface-variant" },
    {
      field: "name",
      header: "Item Name",
      headerClass: "text-left",
      body: (row) => (
        <input className="w-full compact-input border-0 bg-transparent focus:ring-0 text-[12px] p-0 outline-none" defaultValue={row.name} type="text" />
      ),
    },
    {
      field: "qty",
      header: "Qty",
      headerClass: "w-20 text-center",
      cellClass: "text-center",
      body: (row) => (
        <input className="w-full compact-input border-0 bg-transparent text-center focus:ring-0 text-[12px] p-0 outline-none" defaultValue={row.qty} type="number" />
      ),
    },
    {
      field: "price",
      header: "Price (₹)",
      headerClass: "w-24 text-right",
      cellClass: "text-right",
      body: (row) => (
        <input className="w-full compact-input border-0 bg-transparent text-right focus:ring-0 text-[12px] p-0 font-semibold outline-none" defaultValue={row.price} type="number" />
      ),
    },
    { field: "uom", header: "UOM", headerClass: "w-20 text-center", cellClass: "text-center" },
    { field: "taxCode", header: "Tax Code", headerClass: "w-24 text-center", cellClass: "text-center" },
    { field: "packaging", header: "Packaging", headerClass: "w-24 text-center", cellClass: "text-center" },
    {
      field: "image",
      header: "Image",
      headerClass: "w-10 text-center",
      cellClass: "text-center text-secondary",
      body: (row) => (
        <span
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => { setSelectedItemId(row.id); setIsGalleryOpen(true); }}
        >
          <Icon name="attachment" size={16} />
        </span>
      ),
    },
    {
      field: "delete",
      header: "",
      headerClass: "w-10",
      cellClass: "text-center text-error",
      body: (row) => (
        <span className="cursor-pointer hover:opacity-70" onClick={() => deleteItem(row.id)}>
          <Icon name="delete" size={16} />
        </span>
      ),
    },
  ];

  const tabItems: TabItem[] = TABS.map((t) => ({
    ...t,
    content:
      t.id === "schedule" ? (
        <ScheduleTable />
      ) : (
        <div className="p-4 text-sm text-on-surface-variant">{t.label} content</div>
      ),
  }));

  return (
    <AppShell title="Purchase order" userName="Shivam Chaudhari" userRole="Operations Lead">
      <div className="p-4 flex-1 bg-background flex flex-col gap-3">

        {/* Breadcrumb / Header Action */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/purchase-order">
              <button className="w-6 h-6 bg-primary-container text-on-primary-container rounded flex items-center justify-center hover:opacity-90 transition-opacity shrink-0">
                <Icon name="arrow_back" size={16} />
              </button>
            </Link>
            <div>
              <h3 className="text-[14px] font-bold leading-none">Create Purchase Order</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">
                List of purchase order fields for high-density logistics management.
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-bold text-primary-container border border-outline-variant/20 uppercase tracking-wider">
            {DRAFT_LABEL}
          </span>
        </div>

        {/* Primary Form Section */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-3 shadow-sm">
          <div className="grid grid-cols-4 gap-x-3 gap-y-2">
            {FORM_FIELDS.map((field) => (
              <FormField key={field.label} label={field.label}>
                {field.type === "select" ? (
                  <Select options={field.options} />
                ) : (
                  <Input placeholder={field.placeholder} type={field.inputType ?? "text"} />
                )}
              </FormField>
            ))}
          </div>
        </div>

        {/* Items Table Section */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-1.5 flex justify-between items-center border-b border-outline-variant/30 bg-surface-container-low">
            <h4 className="font-table-header text-table-header uppercase text-primary font-bold">
              Purchase Items
            </h4>
            <button
              onClick={addItem}
              className="bg-primary text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors"
            >
              <Icon name="add_circle" size={16} /> Add Item
            </button>
          </div>
          <CompactTable
            columns={ITEMS_COLUMNS}
            data={items}
            rowKey={(row) => row.id}
            rowClassName={(_, i) => (i % 2 === 1 ? "bg-surface-container-lowest" : "")}
          />
        </div>

        {/* Tabs Section */}
        <Tabs items={tabItems} defaultActiveId="schedule" />

      </div>

      <FormFooter
        metrics={SUMMARY_METRICS}
        actions={
          <>
            <FormFooterButton variant="ghost">Cancel</FormFooterButton>
            <FormFooterButton variant="secondary">Save as Draft</FormFooterButton>
            <FormFooterButton variant="primary">Submit PO</FormFooterButton>
          </>
        }
      />

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(image) => {
          console.log("Selected image for item", selectedItemId, ":", image);
          // Here you can update the item with the selected image
        }}
      />
    </AppShell>
  );
}
