"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { CardHeader } from "@/components/ui/CardHeader";
import { Card } from "@/components/ui/Card";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TabbedTable } from "@/components/table/TabbedTable";
import { CellInput } from "@/components/ui/CellInput";

// ── Types & mock data ──────────────────────────────────────────────────────────

interface PurchaseItem {
  id: number; name: string; qty: number; price: number;
  uom: string; taxCode: string; packaging: string;
}

interface ScheduleRow {
  id: number; phase: string; qty: number;
  reqDispatch: string; reqDelivery: string; actionLog: string;
}

interface PORecord {
  poNumber: string;
  poType: string; truckNo: string; driverDetails: string; deliveryLocation: string;
  currency: string; shipmentTerms: string; paymentTerms: string; transporter: string;
  items: PurchaseItem[];
  scheduleRows: ScheduleRow[];
}

const MOCK_POS: Record<string, PORecord> = {
  "PO-001": {
    poNumber: "PO-2024-00139",
    poType: "paddler", truckNo: "MH-05-1234", driverDetails: "Shivraj Patil (+91 98765 43210)",
    deliveryLocation: "Mumbai Port Terminal 2", currency: "USD", shipmentTerms: "EXW",
    paymentTerms: "net30", transporter: "safelogistics",
    items: [
      { id: 1, name: "Steel Wire Mesh G12", qty: 150, price: 12500, uom: "Roll",  taxCode: "GST_18", packaging: "Boxed" },
      { id: 2, name: "Hydraulic Seal Kit",  qty: 45,  price: 3400,  uom: "Sets",  taxCode: "GST_12", packaging: "Plastic" },
    ],
    scheduleRows: [
      { id: 1, phase: "Initial Inventory Batch",   qty: 100, reqDispatch: "24-Oct-2023", reqDelivery: "26-Oct-2023", actionLog: "Waiting for supplier confirm" },
      { id: 2, phase: "Residual Balance Shipment", qty: 50,  reqDispatch: "02-Nov-2023", reqDelivery: "05-Nov-2023", actionLog: "Scheduled for Q4" },
    ],
  },
  "PO-002": {
    poNumber: "PO-2024-00140",
    poType: "direct", truckNo: "KA01-9988", driverDetails: "Amit Singh (+91 91234 56789)",
    deliveryLocation: "Delhi Warehouse A", currency: "USD", shipmentTerms: "FOB",
    paymentTerms: "advance15", transporter: "globalfreight",
    items: [
      { id: 1, name: "Hydraulic Seal Kit", qty: 45, price: 3400, uom: "Sets", taxCode: "GST_12", packaging: "Plastic" },
    ],
    scheduleRows: [
      { id: 1, phase: "Initial Batch", qty: 45, reqDispatch: "01-Dec-2023", reqDelivery: "05-Dec-2023", actionLog: "Scheduled" },
    ],
  },
};

