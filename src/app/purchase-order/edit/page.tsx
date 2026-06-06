/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/components/ui/Icon";
import { CompactTable, type CompactTableColumn } from "@/components/table/CompactTable";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { FormFooter, FormFooterButton, type FooterMetric } from "@/components/layout/FormFooter";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectField {
  type: "select";
  label: string;
  options: string[];
  defaultValue?: string;
}

interface InputField {
  type: "input";
  label: string;
  defaultValue?: string;
}

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
  imgSrc: string;
  imgLabel: string;
  imgDesc: string;
}

interface ScheduleRow {
  id: number;
  itemName: string;
  schedule: string;
  qty: string;
  reqDispatch: string;
  reqDelivery: string;
}

// FooterMetric imported from FormFooter

// ─── App / Layout ─────────────────────────────────────────────────────────────

const APP_CONFIG = {
  title: "Purchase Order Management",
  userName: "Shivam Chaudhari",
  userRole: "Purchase Order",
  activeNavLabel: "Purchase order",
};

const PO_META = {
  id: "PO-2024-00139",
  backHref: "/purchase-order",
};

// ─── Form fields ──────────────────────────────────────────────────────────────

const FORM_FIELDS: FormFieldDef[] = [
  { type: "select", label: "Po Type*", options: ["Paddler", "Standard"], defaultValue: "Paddler" },
  { type: "input", label: "Enter Truck No*", defaultValue: "MH-05-1234" },
  { type: "input", label: "Enter Driver Details*", defaultValue: "Shivraj Patil" },
  { type: "input", label: "Delivery Locations", defaultValue: "Pune, maharastra" },
  { type: "select", label: "Currency*", options: ["USD", "EUR", "INR"], defaultValue: "USD" },
  { type: "select", label: "Shipment Terms", options: ["EWS", "FOB"], defaultValue: "EWS" },
  { type: "select", label: "Payment Terms", options: ["After Deliverd", "Pre-paid"] },
  { type: "select", label: "Transporter", options: ["DHL", "FedEx"] },
];

// ─── Purchase items ───────────────────────────────────────────────────────────

const INITIAL_ITEMS: PurchaseItem[] = [
  {
    id: 1,
    name: "Steel-01",
    qty: 100,
    price: "$100",
    uom: "Kg",
    taxCode: "GST",
    containers: "No of Container",
    packaging: "Box Packaging",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQxU5FU7E_Sus7zAuBRRmngk0RemuBkf7O_ojbJge3d5V3HQi-cl3x_0uHeeqbKUEvHyhLiVjbNXspTyi7R6BPApf1h2aMGGyZxU0iL2VuNkqNKMuDSbDzpDH7vQFKwgqAyQ8SUB05UTSDORKYHNBcZG-8kRFOdyb0ftVIacv8N_AvDel0jWfu4mQDylXz8Wn8_WGyuf6V_y1UH3ZDNRzrolQ62S81niCSwtsdY16jendphz888VBowu56nCiIPK_82BvtKVoE8xOq",
    imgLabel: "Img-001",
    imgDesc: "Aluminum as lot of...",
  },
  {
    id: 2,
    name: "Steel-01",
    qty: 100,
    price: "$100",
    uom: "Kg",
    taxCode: "GST",
    containers: "No of Container",
    packaging: "Box Packaging",
    imgSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBMMnC_9fWtf2i2YP2zunVe1i4lFhsmq7ZsY_J1YMHKPU38HPJCuj-aYhZDVF24EhUCoCtZjgsACco4d2JtLeyc_cvH-t3X3KaaCbOlWljJ0OB_7-Giev1i3gN1g9MRXsTjZdAFc5UsVZrnHg2XHpIcF-pf8XtLergyaaRXGZAfXYBuReJiXGvWatEnLJcZw0CyG7hip0UJviMEzG49xLZ0H3y_vA5JPHgxvomm4aSDgr5322Q55Ciyj_r_z1Ujec3rxU6UroDbOCGs",
    imgLabel: "Img-001",
    imgDesc: "Aluminum as lot of...",
  },
];

// ITEMS_COLUMNS defined inside component (needs deleteItem closure)

