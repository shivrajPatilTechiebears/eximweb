"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
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
  MOCK_SHIPMENTS, STATUS_STYLE,
  PURCHASE_ORDER_OPTIONS, VENDOR_OPTIONS, SHIPMENT_TYPE_OPTIONS, TRANSPORT_MODE_OPTIONS,
  TRANSPORTER_OPTIONS, ASSET_TYPE_OPTIONS, INCOTERMS_OPTIONS, CLEARANCE_STATUS_OPTIONS,
  DESTINATION_LOCATION_OPTIONS, ASSET_NUMBER_LABEL, DEFAULT_ASSET_NUMBER_LABEL,
  SHIPMENT_DETAIL_KEYS, TRANSPORTER_ROUTE_KEYS, CUSTOMS_SCHEDULE_KEYS,
} from "./types";
import type { ShipmentDetailsFields, ShipmentLineItem, ScheduleRow } from "./types";

export type ShipmentFormProps = {
  mode: "view" | "edit";
  shipmentId?: string;
};

const DEFAULT_DETAILS: ShipmentDetailsFields = {
  purchaseOrderId: "", vendorId: "", shipmentType: "", transportMode: "", trackingNumber: "",
  transporterName: "", transporterMobile: "", driverName: "", driverMobile: "", driverLicenseNo: "",
  assetType: "", assetNumber: "",
  originAddress: "", originCity: "", originState: "", originCountry: "", originPincode: "", originPort: "",
  destinationAddress: "", destinationCity: "", destinationState: "", destinationCountry: "", destinationPincode: "", destinationPort: "",
  destinationLocationId: "",
  estimatedDepartureDate: "", actualDepartureDate: "", estimatedArrivalDate: "", actualArrivalDate: "",
  billOfLadingNumber: "", airwayBillNumber: "", invoiceNumber: "", packingListNumber: "",
  countryOfOrigin: "", portOfLoading: "", portOfDischarge: "", incoterms: "", customsDuty: 0,
  clearanceStatus: "", clearanceDate: "",
  internalNotes: "",
};

// ── Line item image cell — shared by the disabled(view) and editable renderings ──

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

