"use client";
import { useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionPanel } from "@/components/cards/SectionPanel";
import { BackButton } from "@/components/layout/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CellInput } from "@/components/ui/CellInput";
import { Icon } from "@/components/ui/Icon";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { DataTable, type TableColumn } from "@/components/table/DataTable";
import { FormFooter, FormFooterButton } from "@/components/layout/FormFooter";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { handleEnterMoveNext, useTableEnterHandler } from "@/hooks/useFormNavigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectField { type: "select"; label: string; options: string[] }
interface InputField { type: "input"; label: string; placeholder: string; inputType?: string }
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

// ─── Static / constant data ───────────────────────────────────────────────────

const FORM_FIELDS: FormFieldDef[] = [
  { type: "select", label: "Po Type *", options: ["Paddler", "Direct", "Consignment"] },
  { type: "input", label: "Truck No *", placeholder: "MH-12-AQ-9082" },
  { type: "input", label: "Driver Details *", placeholder: "Ramesh Kumar (+91 98...)" },
  { type: "input", label: "Delivery Locations", placeholder: "Mumbai Port Terminal 2" },
  { type: "select", label: "Currency *", options: ["INR (₹)", "USD ($)", "EUR (€)"] },
  { type: "select", label: "Shipment Terms", options: ["EXW - Ex Works", "FOB - Free on Board"] },
  { type: "select", label: "Payment Terms", options: ["Net 30 Days", "15% Advance"] },
  { type: "select", label: "Transporter", options: ["SafeLogistics Pvt Ltd", "Global Freight"] },
];

const SUMMARY_METRICS = [
  { label: "Total Quantity", value: "195.00" },
  { label: "Net Amount", value: "₹ 1,87,500" },
  { label: "Tax Estimate", value: "₹ 33,750" },
];