// ─── Schedule rows ────────────────────────────────────────────────────────────

const SCHEDULE_ROWS: ScheduleRow[] = [
  {
    id: 1,
    itemName: "-",
    schedule: "-",
    qty: "-",
    reqDispatch: "-",
    reqDelivery: "-",
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
    cellClass: "border-r border-outline-variant/30",
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
    cellClass: "border-r border-outline-variant/30",
  },
  {
    field: "reqDelivery",
    header: "Requested Delivery",
    headerClass: "uppercase",
    cellClass: "border-r border-outline-variant/30",
  },
  {
    field: "actions",
    header: "Actions",
    headerClass: "text-center uppercase",
    cellClass: "text-center",
    body: () => (
      <div className="flex items-center justify-center gap-2">
        <IconButton icon="edit" label="Edit schedule" tone="muted" />
        <IconButton icon="delete" label="Delete schedule" tone="danger" />
      </div>
    ),
  },
];

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TAB_LABELS = [
  { id: "schedule", label: "Schedule" },
  { id: "shipment", label: "Shipment" },
  { id: "test-sample", label: "Test Sample" },
  { id: "goods-receipt", label: "Goods Receipt" },
];

// ─── Footer metrics ───────────────────────────────────────────────────────────

const FOOTER_METRICS: FooterMetric[] = [
  { label: "Total Qty", value: "200.00" },
  { label: "Net Amount", value: "$20,000.00" },
  { label: "Tax Estimate", value: "$1,600.00" },
];

// ─── Schedule tab content ─────────────────────────────────────────────────────