export function ShipmentForm({ mode, shipmentId }: ShipmentFormProps) {
  const isView = mode === "view";
  const disabled = isView;

  const record = shipmentId ? MOCK_SHIPMENTS[shipmentId] : undefined;

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [details, setDetails] = useState<ShipmentDetailsFields>({ ...DEFAULT_DETAILS, ...record?.details });
  const [lineItems, setLineItems] = useState<ShipmentLineItem[]>(record?.lineItems ?? []);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(record?.scheduleRows ?? []);

  const handleDetailsChange = useCallback(<K extends keyof ShipmentDetailsFields>(key: K, value: ShipmentDetailsFields[K]) => {
    setDetails((p) => ({ ...p, [key]: value }));
  }, []);

  const addLineItem = useCallback(() => {
    setLineItems((p) => [...p, { id: Math.max(0, ...p.map((r) => r.id)) + 1, description: "", scheduledQuantity: 0, unit: "", unitWeight: 0, packageType: "", numberOfPackages: 0 }]);
  }, []);

  const deleteLineItem = useCallback((id: number) => setLineItems((p) => p.filter((r) => r.id !== id)), []);

  const updateLineItem = useCallback(<K extends keyof Omit<ShipmentLineItem, "id">>(id: number, key: K, value: ShipmentLineItem[K]) => {
    setLineItems((p) => p.map((r) => r.id === id ? { ...r, [key]: value } : r));
  }, []);

  const reorderLineItems = useCallback((from: number, to: number) => {
    setLineItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const addSchedule = useCallback(() => {
    setScheduleRows((p) => [...p, { id: Math.max(0, ...p.map((r) => r.id)) + 1, scheduledDate: "", scheduledQuantity: 0, status: "", actualDeliveryDate: "", remarks: "" }]);
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

  const totalQty = lineItems.reduce((s, i) => s + i.scheduledQuantity, 0);
  const totalWeight = lineItems.reduce((s, i) => s + i.scheduledQuantity * i.unitWeight, 0);
  const totalPackages = lineItems.reduce((s, i) => s + i.numberOfPackages, 0);

  const steps = [
    {
      label: "Shipment Details", icon: "local_shipping",
      complete: SHIPMENT_DETAIL_KEYS.every((k) => Boolean(details[k])),
    },
    {
      label: "Transporter & Route", icon: "map",
      complete: TRANSPORTER_ROUTE_KEYS.every((k) => Boolean(details[k])),
    },
    {
      label: "Line Items", icon: "inventory_2",
      complete: lineItems.length > 0 && lineItems.every(({ id: _id, imageUrl: _imageUrl, ...fields }) => Object.values(fields).every(Boolean)),
    },
    {
      label: "Customs & Schedule", icon: "fact_check",
      complete: CUSTOMS_SCHEDULE_KEYS.every((k) => Boolean(details[k])),
    },
    { label: "Review & Submit", icon: "send", complete: false },
  ];

  const shipmentNumber = record?.shipmentNumber ?? "SHP-9284";
  const statusInfo = record ? STATUS_STYLE[record.status] : STATUS_STYLE.DRAFT;
  const assetNumberLabel = ASSET_NUMBER_LABEL[details.assetType] ?? DEFAULT_ASSET_NUMBER_LABEL;

  // ── Line Items columns ─────────────────────────────────────────────────────

  const lineItemColumns = useMemo<Column<ShipmentLineItem>[]>(() => {
    const baseColumns: Column<ShipmentLineItem>[] = [
      {
        key: "description", header: "Description",
        cell: (row) => <CellInput disabled={disabled} value={row.description} onChange={(e) => updateLineItem(row.id, "description", e.target.value)} placeholder="Item description…" width="w-full min-w-[160px]" />,
      },
      {
        key: "scheduledQuantity", header: "Qty",
        cell: (row) => <CellInput disabled={disabled} value={row.scheduledQuantity} onChange={(e) => updateLineItem(row.id, "scheduledQuantity", Number(e.target.value))} placeholder="0" type="number" align="center" width="w-16" />,
      },
      {
        key: "unit", header: "Unit",
        cell: (row) => <CellInput disabled={disabled} value={row.unit} onChange={(e) => updateLineItem(row.id, "unit", e.target.value)} placeholder="Kg / Roll…" align="center" width="w-16" />,
      },
      {
        key: "unitWeight", header: "Unit Wt (Kg)",
        cell: (row) => <CellInput disabled={disabled} value={row.unitWeight} onChange={(e) => updateLineItem(row.id, "unitWeight", Number(e.target.value))} placeholder="0.0" type="number" align="right" width="w-20" />,
      },
      {
        key: "totalWeight", header: "Total Wt (Kg)",
        cell: (row) => <span className="px-2 py-1.5 text-[11px] font-semibold text-slate-900 tabular-nums block text-right w-24">{(row.scheduledQuantity * row.unitWeight).toLocaleString("en-US")}</span>,
      },
      {
        key: "packageType", header: "Package Type",
        cell: (row) => <CellInput disabled={disabled} value={row.packageType} onChange={(e) => updateLineItem(row.id, "packageType", e.target.value)} placeholder="Pallet/Drum/Carton/Bulk" width="w-32" />,
      },
      {
        key: "numberOfPackages", header: "No. of Pkgs",
        cell: (row) => <CellInput disabled={disabled} value={row.numberOfPackages} onChange={(e) => updateLineItem(row.id, "numberOfPackages", Number(e.target.value))} placeholder="0" type="number" align="center" width="w-16" />,
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
          <button onClick={() => deleteLineItem(row.id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Remove">
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
        key: "scheduledDate", header: "Scheduled Date",
        cell: (row) => <CellInput disabled={disabled} value={row.scheduledDate} onChange={(e) => updateSchedule(row.id, "scheduledDate", e.target.value)} placeholder="dd-Mon-yyyy" width="w-28" />,
      },
      {
        key: "scheduledQuantity", header: "Qty",
        cell: (row) => <CellInput disabled={disabled} value={row.scheduledQuantity} onChange={(e) => updateSchedule(row.id, "scheduledQuantity", Number(e.target.value))} placeholder="0" type="number" align="center" width="w-16" className="font-semibold tabular-nums" />,
      },
      {
        key: "status", header: "Status",
        cell: (row) => <CellInput disabled={disabled} value={row.status} onChange={(e) => updateSchedule(row.id, "status", e.target.value)} placeholder="Pending/In Transit/Delivered/Delayed" width="w-full min-w-[160px]" />,
      },
      {
        key: "actualDeliveryDate", header: "Actual Delivery",
        cell: (row) => <CellInput disabled={disabled} value={row.actualDeliveryDate} onChange={(e) => updateSchedule(row.id, "actualDeliveryDate", e.target.value)} placeholder="dd-Mon-yyyy" width="w-28" />,
      },
      {
        key: "remarks", header: "Remarks",
        cell: (row) => <CellInput disabled={disabled} value={row.remarks} onChange={(e) => updateSchedule(row.id, "remarks", e.target.value)} placeholder="Notes…" width="w-full min-w-[160px]" />,
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

  const lineItemsFooter = (
    <>
      {!disabled && (
        <button
          onClick={addLineItem}
          className="flex items-center gap-1 text-[11px] font-medium text-[#884D70] hover:bg-[#884D70]/8 px-2 py-1 rounded-lg transition-colors -ml-1"
        >
          <Icon name="add" size={13} />
          Add Row
        </button>
      )}

      <div className="flex items-center gap-4">
        {!disabled && (
          <>
            <span className="text-[10px] text-gray-400">Rows: <strong className="text-gray-600">{lineItems.length}</strong></span>
            <span className="text-gray-300">|</span>
          </>
        )}
        <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-400">Total Weight: <strong className="text-slate-700 tabular-nums">{totalWeight.toLocaleString("en-US")} Kg</strong></span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-400">Total Packages: <strong className="text-slate-700 tabular-nums">{totalPackages}</strong></span>
      </div>
    </>
  );

  return (
    <div className="flex-1 flex flex-col antialiased text-slate-800 bg-transparent">

      {/* ═══ PAGE HEADER ═══ */}
      <DashboardPageHeader
        breadcrumbs={
          isView
            ? [
                { label: "Dashboard", href: "/" },
                { label: "Shipments", href: "/shipments" },
                { label: shipmentNumber },
              ]
            : [
                { label: "Dashboard", href: "/" },
                { label: "Shipments", href: "/shipments" },
                { label: shipmentNumber, href: `/shipments/${shipmentId}` },
                { label: "Edit" },
              ]
        }
        rightContent={
          isView ? (
            <>
              <StatusBadge label={statusInfo.label} color={statusInfo.color} />
              <div className="w-px h-4 bg-gray-200" />
              <ButtonLink href={`/shipments/${shipmentId}/edit`} variant="pill-primary">Edit Shipment</ButtonLink>
            </>
          ) : (
            <StatusBadge label="Editing" color="warning" pulse />
          )
        }
      />

      {/* ═══ PROGRESS STEPPER ═══ */}
      {!isView && <ProgressPill steps={steps} />}

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        {/* ── Shipment Details ── */}
        <Card className="card-glass">
          <CardHeader title="Shipment Details" hint={disabled ? undefined : "Tab · Enter to move between fields"} />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormCombobox
              disabled={disabled} label="Purchase Order"
              value={details.purchaseOrderId}
              onChange={(v) => handleDetailsChange("purchaseOrderId", v)}
              options={PURCHASE_ORDER_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Vendor"
              value={details.vendorId}
              onChange={(v) => handleDetailsChange("vendorId", v)}
              options={VENDOR_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Shipment Type"
              value={details.shipmentType}
              onChange={(v) => handleDetailsChange("shipmentType", v)}
              options={SHIPMENT_TYPE_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Transport Mode"
              value={details.transportMode}
              onChange={(v) => handleDetailsChange("transportMode", v)}
              options={TRANSPORT_MODE_OPTIONS}
            />
            <FormInput
              disabled={disabled} label="Tracking Number"
              value={details.trackingNumber}
              onChange={(v) => handleDetailsChange("trackingNumber", v)}
              placeholder="MAEU771822"
            />
          </div>
        </Card>

        {/* ── Transporter & Vehicle ── */}
        <Card className="card-glass">
          <CardHeader title="Transporter & Vehicle" hint={disabled ? undefined : "Assigned by vendor after PO is sent"} />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormCombobox
              disabled={disabled} label="Transporter"
              value={details.transporterName}
              onChange={(v) => handleDetailsChange("transporterName", v)}
              options={TRANSPORTER_OPTIONS}
            />
            <FormInput
              disabled={disabled} label="Transporter Mobile"
              value={details.transporterMobile}
              onChange={(v) => handleDetailsChange("transporterMobile", v)}
              placeholder="+91 98000 00000"
            />
            <FormInput
              disabled={disabled} label="Driver Name"
              value={details.driverName}
              onChange={(v) => handleDetailsChange("driverName", v)}
              placeholder="Ramesh Kumar"
            />
            <FormInput
              disabled={disabled} label="Driver Mobile"
              value={details.driverMobile}
              onChange={(v) => handleDetailsChange("driverMobile", v)}
              placeholder="+91 98000 00000"
            />
            <FormInput
              disabled={disabled} label="Driver License No."
              value={details.driverLicenseNo}
              onChange={(v) => handleDetailsChange("driverLicenseNo", v)}
              placeholder="MH05 20230098171"
            />
            <FormCombobox
              disabled={disabled} label="Asset Type"
              value={details.assetType}
              onChange={(v) => handleDetailsChange("assetType", v)}
              options={ASSET_TYPE_OPTIONS}
            />
            <FormInput
              disabled={disabled} label={assetNumberLabel}
              value={details.assetNumber}
              onChange={(v) => handleDetailsChange("assetNumber", v)}
              placeholder="MH-12-AQ-9082"
            />
          </div>
        </Card>

        {/* ── Origin ── */}
        <Card className="card-glass">
          <CardHeader title="Origin" />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormInput disabled={disabled} label="Address" value={details.originAddress} onChange={(v) => handleDetailsChange("originAddress", v)} placeholder="Yangshan Deep Water Port" />
            <FormInput disabled={disabled} label="City" value={details.originCity} onChange={(v) => handleDetailsChange("originCity", v)} placeholder="Shanghai" />
            <FormInput disabled={disabled} label="State" value={details.originState} onChange={(v) => handleDetailsChange("originState", v)} placeholder="Shanghai" />
            <FormInput disabled={disabled} label="Country" value={details.originCountry} onChange={(v) => handleDetailsChange("originCountry", v)} placeholder="China" />
            <FormInput disabled={disabled} label="Pincode" value={details.originPincode} onChange={(v) => handleDetailsChange("originPincode", v)} placeholder="200000" />
            <FormInput disabled={disabled} label="Port" value={details.originPort} onChange={(v) => handleDetailsChange("originPort", v)} placeholder="Port of Shanghai" />
          </div>
        </Card>

        {/* ── Destination ── */}
        <Card className="card-glass">
          <CardHeader title="Destination" />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormInput disabled={disabled} label="Address" value={details.destinationAddress} onChange={(v) => handleDetailsChange("destinationAddress", v)} placeholder="Nhava Sheva Port Rd" />
            <FormInput disabled={disabled} label="City" value={details.destinationCity} onChange={(v) => handleDetailsChange("destinationCity", v)} placeholder="Mumbai" />
            <FormInput disabled={disabled} label="State" value={details.destinationState} onChange={(v) => handleDetailsChange("destinationState", v)} placeholder="Maharashtra" />
            <FormInput disabled={disabled} label="Country" value={details.destinationCountry} onChange={(v) => handleDetailsChange("destinationCountry", v)} placeholder="India" />
            <FormInput disabled={disabled} label="Pincode" value={details.destinationPincode} onChange={(v) => handleDetailsChange("destinationPincode", v)} placeholder="400707" />
            <FormInput disabled={disabled} label="Port" value={details.destinationPort} onChange={(v) => handleDetailsChange("destinationPort", v)} placeholder="Mumbai Port Terminal 2" />
            <FormCombobox disabled={disabled} label="Destination Location" value={details.destinationLocationId} onChange={(v) => handleDetailsChange("destinationLocationId", v)} options={DESTINATION_LOCATION_OPTIONS} />
          </div>
        </Card>

        {/* ── Transit Dates & Customs ── */}
        <Card className="card-glass">
          <CardHeader title="Transit Dates & Customs" hint={disabled ? undefined : "For import / export shipments"} />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormInput disabled={disabled} label="Est. Departure Date" value={details.estimatedDepartureDate} onChange={(v) => handleDetailsChange("estimatedDepartureDate", v)} placeholder="dd-Mon-yyyy" />
            <FormInput disabled={disabled} label="Actual Departure Date" value={details.actualDepartureDate} onChange={(v) => handleDetailsChange("actualDepartureDate", v)} placeholder="dd-Mon-yyyy" />
            <FormInput disabled={disabled} label="Est. Arrival Date" value={details.estimatedArrivalDate} onChange={(v) => handleDetailsChange("estimatedArrivalDate", v)} placeholder="dd-Mon-yyyy" />
            <FormInput disabled={disabled} label="Actual Arrival Date" value={details.actualArrivalDate} onChange={(v) => handleDetailsChange("actualArrivalDate", v)} placeholder="dd-Mon-yyyy" />
            <FormInput disabled={disabled} label="Bill of Lading No." value={details.billOfLadingNumber} onChange={(v) => handleDetailsChange("billOfLadingNumber", v)} placeholder="BL-2024-88291" />
            <FormInput disabled={disabled} label="Airway Bill No." value={details.airwayBillNumber} onChange={(v) => handleDetailsChange("airwayBillNumber", v)} placeholder="AWB-2024-00112" />
            <FormInput disabled={disabled} label="Invoice No." value={details.invoiceNumber} onChange={(v) => handleDetailsChange("invoiceNumber", v)} placeholder="INV-2024-4471" />
            <FormInput disabled={disabled} label="Packing List No." value={details.packingListNumber} onChange={(v) => handleDetailsChange("packingListNumber", v)} placeholder="PKL-2024-4471" />
            <FormInput disabled={disabled} label="Country of Origin" value={details.countryOfOrigin} onChange={(v) => handleDetailsChange("countryOfOrigin", v)} placeholder="China" />
            <FormInput disabled={disabled} label="Port of Loading" value={details.portOfLoading} onChange={(v) => handleDetailsChange("portOfLoading", v)} placeholder="Shanghai" />
            <FormInput disabled={disabled} label="Port of Discharge" value={details.portOfDischarge} onChange={(v) => handleDetailsChange("portOfDischarge", v)} placeholder="Mumbai (Nhava Sheva)" />
            <FormCombobox disabled={disabled} label="Incoterms" value={details.incoterms} onChange={(v) => handleDetailsChange("incoterms", v)} options={INCOTERMS_OPTIONS} />
            <FormInput disabled={disabled} label="Customs Duty (₹)" value={String(details.customsDuty)} onChange={(v) => handleDetailsChange("customsDuty", Number(v))} placeholder="0.00" type="number" />
            <FormCombobox disabled={disabled} label="Clearance Status" value={details.clearanceStatus} onChange={(v) => handleDetailsChange("clearanceStatus", v)} options={CLEARANCE_STATUS_OPTIONS} />
            <FormInput disabled={disabled} label="Clearance Date" value={details.clearanceDate} onChange={(v) => handleDetailsChange("clearanceDate", v)} placeholder="dd-Mon-yyyy" />
          </div>
        </Card>

        {/* ── Internal Notes ── */}
        <Card className="card-glass">
          <CardHeader title="Internal Notes" />
          <div className="px-5 py-4 grid grid-cols-1 gap-x-4 gap-y-3">
            <FormInput disabled={disabled} label="Notes" value={details.internalNotes} onChange={(v) => handleDetailsChange("internalNotes", v)} placeholder="Handle with care. Ensure packaging is sealed before dispatch." />
          </div>
        </Card>

        {/* ── Line Items ── */}
        <ExcelTable<ShipmentLineItem>
          columns={lineItemColumns}
          data={lineItems}
          rowKey={(row) => String(row.id)}
          className="card-glass rounded-xl relative z-0"
          cellClassName="px-1 py-0.5"
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Line Items</h2>}
          statusBarClassName="px-3 py-1.5 flex items-center justify-between rounded-b-xl"
          statusBar={lineItemsFooter}
          onReorder={disabled ? undefined : reorderLineItems}
        />

        {/* ── Delivery Schedule ── */}
        <ExcelTable<ScheduleRow>
          columns={scheduleColumns}
          data={scheduleRows}
          rowKey={(row) => String(row.id)}
          className="card-glass rounded-xl"
          cellClassName="px-1 py-0.5"
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Delivery Schedule</h2>}
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

        {/* ── Attachments / Customs Docs / Remarks ── */}
        <TabbedTable
          tabs={[
            { label: "Attachments", content: <div className="py-3 text-center text-[11px] text-gray-400">Attachments</div> },
            { label: "Customs Docs", content: <div className="py-3 text-center text-[11px] text-gray-400">Customs Docs</div> },
            { label: "Remarks", content: <div className="py-3 text-center text-[11px] text-gray-400">Remarks</div> },
          ]}
        />

      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <StickyFooter
        stats={[
          { label: "Line Items", value: lineItems.length.toLocaleString("en-US") },
          { label: "Total Qty", value: totalQty.toLocaleString("en-US") },
          { label: "Total Weight", value: `${totalWeight.toLocaleString("en-US")} Kg` },
          { label: "Total Packages", value: totalPackages.toLocaleString("en-US"), highlight: true },
        ]}
        actions={
          isView ? (
            <>
              <ButtonLink href="/shipments" variant="pill-ghost">Back to List</ButtonLink>
              <ButtonLink href={`/shipments/${shipmentId}/edit`} variant="cta-sunset">Edit Shipment</ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href={`/shipments/${shipmentId}`} variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="pill-secondary">Save Changes</Button>
              <Button variant="cta-sunset" icon="check">Submit Shipment</Button>
            </>
          )
        }
      />

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(image) => {
          if (selectedItemId !== null) {
            updateLineItem(selectedItemId, "imageUrl", image.src);
          }
          setIsGalleryOpen(false);
        }}
      />

    </div>
  );
}