const DRAFT_LABEL = "Draft PO-9284";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreatePurchaseOrderPage() {
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: 1, name: "Steel Wire Mesh G12", qty: 150, price: 12500, uom: "Roll", taxCode: "GST_18", packaging: "Boxed" },
    { id: 2, name: "Hydraulic Seal Kit", qty: 45, price: 3400, uom: "Sets", taxCode: "GST_12", packaging: "Plastic" },
  ]);

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([
    { id: 1, phase: "Initial Inventory Batch", qty: 100, reqDispatch: "24-Oct-2023", reqDelivery: "26-Oct-2023", actionLog: "Waiting for supplier confirm" },
    { id: 2, phase: "Residual Balance Shipment", qty: 50, reqDispatch: "02-Nov-2023", reqDelivery: "05-Nov-2023", actionLog: "Scheduled for Q4" },
  ]);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, name: "", qty: 0, price: 0, uom: "", taxCode: "", packaging: "" },
    ]);
  }, []);

  const deleteItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addSchedule = useCallback(() => {
    setScheduleRows((prev) => [
      ...prev,
      { id: prev.length + 1, phase: "", qty: 0, reqDispatch: "", reqDelivery: "", actionLog: "" },
    ]);
  }, []);

  const deleteSchedule = useCallback((id: number) => {
    setScheduleRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleItemsEnter = useTableEnterHandler(addItem);
  const handleScheduleEnter = useTableEnterHandler(addSchedule);

  // ── Items table columns ────────────────────────────────────────────────────

  const ITEMS_COLUMNS: TableColumn<PurchaseItem>[] = [
    {
      field: "id",
      header: "#",
      body: (row) => (
        <span className="text-sm text-gray-400 tabular-nums block text-center select-none">{row.id}</span>
      ),
    },
    {
      field: "name",
      header: "Item Name",
      body: (row) => <CellInput defaultValue={row.name} placeholder="Item name…" />,
    },
    {
      field: "qty",
      header: "Qty",
      body: (row) => <CellInput align="center" width="w-20" defaultValue={row.qty || ""} type="number" placeholder="0" />,
    },
    {
      field: "price",
      header: "Price (₹)",
      body: (row) => <CellInput align="right" width="w-24 font-semibold" defaultValue={row.price || ""} type="number" placeholder="0.00" />,
    },
    {
      field: "uom",
      header: "UOM",
      body: (row) => <CellInput align="center" width="w-16" defaultValue={row.uom} placeholder="e.g. Kg" />,
    },
    {
      field: "taxCode",
      header: "Tax Code",
      body: (row) => <CellInput align="center" width="w-20" defaultValue={row.taxCode} placeholder="GST_18" />,
    },
    {
      field: "packaging",
      header: "Packaging",
      body: (row) => <CellInput width="w-28" defaultValue={row.packaging} placeholder="Box / Roll…" />,
    },
    {
      field: "image",
      header: "Img",
      body: (row) => (
        <button tabIndex={-1} className="text-black/25 hover:text-primary transition-colors mx-auto block"
          title="Attach image" onClick={() => { setSelectedItemId(row.id); setIsGalleryOpen(true); }}>
          <Icon name="attachment" size={15} />
        </button>
      ),
    },
    {
      field: "delete",
      header: "",
      body: (row) => (
        <button tabIndex={-1} className="text-black/25 hover:text-red-500 transition-colors mx-auto block"
          title="Remove row" onClick={() => deleteItem(row.id)}>
          <Icon name="delete" size={15} />
        </button>
      ),
    },
  ];

  // ── Schedule columns ───────────────────────────────────────────────────────

  const SCHEDULE_COLUMNS: TableColumn<ScheduleRow>[] = [
    {
      field: "id",
      header: "#",
      body: (row) => (
        <span className="text-sm text-gray-400 tabular-nums block text-center select-none">{row.id}</span>
      ),
    },
    {
      field: "phase",
      header: "Delivery Phase",
      body: (row) => <CellInput width="min-w-[160px]" defaultValue={row.phase} placeholder="Phase name…" />,
    },
    {
      field: "qty",
      header: "Qty",
      body: (row) => <CellInput align="center" width="w-20 font-semibold" defaultValue={row.qty || ""} type="number" placeholder="0" />,
    },
    {
      field: "reqDispatch",
      header: "Req. Dispatch",
      body: (row) => <CellInput width="w-28" defaultValue={row.reqDispatch} placeholder="dd-Mon-yyyy" />,
    },
    {
      field: "reqDelivery",
      header: "Req. Delivery",
      body: (row) => <CellInput width="w-28" defaultValue={row.reqDelivery} placeholder="dd-Mon-yyyy" />,
    },
    {
      field: "actionLog",
      header: "Action Log",
      body: (row) => <CellInput width="min-w-[160px]" defaultValue={row.actionLog} placeholder="Notes…" />,
    },
    {
      field: "delete",
      header: "",
      body: (row) => (
        <button tabIndex={-1} className="text-black/25 hover:text-red-500 transition-colors mx-auto block"
          title="Remove" onClick={() => deleteSchedule(row.id)}>
          <Icon name="delete" size={15} />
        </button>
      ),
    },
  ];

  const tabItems: TabItem[] = [
    {
      id: "schedule",
      label: "Schedule",
      content: (
        <div onKeyDown={handleScheduleEnter}>
          <DataTable
            title="Delivery Schedules"
            titleClassName="text-sm font-semibold text-gray-900"
            columns={SCHEDULE_COLUMNS}
            data={scheduleRows}
            emptyMessage="No schedules yet. Press Enter on the last row to add one."
            rowStyle={(_, i) => ({ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--color-row-alt)" })}
            headerActions={
              <Button variant="add" icon="add" onClick={addSchedule}>Add Schedule</Button>
            }
          />
        </div>
      ),
    },
    { id: "shipment-logs", label: "Shipment Logs", content: <PlaceholderTab label="Shipment Logs" /> },
    { id: "test-samples", label: "Test Samples", content: <PlaceholderTab label="Test Samples" /> },
    { id: "remarks", label: "Remarks", content: <PlaceholderTab label="Remarks" /> },
  ];

  return (
    <AppShell title="Create Purchase Order" activeNavLabel="All Purchase order">
      <div className="p-6 space-y-5">

        {/* ── Order Details form ───────────────────────────────────────────────── */}
        <SectionPanel
          headerPrefix={<BackButton href="/purchase-order" />}
          title="Order Details"
          action={
            <>
              <span className="text-xs text-gray-400">Tab or Enter to move between fields</span>
              <Badge variant="warning" label={DRAFT_LABEL} shape="pill" size="sm" />
            </>
          }
          bodyClassName="px-5 py-5"
        >
          <div className="grid grid-cols-4 gap-x-4 gap-y-4" onKeyDown={handleEnterMoveNext}>
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
        </SectionPanel>

        {/* ── Purchase Items ───────────────────────────────────────────────────── */}
        {/* Enter key on a row moves to the same column in the next row;
            pressing Enter on the last row appends a new item row. */}
        <div onKeyDown={handleItemsEnter}>
          <DataTable
            title="Purchase Items"
            titleClassName="text-sm font-semibold text-gray-900"
            columns={ITEMS_COLUMNS}
            data={items}
            emptyMessage="No items yet. Click Add Item or press Enter on the last row."
            rowStyle={(_, i) => ({ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--color-row-alt)" })}
            headerActions={
              <Button variant="add" icon="add" onClick={addItem}>Add Item</Button>
            }
          />
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────────── */}
        <Tabs items={tabItems} defaultActiveId="schedule" />

      </div>

      {/* ── Summary footer ───────────────────────────────────────────────────── */}
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
        }}
      />
    </AppShell>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="py-10 text-center text-sm text-gray-400">{label} — coming soon</div>
  );
}
