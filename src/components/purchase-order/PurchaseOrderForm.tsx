"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { CardHeader } from "@/components/ui/CardHeader";
import { Card } from "@/components/ui/Card";
import { CellInput } from "@/components/ui/CellInput";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TabbedTable } from "@/components/table/TabbedTable";
import {
  MOCK_PURCHASE_ORDERS, STATUS_STYLE,
  PO_TYPE_OPTIONS, CURRENCY_OPTIONS, SHIPMENT_TERMS_OPTIONS,
  PAYMENT_TERMS_OPTIONS, TRANSPORTER_OPTIONS,
} from "./types";
import type { OrderDetailsFields, PurchaseItem, ScheduleRow } from "./types";

export type PurchaseOrderFormProps = {
  mode: "create" | "view" | "edit";
  orderId?: string;
};

const DEFAULT_ORDER_DETAILS: OrderDetailsFields = {
  poType: "", currency: "", shipmentTerms: "", paymentTerms: "",
  transporter: "", truckNo: "", driverDetails: "", deliveryLocation: "",
};

// ── Item image cell — shared by the disabled(view) and editable renderings ──

function ItemImageCell({ imageUrl, disabled, onAttach }: { imageUrl?: string; disabled: boolean; onAttach: () => void }) {
  const img = imageUrl ? (
    <Image
      src={imageUrl}
      alt="attached"
      width={24}
      height={24}
      className={`w-6 h-6 rounded object-cover border border-outline-variant ${disabled ? "" : "group-hover:border-primary transition-colors"}`}
    />
  ) : (
    <Icon name="attachment" size={13} className={disabled ? "text-gray-300" : "text-gray-400 group-hover:stepper-label-active transition-colors"} />
  );

  return (
    <div className="flex justify-center px-2 py-1">
      {disabled ? img : (
        <button onClick={onAttach} className="relative group" title={imageUrl ? "Change image" : "Attach image"}>
          {img}
        </button>
      )}
    </div>
  );
}