const FALLBACK: PORecord = {
  poNumber: "Unknown PO",
  poType: "", truckNo: "", driverDetails: "", deliveryLocation: "",
  currency: "", shipmentTerms: "", paymentTerms: "", transporter: "",
  items: [], scheduleRows: [],
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function EditPurchaseOrderPage() {
  const params = useParams();
  const id = params.id as string;
  const po = MOCK_POS[id] ?? FALLBACK;

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [poType, setPoType] = useState(po.poType);
  const [currency, setCurrency] = useState(po.currency);
  const [shipmentTerms, setShipmentTerms] = useState(po.shipmentTerms);
  const [paymentTerms, setPaymentTerms] = useState(po.paymentTerms);
  const [transporter, setTransporter] = useState(po.transporter);
  const [truckNo, setTruckNo] = useState(po.truckNo);
  const [driverDetails, setDriverDetails] = useState(po.driverDetails);
  const [deliveryLocation, setDeliveryLocation] = useState(po.deliveryLocation);

  const [items, setItems] = useState<PurchaseItem[]>(po.items);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(po.scheduleRows);

  const addItem = useCallback(() => {
    setItems((p) => [...p, { id: p.length + 1, name: "", qty: 0, price: 0, uom: "", taxCode: "", packaging: "" }]);
  }, []);

  const deleteItem = useCallback((id: number) => setItems((p) => p.filter((r) => r.id !== id)), []);

  const updateItem = useCallback(<K extends keyof Omit<PurchaseItem, "id">>(id: number, key: K, value: PurchaseItem[K]) => {
    setItems((p) => p.map((r) => r.id === id ? { ...r, [key]: value } : r));
  }, []);

  const addSchedule = useCallback(() => {
    setScheduleRows((p) => [...p, { id: p.length + 1, phase: "", qty: 0, reqDispatch: "", reqDelivery: "", actionLog: "" }]);
  }, []);

  const deleteSchedule = useCallback((id: number) => setScheduleRows((p) => p.filter((r) => r.id !== id)), []);

  const updateSchedule = useCallback(<K extends keyof Omit<ScheduleRow, "id">>(id: number, key: K, value: ScheduleRow[K]) => {
    setScheduleRows((p) => p.map((r) => r.id === id ? { ...r, [key]: value } : r));
  }, []);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const netAmount = items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxEst = Math.round(netAmount * 0.18);

  const orderDetailsFields = { poType, currency, shipmentTerms, paymentTerms, transporter, truckNo, driverDetails, deliveryLocation };

  const steps = [
    { label: "Order Details", complete: Object.values(orderDetailsFields).every(Boolean) },
    {
      label: "Purchase Items",
      complete: items.length > 0 && items.every(({ id: _id, ...fields }) => Object.values(fields).every(Boolean)),
    },
    {
      label: "Schedule",
      complete: scheduleRows.length > 0 && scheduleRows.every(({ id: _id, ...fields }) => Object.values(fields).every(Boolean)),
    },
    { label: "Review & Submit", complete: false },
  ];
  const completedCount = steps.filter((s) => s.complete).length;

  // ── Purchase Items columns ────────────────────────────────────────────────

  const purchaseItemColumns: Column<PurchaseItem>[] = [
    {
      key: "name", header: "Item Name",
      cell: (row) => <CellInput value={row.name} onChange={(e) => updateItem(row.id, "name", e.target.value)} placeholder="Item name…" width="w-full min-w-[160px]" />,
    },
    {
      key: "qty", header: "Qty",
      cell: (row) => <CellInput value={row.qty || ""} onChange={(e) => updateItem(row.id, "qty", Number(e.target.value))} placeholder="0" type="number" align="center" width="w-16" />,
    },
    {
      key: "price", header: "Price (₹)",
      cell: (row) => <CellInput value={row.price || ""} onChange={(e) => updateItem(row.id, "price", Number(e.target.value))} placeholder="0.00" type="number" align="right" width="w-24" className="font-semibold text-slate-900" />,
    },
    {
      key: "uom", header: "UOM",
      cell: (row) => <CellInput value={row.uom} onChange={(e) => updateItem(row.id, "uom", e.target.value)} placeholder="Kg" align="center" width="w-14" />,
    },
    {
      key: "taxCode", header: "Tax Code",
      cell: (row) => <CellInput value={row.taxCode} onChange={(e) => updateItem(row.id, "taxCode", e.target.value)} placeholder="GST_18" align="center" width="w-20" />,
    },
    {
      key: "packaging", header: "Packaging",
      cell: (row) => <CellInput value={row.packaging} onChange={(e) => updateItem(row.id, "packaging", e.target.value)} placeholder="Box / Roll…" width="w-28" />,
    },
    {
      key: "img", header: "Img",
      cell: (row) => (
        <div className="flex justify-center px-2 py-1">
          <button onClick={() => { setSelectedItemId(row.id); setIsGalleryOpen(true); }} className="text-gray-400 hover:text-[#884D70] transition-colors" title="Attach image">
            <Icon name="attachment" size={13} />
          </button>
        </div>
      ),
    },
    {
      key: "actions", header: "",
      cell: (row) => (
        <div className="flex justify-center px-2 py-1">
          <button onClick={() => deleteItem(row.id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Remove">
            <Icon name="delete" size={13} />
          </button>
        </div>
      ),
    },
  ];

  const scheduleColumns: Column<ScheduleRow>[] = [
    {
      key: "phase", header: "Delivery Phase",
      cell: (row) => <CellInput value={row.phase} onChange={(e) => updateSchedule(row.id, "phase", e.target.value)} placeholder="Phase name…" width="w-full min-w-[160px]" />,
    },
    {
      key: "qty", header: "Qty",
      cell: (row) => <CellInput value={row.qty || ""} onChange={(e) => updateSchedule(row.id, "qty", Number(e.target.value))} placeholder="0" type="number" align="center" width="w-16" className="font-semibold tabular-nums" />,
    },
    {
      key: "reqDispatch", header: "Req. Dispatch",
      cell: (row) => <CellInput value={row.reqDispatch} onChange={(e) => updateSchedule(row.id, "reqDispatch", e.target.value)} placeholder="dd-Mon-yyyy" width="w-28" />,
    },
    {
      key: "reqDelivery", header: "Req. Delivery",
      cell: (row) => <CellInput value={row.reqDelivery} onChange={(e) => updateSchedule(row.id, "reqDelivery", e.target.value)} placeholder="dd-Mon-yyyy" width="w-28" />,
    },
    {
      key: "actionLog", header: "Action Log",
      cell: (row) => <CellInput value={row.actionLog} onChange={(e) => updateSchedule(row.id, "actionLog", e.target.value)} placeholder="Notes…" width="w-full min-w-[160px]" />,
    },
    {
      key: "actions", header: "",
      cell: (row) => (
        <div className="flex justify-center px-2 py-1">
          <button onClick={() => deleteSchedule(row.id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Remove">
            <Icon name="delete" size={13} />
          </button>
        </div>
      ),
    },
  ];

  const purchaseItemsFooter = (
    <>
      <button
        onClick={addItem}
        className="flex items-center gap-1 text-[11px] font-medium text-[#884D70] hover:bg-[#884D70]/8 px-2 py-1 rounded-lg transition-colors -ml-1"
      >
        <Icon name="add" size={13} />
        Add Row
      </button>
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-gray-400">Rows: <strong className="text-gray-600">{items.length}</strong></span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">₹{netAmount.toLocaleString("en-US")}</strong></span>
        <span className="text-gray-300">|</span>
        <span className="text-[10px] text-gray-400">Tax (18%): <strong className="text-slate-700 tabular-nums">₹{taxEst.toLocaleString("en-US")}</strong></span>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <FloatingNavbar />
      <SecondaryNav />

      {/* ═══ PAGE HEADER ═══ */}
      <DashboardPageHeader
        title={`Edit · ${po.poNumber}`}
        breadcrumbs={[
          { label: "Dashboard",       href: "/" },
          { label: "Purchase Orders", href: "/purchase-order" },
          { label: po.poNumber,       href: `/purchase-order/${id}` },
          { label: "Edit" },
        ]}
        rightContent={
          <div className="flex items-center gap-3">
            <StatusBadge label="Editing" color="warning" pulse />
            <div className="inline-flex items-center bg-[#FFDBCB]/10 border border-[#884D70]/20 rounded-full shadow-[0_4px_24px_rgba(136,77,112,0.13)] px-3 py-2 gap-2">
              <span className="text-[9px] font-medium text-[#884D70]/60 uppercase tracking-wide">Progress</span>
              <div className="flex items-center gap-1">
                {steps.map((step) => (
                  <div
                    key={step.label}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      step.complete ? 'w-8 bg-[#884D70]' : 'w-1.5 bg-[#FFDBCB]'
                    }`}
                    title={step.label}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-[#884D70] tabular-nums">
                {completedCount}/{steps.length}
              </span>
            </div>
          </div>
        }
      />

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        {/* ── Order Details ── */}
        <div className="relative">
          <Card className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <CardHeader title="Order Details" hint="Tab · Enter to move between fields" />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormCombobox
              label="PO Type"
              value={poType}
              onChange={setPoType}
              options={[
                { label: "Paddler",      value: "paddler" },
                { label: "Direct",       value: "direct" },
                { label: "Consignment",  value: "consignment" },
              ]}
            />
            <FormInput label="Truck No" value={truckNo} onChange={setTruckNo} placeholder="MH-12-AQ-9082" />
            <FormInput label="Driver Details" value={driverDetails} onChange={setDriverDetails} placeholder="Ramesh Kumar (+91 98...)" />
            <FormInput label="Delivery Location" value={deliveryLocation} onChange={setDeliveryLocation} placeholder="Mumbai Port Terminal 2" />
            <FormCombobox
              label="Currency"
              value={currency}
              onChange={setCurrency}
              options={[
                { label: "INR (₹)", value: "INR" },
                { label: "USD ($)", value: "USD" },
                { label: "EUR (€)", value: "EUR" },
              ]}
            />
            <FormCombobox
              label="Shipment Terms"
              value={shipmentTerms}
              onChange={setShipmentTerms}
              options={[
                { label: "EXW - Ex Works",               value: "EXW" },
                { label: "FOB - Free on Board",          value: "FOB" },
                { label: "CIF - Cost Insurance Freight", value: "CIF" },
                { label: "DDP - Delivered Duty Paid",    value: "DDP" },
              ]}
            />
            <FormCombobox
              label="Payment Terms"
              value={paymentTerms}
              onChange={setPaymentTerms}
              options={[
                { label: "Net 30 Days",   value: "net30" },
                { label: "Net 60 Days",   value: "net60" },
                { label: "15% Advance",   value: "advance15" },
                { label: "50% Advance",   value: "advance50" },
                { label: "100% Advance",  value: "advance100" },
              ]}
            />
            <FormCombobox
              label="Transporter"
              value={transporter}
              onChange={setTransporter}
              options={[
                { label: "SafeLogistics Pvt Ltd", value: "safelogistics" },
                { label: "Global Freight",        value: "globalfreight" },
                { label: "BlueDart Express",      value: "bluedart" },
                { label: "DTDC Courier",          value: "dtdc" },
              ]}
            />
          </div>
          </Card>
        </div>

        {/* ── Purchase Items ── */}
        <ExcelTable<PurchaseItem>
          columns={purchaseItemColumns}
          data={items}
          rowKey={(row) => String(row.id)}
          className="bg-white/50 backdrop-blur-xl rounded-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative z-0"
          cellClassName="px-1 py-0.5"
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Purchase Items</h2>}
          statusBarClassName="px-3 py-1.5 flex items-center justify-between rounded-b-xl"
          statusBar={purchaseItemsFooter}
          onReorder={(from, to) =>
            setItems((prev) => {
              const next = [...prev];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              return next;
            })
          }
        />

        {/* ── Schedule ── */}
        <ExcelTable<ScheduleRow>
          columns={scheduleColumns}
          data={scheduleRows}
          rowKey={(row) => String(row.id)}
          className="bg-white/50 backdrop-blur-xl rounded-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          cellClassName="px-1 py-0.5"
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Schedule</h2>}
          statusBarClassName="px-3 py-1.5 flex items-center justify-between rounded-b-xl"
          statusBar={
            <button
              onClick={addSchedule}
              className="flex items-center gap-1 text-[11px] font-medium text-[#884D70] hover:bg-[#884D70]/8 px-2 py-1 rounded-lg transition-colors -ml-1"
            >
              <Icon name="add" size={13} />
              Add Row
            </button>
          }
          onReorder={(from, to) =>
            setScheduleRows((prev) => {
              const next = [...prev];
              const [moved] = next.splice(from, 1);
              next.splice(to, 0, moved);
              return next;
            })
          }
        />

        {/* ── Shipment Logs / Test Samples / Remarks ── */}
        <TabbedTable
          tabs={[
            { label: "Shipment Logs", content: <div className="py-3 text-center text-[11px] text-gray-400">Shipment Logs</div> },
            { label: "Test Samples",  content: <div className="py-3 text-center text-[11px] text-gray-400">Test Samples</div> },
            { label: "Remarks",       content: <div className="py-3 text-center text-[11px] text-gray-400">Remarks</div> },
          ]}
        />

      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <StickyFooter
        stats={[
          { label: "Total Qty",   value: totalQty.toLocaleString("en-US") },
          { label: "Net Amount",  value: `₹${netAmount.toLocaleString("en-US")}` },
          { label: "Tax Est.",    value: `₹${taxEst.toLocaleString("en-US")}` },
          { label: "Grand Total", value: `₹${(netAmount + taxEst).toLocaleString("en-US")}`, highlight: true },
        ]}
        actions={
          <>
            <ButtonLink href={`/purchase-order/${id}`} variant="pill-ghost">Cancel</ButtonLink>
            <Button variant="pill-secondary">Save Changes</Button>
            <Button variant="pill-primary" icon="check">Submit PO</Button>
          </>
        }
      />

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(image) => { console.log("Image attached to item", selectedItemId, ":", image); }}
      />

    </div>
  );
}
