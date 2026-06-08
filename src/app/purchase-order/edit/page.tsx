"use client";
import React, { useState, useCallback } from "react";
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
import { DataTable } from "@/components/table/DataTable";
import { type TableColumn } from "@/components/ui/Table";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { FormFooter, FormFooterButton, type FooterMetric } from "@/components/layout/FormFooter";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { handleEnterMoveNext, useTableEnterHandler } from "@/hooks/useFormNavigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectField { type: "select"; label: string; options: string[]; defaultValue?: string }
interface InputField  { type: "input";  label: string; defaultValue?: string }
type FormFieldDef = SelectField | InputField;

interface PurchaseItem {
  id: number;
  name: string;
  qty: number;
  price: string;
  uom: string;
  taxCode: string;
  containers: string;
  packaging: string;
}

interface ScheduleRow {
  id: number;
  itemName: string;
  schedule: string;
  qty: string;
  reqDispatch: string;
  reqDelivery: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PO_ID = "PO-2024-00139";

const FORM_FIELDS: FormFieldDef[] = [
  { type: "select", label: "Po Type *",          options: ["Paddler", "Standard"],            defaultValue: "Paddler" },
  { type: "input",  label: "Truck No *",          defaultValue: "MH-05-1234" },
  { type: "input",  label: "Driver Details *",    defaultValue: "Shivraj Patil" },
  { type: "input",  label: "Delivery Locations",  defaultValue: "Pune, maharastra" },
  { type: "select", label: "Currency *",          options: ["USD", "EUR", "INR"],              defaultValue: "USD" },
  { type: "select", label: "Shipment Terms",      options: ["EWS", "FOB"],                    defaultValue: "EWS" },
  { type: "select", label: "Payment Terms",       options: ["After Delivered", "Pre-paid"] },
  { type: "select", label: "Transporter",         options: ["DHL", "FedEx"] },
];

const INITIAL_ITEMS: PurchaseItem[] = [
  { id: 1, name: "Steel-01",  qty: 100, price: "$100", uom: "Kg", taxCode: "GST", containers: "2", packaging: "Box Packaging" },
  { id: 2, name: "Steel-01",  qty: 100, price: "$100", uom: "Kg", taxCode: "GST", containers: "2", packaging: "Box Packaging" },
];

const INITIAL_SCHEDULE: ScheduleRow[] = [
  { id: 1, itemName: "", schedule: "", qty: "", reqDispatch: "", reqDelivery: "" },
];

const FOOTER_METRICS: FooterMetric[] = [
  { label: "Total Qty",    value: "200.00"     },
  { label: "Net Amount",   value: "$20,000.00" },
  { label: "Tax Estimate", value: "$1,600.00"  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditPurchaseOrderPage() {
  const [items, setItems]               = useState<PurchaseItem[]>(INITIAL_ITEMS);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(INITIAL_SCHEDULE);
  const [isGalleryOpen, setIsGalleryOpen]   = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: prev.length + 1, name: "", qty: 0, price: "", uom: "", taxCode: "", containers: "", packaging: "" },
    ]);
  }, []);

  const deleteItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addSchedule = useCallback(() => {
    setScheduleRows((prev) => [
      ...prev,
      { id: prev.length + 1, itemName: "", schedule: "", qty: "", reqDispatch: "", reqDelivery: "" },
    ]);
  }, []);

  const deleteSchedule = useCallback((id: number) => {
    setScheduleRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleItemsEnter    = useTableEnterHandler(addItem);
  const handleScheduleEnter = useTableEnterHandler(addSchedule);

  // ── Items columns ──────────────────────────────────────────────────────────

  const ITEMS_COLUMNS: TableColumn<PurchaseItem>[] = [
    {
      field: "id",
      header: "#",
      body: (row) => <span className="text-sm text-gray-400 tabular-nums block text-center select-none">{row.id}</span>,
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
      header: "Price",
      body: (row) => <CellInput align="right" width="w-24 font-semibold" defaultValue={row.price} placeholder="0.00" />,
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
      field: "containers",
      header: "Containers",
      body: (row) => <CellInput align="center" width="w-20" defaultValue={row.containers} placeholder="0" />,
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
      body: (row) => <span className="text-sm text-gray-400 tabular-nums block text-center select-none">{row.id}</span>,
    },
    {
      field: "itemName",
      header: "Item Name",
      body: (row) => <CellInput width="min-w-[120px]" defaultValue={row.itemName} placeholder="Item name…" />,
    },
    {
      field: "schedule",
      header: "Schedule",
      body: (row) => <CellInput width="w-28" defaultValue={row.schedule} placeholder="Schedule…" />,
    },
    {
      field: "qty",
      header: "Qty",
      body: (row) => <CellInput align="center" width="w-16" defaultValue={row.qty} placeholder="0" />,
    },
    {
      field: "reqDispatch",
      header: "Req. Dispatch",
      body: (row) => <CellInput width="w-28" defaultValue={row.reqDispatch} placeholder="dd/mm/yyyy" />,
    },
    {
      field: "reqDelivery",
      header: "Req. Delivery",
      body: (row) => <CellInput width="w-28" defaultValue={row.reqDelivery} placeholder="dd/mm/yyyy" />,
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

  // ── Tabs ───────────────────────────────────────────────────────────────────

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
            headerActions={<Button variant="add" icon="add" onClick={addSchedule}>Add Schedule</Button>}
          />
        </div>
      ),
    },
    { id: "shipment",      label: "Shipment",      content: <PlaceholderTab label="Shipment" /> },
    { id: "test-sample",   label: "Test Sample",   content: <PlaceholderTab label="Test Sample" /> },
    { id: "goods-receipt", label: "Goods Receipt", content: <PlaceholderTab label="Goods Receipt" /> },
  ];

  return (
    <AppShell title="Edit Purchase Order" activeNavLabel="Purchase order details">
      <div className="p-6 space-y-5">

        {/* ── Order Details ─────────────────────────────────────────────────── */}
        <SectionPanel
          headerPrefix={<BackButton href="/purchase-order" />}
          title="Order Details"
          action={
            <>
              <span className="text-xs text-gray-400">{PO_ID}</span>
              <Badge variant="warning" label="Draft" shape="pill" size="sm" />
            </>
          }
          bodyClassName="px-5 py-5"
        >
          <div className="grid grid-cols-4 gap-x-4 gap-y-4" onKeyDown={handleEnterMoveNext}>
            {FORM_FIELDS.map((field) => (
              <FormField key={field.label} label={field.label}>
                {field.type === "select" ? (
                  <Select options={field.options} defaultValue={field.defaultValue} />
                ) : (
                  <Input defaultValue={field.defaultValue} type="text" />
                )}
              </FormField>
            ))}
          </div>
        </SectionPanel>

        {/* ── Purchase Items ────────────────────────────────────────────────── */}
        <div onKeyDown={handleItemsEnter}>
          <DataTable
            title="Purchase Items"
            titleClassName="text-sm font-semibold text-gray-900"
            columns={ITEMS_COLUMNS}
            data={items}
            emptyMessage="No items yet. Press Enter on the last row to add one."
            rowStyle={(_, i) => ({ backgroundColor: i % 2 === 0 ? "#ffffff" : "var(--color-row-alt)" })}
            headerActions={<Button variant="add" icon="add" onClick={addItem}>Add Item</Button>}
          />
        </div>

        {/* ── Notes ────────────────────────────────────────────────────────── */}
        <SectionPanel title="Notes" bodyClassName="px-5 py-4">
          <textarea
            className="w-full rounded border border-gray-300 bg-gray-50/60 focus:border-gray-400 focus:ring-0 outline-none p-2 text-sm resize-none text-gray-800 placeholder:text-gray-400"
            rows={3}
            placeholder="Enter material grade and special handling instructions…"
          />
        </SectionPanel>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <Tabs items={tabItems} defaultActiveId="schedule" />

      </div>

      <FormFooter
        metrics={FOOTER_METRICS}
        actions={
          <>
            <FormFooterButton variant="ghost">Cancel</FormFooterButton>
            <FormFooterButton variant="secondary">Save Changes</FormFooterButton>
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