export function PurchaseOrderForm({ mode, orderId }: PurchaseOrderFormProps) {
  const isCreate = mode === "create";
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const disabled = isView;

  const record = orderId ? MOCK_PURCHASE_ORDERS[orderId] : undefined;

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailsFields>({ ...DEFAULT_ORDER_DETAILS, ...record?.orderDetails });
  const [items, setItems] = useState<PurchaseItem[]>(record?.items ?? []);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(record?.scheduleRows ?? []);

  const handleOrderDetailsChange = useCallback(<K extends keyof OrderDetailsFields>(key: K, value: OrderDetailsFields[K]) => {
    setOrderDetails((p) => ({ ...p, [key]: value }));
  }, []);

  const addItem = useCallback(() => {
    setItems((p) => [...p, { id: Math.max(0, ...p.map((r) => r.id)) + 1, name: "", qty: 0, price: 0, uom: "", taxCode: "", packaging: "" }]);
  }, []);

  const deleteItem = useCallback((id: number) => setItems((p) => p.filter((r) => r.id !== id)), []);

  const updateItem = useCallback(<K extends keyof Omit<PurchaseItem, "id">>(id: number, key: K, value: PurchaseItem[K]) => {
    setItems((p) => p.map((r) => r.id === id ? { ...r, [key]: value } : r));
  }, []);

  const reorderItems = useCallback((from: number, to: number) => {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const addSchedule = useCallback(() => {
    setScheduleRows((p) => [...p, { id: Math.max(0, ...p.map((r) => r.id)) + 1, phase: "", qty: 0, reqDispatch: "", reqDelivery: "", actionLog: "" }]);
  }, []);

  const deleteSchedule = useCallback((id: number) => setScheduleRows((p) => p.filter((r) => r.id !== id)), []);

  const updateSchedule = useCallback(<K extends keyof Omit<ScheduleRow, "id">>(id: number, key: K, value: ScheduleRow[K]) => {
    setScheduleRows((p) => p.map((r) => r.id === id ? { ...r, [key]: value } : r));
  }, []);

  const reorderSchedule = useCallback((from: number, to: number) => {
    setScheduleRows((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const netAmount = items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxEst = Math.round(netAmount * 0.18);

  const steps = [
    { label: "Order Details", icon: "receipt_long", complete: Object.values(orderDetails).every(Boolean) },
    {
      label: "Purchase Items", icon: "shopping_cart",
      complete: items.length > 0 && items.every(({ id: _id, ...fields }) => Object.values(fields).every(Boolean)),
    },
    {
      label: "Schedule", icon: "schedule",
      complete: scheduleRows.length > 0 && scheduleRows.every(({ id: _id, ...fields }) => Object.values(fields).every(Boolean)),
    },
    { label: "Review & Submit", icon: "send", complete: false },
  ];

  const poNumber = record?.poNumber ?? "PO-9284";
  const statusInfo = record ? STATUS_STYLE[record.status] : STATUS_STYLE.pending;

  // ── Purchase Items columns ────────────────────────────────────────────────

  const purchaseItemColumns = useMemo<Column<PurchaseItem>[]>(() => {
    const baseColumns: Column<PurchaseItem>[] = [
      {
        key: "name", header: "Item Name",
        cell: (row) => <CellInput disabled={disabled} value={row.name} onChange={(e) => updateItem(row.id, "name", e.target.value)} placeholder="Item name…" width="w-full min-w-[160px]" />,
      },
      {
        key: "qty", header: "Qty",
        cell: (row) => <CellInput disabled={disabled} value={row.qty} onChange={(e) => updateItem(row.id, "qty", Number(e.target.value))} placeholder="0" type="number" align="center" width="w-16" />,
      },
      {
        key: "price", header: "Price (₹)",
        cell: (row) => <CellInput disabled={disabled} value={row.price} onChange={(e) => updateItem(row.id, "price", Number(e.target.value))} placeholder="0.00" type="number" align="right" width="w-24" className="font-semibold text-slate-900" />,
      },
      {
        key: "uom", header: "UOM",
        cell: (row) => <CellInput disabled={disabled} value={row.uom} onChange={(e) => updateItem(row.id, "uom", e.target.value)} placeholder="Kg" align="center" width="w-14" />,
      },
      {
        key: "taxCode", header: "Tax Code",
        cell: (row) => <CellInput disabled={disabled} value={row.taxCode} onChange={(e) => updateItem(row.id, "taxCode", e.target.value)} placeholder="GST_18" align="center" width="w-20" />,
      },
      {
        key: "packaging", header: "Packaging",
        cell: (row) => <CellInput disabled={disabled} value={row.packaging} onChange={(e) => updateItem(row.id, "packaging", e.target.value)} placeholder="Box / Roll…" width="w-28" />,
      },
      {
        key: "img", header: "Img",
        cell: (row) => (
          <ItemImageCell
            imageUrl={row.imageUrl}
            disabled={disabled}
            onAttach={() => { setSelectedItemId(row.id); setIsGalleryOpen(true); }}
          />
        ),
      },
    ];

    if (disabled) return baseColumns;

    return [...baseColumns, {
      key: "actions", header: "",
      cell: (row) => (
        <div className="flex justify-center px-2 py-1">
          <button onClick={() => deleteItem(row.id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Remove">
            <Icon name="delete" size={13} />
          </button>
        </div>
      ),
    }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const scheduleColumns = useMemo<Column<ScheduleRow>[]>(() => {
    const baseColumns: Column<ScheduleRow>[] = [
      {
        key: "phase", header: "Delivery Phase",
        cell: (row) => <CellInput disabled={disabled} value={row.phase} onChange={(e) => updateSchedule(row.id, "phase", e.target.value)} placeholder="Phase name…" width="w-full min-w-[160px]" />,
      },
      {
        key: "qty", header: "Qty",
        cell: (row) => <CellInput disabled={disabled} value={row.qty} onChange={(e) => updateSchedule(row.id, "qty", Number(e.target.value))} placeholder="0" type="number" align="center" width="w-16" className="font-semibold tabular-nums" />,
      },
      {
        key: "reqDispatch", header: "Req. Dispatch",
        cell: (row) => <CellInput disabled={disabled} value={row.reqDispatch} onChange={(e) => updateSchedule(row.id, "reqDispatch", e.target.value)} placeholder="dd-Mon-yyyy" width="w-28" />,
      },
      {
        key: "reqDelivery", header: "Req. Delivery",
        cell: (row) => <CellInput disabled={disabled} value={row.reqDelivery} onChange={(e) => updateSchedule(row.id, "reqDelivery", e.target.value)} placeholder="dd-Mon-yyyy" width="w-28" />,
      },
      {
        key: "actionLog", header: "Action Log",
        cell: (row) => <CellInput disabled={disabled} value={row.actionLog} onChange={(e) => updateSchedule(row.id, "actionLog", e.target.value)} placeholder="Notes…" width="w-full min-w-[160px]" />,
      },
    ];

    if (disabled) return baseColumns;

    return [...baseColumns, {
      key: "actions", header: "",
      cell: (row) => (
        <div className="flex justify-center px-2 py-1">
          <button onClick={() => deleteSchedule(row.id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Remove">
            <Icon name="delete" size={13} />
          </button>
        </div>
      ),
    }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const purchaseItemsFooter = (
    <>
      {!disabled && (
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-[11px] font-medium text-[#884D70] hover:bg-[#884D70]/8 px-2 py-1 rounded-lg transition-colors -ml-1"
        >
          <Icon name="add" size={13} />
          Add Row
        </button>
      )}

      <div className="flex items-center gap-4">
        {!disabled && (
          <>
            <span className="text-[10px] text-gray-400">Rows: <strong className="text-gray-600">{items.length}</strong></span>
            <span className="text-gray-300">|</span>
          </>
        )}
        <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">₹{netAmount.toLocaleString("en-US")}</strong></span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-400">Tax (18%): <strong className="text-slate-700 tabular-nums">₹{taxEst.toLocaleString("en-US")}</strong></span>
      </div>
    </>
  );

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800 bg-transparent">

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        {/* ═══ PAGE HEADER ═══ */}
        <div className="flex items-center px-1 pb-2 gap-2">
          <Breadcrumbs items={
            isCreate
              ? [
                  { label: "Dashboard", href: "/" },
                  { label: "Purchase Orders", href: "/purchase-order" },
                  { label: "Create" },
                ]
              : isView
              ? [
                  { label: "Dashboard", href: "/" },
                  { label: "Purchase Orders", href: "/purchase-order" },
                  { label: poNumber },
                ]
              : [
                  { label: "Dashboard", href: "/" },
                  { label: "Purchase Orders", href: "/purchase-order" },
                  { label: poNumber, href: `/purchase-order/${orderId}` },
                  { label: "Edit" },
                ]
          } />
          <div className="flex-1" />
          {isView && (
            <>
              <StatusBadge label={statusInfo.label} color={statusInfo.color} />
              <div className="w-px h-4 bg-gray-200" />
              <ButtonLink href={`/purchase-order/${orderId}/edit`} variant="pill-primary">Edit PO</ButtonLink>
            </>
          )}
        </div>

        {/* ═══ PROGRESS STEPPER ═══ */}
        {!isView && <ProgressPill steps={steps} />}

        {/* ── Order Details ── */}
        <Card className="card-glass">
          <CardHeader title="Order Details" hint={disabled ? undefined : "Tab · Enter to move between fields"} />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormCombobox
              disabled={disabled} label="PO Type"
              value={orderDetails.poType}
              onChange={(v) => handleOrderDetailsChange("poType", v)}
              options={PO_TYPE_OPTIONS}
            />
            <FormInput
              disabled={disabled} label="Truck No"
              value={orderDetails.truckNo}
              onChange={(v) => handleOrderDetailsChange("truckNo", v)}
              placeholder="MH-12-AQ-9082"
            />
            <FormInput
              disabled={disabled} label="Driver Details"
              value={orderDetails.driverDetails}
              onChange={(v) => handleOrderDetailsChange("driverDetails", v)}
              placeholder="Ramesh Kumar (+91 98...)"
            />
            <FormInput
              disabled={disabled} label="Delivery Location"
              value={orderDetails.deliveryLocation}
              onChange={(v) => handleOrderDetailsChange("deliveryLocation", v)}
              placeholder="Mumbai Port Terminal 2"
            />
            <FormCombobox
              disabled={disabled} label="Currency"
              value={orderDetails.currency}
              onChange={(v) => handleOrderDetailsChange("currency", v)}
              options={CURRENCY_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Shipment Terms"
              value={orderDetails.shipmentTerms}
              onChange={(v) => handleOrderDetailsChange("shipmentTerms", v)}
              options={SHIPMENT_TERMS_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Payment Terms"
              value={orderDetails.paymentTerms}
              onChange={(v) => handleOrderDetailsChange("paymentTerms", v)}
              options={PAYMENT_TERMS_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Transporter"
              value={orderDetails.transporter}
              onChange={(v) => handleOrderDetailsChange("transporter", v)}
              options={TRANSPORTER_OPTIONS}
            />
          </div>
        </Card>

        {/* ── Purchase Items ── */}
        <ExcelTable<PurchaseItem>
          columns={purchaseItemColumns}
          data={items}
          rowKey={(row) => String(row.id)}
          className="card-glass rounded-xl relative z-0"
          cellClassName="px-1 py-0.5"
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Purchase Items</h2>}
          statusBarClassName="px-3 py-1.5 flex items-center justify-between rounded-b-xl"
          statusBar={purchaseItemsFooter}
          onReorder={disabled ? undefined : reorderItems}
        />

        {/* ── Schedule ── */}
        <ExcelTable<ScheduleRow>
          columns={scheduleColumns}
          data={scheduleRows}
          rowKey={(row) => String(row.id)}
          className="card-glass rounded-xl"
          cellClassName="px-1 py-0.5"
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Schedule</h2>}
          statusBarClassName="px-3 py-1.5 flex items-center justify-between rounded-b-xl"
          statusBar={
            disabled ? undefined : (
              <button
                onClick={addSchedule}
                className="flex items-center gap-1 text-[11px] font-medium text-[#884D70] hover:bg-[#884D70]/8 px-2 py-1 rounded-lg transition-colors -ml-1"
              >
                <Icon name="add" size={13} />
                Add Row
              </button>
            )
          }
          onReorder={disabled ? undefined : reorderSchedule}
        />

        {/* ── Shipment Logs / Test Samples / Remarks ── */}
        <TabbedTable
          tabs={[
            { label: "Shipment Logs", content: <div className="py-3 text-center text-[11px] text-gray-400">Shipment Logs</div> },
            { label: "Test Samples", content: <div className="py-3 text-center text-[11px] text-gray-400">Test Samples</div> },
            { label: "Remarks", content: <div className="py-3 text-center text-[11px] text-gray-400">Remarks</div> },
          ]}
        />

      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <StickyFooter
        stats={[
          { label: "Total Qty", value: totalQty.toLocaleString("en-US") },
          { label: "Net Amount", value: `₹${netAmount.toLocaleString("en-US")}` },
          { label: "Tax Est.", value: `₹${taxEst.toLocaleString("en-US")}` },
          { label: "Grand Total", value: `₹${(netAmount + taxEst).toLocaleString("en-US")}`, highlight: true },
        ]}
        actions={
          isCreate ? (
            <>
              <ButtonLink href="/purchase-order" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-secondary" icon="save">Save as Draft</Button>
              <Button variant="cta-sunset" icon="check">Submit PO</Button>
            </>
          ) : isEdit ? (
            <>
              <ButtonLink href={`/purchase-order/${orderId}`} variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="pill-secondary">Save Changes</Button>
              <Button variant="cta-sunset" icon="check">Submit PO</Button>
            </>
          ) : (
            <>
              <ButtonLink href="/purchase-order" variant="pill-ghost">Back to List</ButtonLink>
              <ButtonLink href={`/purchase-order/${orderId}/edit`} variant="cta-sunset">Edit PO</ButtonLink>
            </>
          )
        }
      />

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(image) => {
          if (selectedItemId !== null) {
            updateItem(selectedItemId, "imageUrl", image.src);
          }
          setIsGalleryOpen(false);
        }}
      />

    </div>
  );
}