function ScheduleTabContent() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end">
        <Button variant="primary" icon="calendar_today" className="text-[12px]">
          Add Schedule
        </Button>
      </div>
      <div className="border border-outline-variant rounded overflow-hidden">
        <CompactTable
          columns={SCHEDULE_COLUMNS}
          data={SCHEDULE_ROWS}
          rowKey={(r) => r.id}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditPurchaseOrderPage() {
  const [items, setItems] = useState<PurchaseItem[]>(INITIAL_ITEMS);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: "",
        qty: 0,
        price: "",
        uom: "",
        taxCode: "",
        containers: "",
        packaging: "",
        imgSrc: "",
        imgLabel: "",
        imgDesc: "",
      },
    ]);
  }

  function deleteItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

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
      cellClass: "border-r border-outline-variant/30",
      body: (row) => (
        <input className="w-full border-0 bg-transparent text-[12px] h-7 p-0 outline-none" defaultValue={row.name} type="text" />
      ),
    },
    {
      field: "qty",
      header: "Qty",
      headerClass: "w-16 text-center uppercase",
      cellClass: "border-r border-outline-variant/30",
      body: (row) => (
        <input className="w-full border-0 bg-transparent text-[12px] h-7 p-0 text-center outline-none" defaultValue={row.qty} type="number" />
      ),
    },
    {
      field: "price",
      header: "Price",
      headerClass: "w-20 text-center uppercase",
      cellClass: "border-r border-outline-variant/30",
      body: (row) => (
        <input className="w-full border-0 bg-transparent text-[12px] h-7 p-0 text-center outline-none" defaultValue={row.price} type="text" />
      ),
    },
    {
      field: "uom",
      header: "Uom",
      headerClass: "w-16 text-center uppercase",
      cellClass: "border-r border-outline-variant/30",
      body: (row) => (
        <select className="w-full border-0 bg-transparent text-[12px] h-7 p-0 text-center outline-none">
          <option>{row.uom}</option>
        </select>
      ),
    },
    {
      field: "taxCode",
      header: "Tax Code",
      headerClass: "w-20 text-center uppercase",
      cellClass: "border-r border-outline-variant/30",
      body: (row) => (
        <input className="w-full border-0 bg-transparent text-[12px] h-7 p-0 text-center outline-none" defaultValue={row.taxCode} type="text" />
      ),
    },
    {
      field: "containers",
      header: "Containers",
      headerClass: "text-center uppercase",
      cellClass: "border-r border-outline-variant/30",
      body: (row) => (
        <input className="w-full border-0 bg-transparent text-[12px] h-7 p-0 text-center outline-none" defaultValue={row.containers} type="text" />
      ),
    },
    {
      field: "packaging",
      header: "Packaging",
      headerClass: "text-center uppercase",
      cellClass: "border-r border-outline-variant/30",
      body: (row) => (
        <input className="w-full border-0 bg-transparent text-[12px] h-7 p-0 text-center outline-none" defaultValue={row.packaging} type="text" />
      ),
    },
    {
      field: "imgSrc",
      header: "Image Reference",
      headerClass: "uppercase",
      cellClass: "border-r border-outline-variant/30",
      body: (row) =>
        row.imgSrc ? (
          <div className="flex items-center gap-2">
            <img className="w-6 h-6 rounded object-cover shrink-0" src={row.imgSrc} alt={row.imgLabel} />
            <div className="leading-none min-w-0">
              <p className="text-[10px] font-bold">{row.imgLabel}</p>
              <p className="text-[9px] text-on-surface-variant truncate w-24">{row.imgDesc}</p>
            </div>
            <span
              className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors ml-auto"
              onClick={() => {
                setSelectedItemId(row.id);
                setIsGalleryOpen(true);
              }}
            >
              add_photo_alternate
            </span>
          </div>
        ) : (
          <span
            className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors"
            onClick={() => {
              setSelectedItemId(row.id);
              setIsGalleryOpen(true);
            }}
          >
            add_photo_alternate
          </span>
        ),
    },
    {
      field: "delete",
      header: "",
      headerClass: "w-10",
      cellClass: "text-center text-error",
      body: (row) => (
        <span
          className="material-symbols-outlined text-sm cursor-pointer hover:opacity-70"
          onClick={() => deleteItem(row.id)}
        >
          delete
        </span>
      ),
    },
  ];

  const tabItems: TabItem[] = TAB_LABELS.map((t) => ({
    id: t.id,
    label: t.label,
    content:
      t.id === "schedule" ? (
        <ScheduleTabContent />
      ) : (
        <p className="text-sm text-on-surface-variant py-4">{t.label} content</p>
      ),
  }));

  return (
    <AppShell {...APP_CONFIG}>
      <div className="p-4 flex-1 bg-background flex flex-col gap-3">

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
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
                <h3 className="text-[14px] font-bold leading-none">Edit Purchase Order</h3>
                <Badge variant="muted" label="Draft" shape="rounded" size="sm" uppercase />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{PO_META.id}</p>
            </div>
          </div>
        </div>

        {/* ── 4-col form grid ─────────────────────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-3 shadow-sm">
          <div className="grid grid-cols-4 gap-x-3 gap-y-2">
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
        </div>

        {/* ── Items Table ─────────────────────────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-1.5 flex justify-between items-center border-b border-outline-variant/30 bg-surface-container-low">
            <h4 className="font-table-header text-table-header uppercase text-primary font-bold">
              Purchase Items
            </h4>
            <button
              onClick={addItem}
              className="bg-primary text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span> Add Item
            </button>
          </div>
          <CompactTable
            columns={ITEMS_COLUMNS}
            data={items}
            rowKey={(r) => r.id}
            rowClassName={(_, i) => (i % 2 === 1 ? "bg-surface-container-lowest" : "")}
          />
        </div>

        {/* ── Notes ───────────────────────────────────────────────────────── */}
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/30 p-3 shadow-sm">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1 block">
            Notes*
          </label>
          <textarea
            className="w-full rounded border border-outline-variant bg-white focus:border-primary-container focus:ring-0 outline-none p-2 text-body-sm resize-none"
            style={{ height: 60 }}
            placeholder="Enter material grade and special handling instructions..."
          />
        </div>

        {/* ── Tabs + Schedule ──────────────────────────────────────────────── */}
        <Tabs items={tabItems} defaultActiveId="schedule" />

      </div>

      <FormFooter
        metrics={FOOTER_METRICS}
        actions={
          <>
            <FormFooterButton variant="ghost">Cancel</FormFooterButton>
            <FormFooterButton variant="secondary">Save Changes</FormFooterButton>
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
