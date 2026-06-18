"use client";

import { useState, useCallback } from "react";
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

// ── Types & data ───────────────────────────────────────────────────────────────

interface PurchaseItem {
  id: number; name: string; qty: number; price: number;
  uom: string; taxCode: string; packaging: string;
}

interface ScheduleRow {
  id: number; phase: string; qty: number;
  reqDispatch: string; reqDelivery: string; actionLog: string;
}



// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreatePurchaseOrderPage() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [poType, setPoType] = useState("");
  const [currency, setCurrency] = useState("");
  const [shipmentTerms, setShipmentTerms] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [transporter, setTransporter] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [driverDetails, setDriverDetails] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");

  const [items, setItems] = useState<PurchaseItem[]>([]);

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);

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
          <button onClick={() => { setSelectedItemId(row.id); setIsGalleryOpen(true); }} className="text-gray-400 hover:text-[#8470ff] transition-colors" title="Attach image">
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

  const purchaseItemsHeader = (
    <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Purchase Items</h2>
  );

  const purchaseItemsFooter = (
    <>
      {/* left — below the serial-number column */}
      <button
        onClick={addItem}
        className="flex items-center gap-1 text-[11px] font-medium text-[#8470ff] hover:bg-[#8470ff]/8 px-2 py-1 rounded-lg transition-colors -ml-1"
      >
        <Icon name="add" size={13} />
        Add Row
      </button>

      {/* right — summary stats */}
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
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />
      <SecondaryNav />

      {/* ═══ PAGE HEADER ═══ */}
      <DashboardPageHeader
        title="Create Purchase Order"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Purchase Orders", href: "/purchase-order" },
          { label: "Create" },
        ]}
        rightContent={<StatusBadge label="Draft PO-9284" color="warning" pulse />}
      />

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 px-6 py-4 pb-20 bg-[#eaecf1] space-y-3">

        {/* ── Progress Bar ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)] px-5 py-3">
          <div className="flex items-center gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4 flex-1 last:flex-none">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[8px] font-bold transition-all duration-300 ${
                    step.complete ? "bg-[#8470ff] text-white" : "border border-gray-200 text-gray-300"
                  }`}>
                    {step.complete ? (
                      <svg width="8" height="7" viewBox="0 0 8 7" fill="none"><path d="M1 3.5L3 5.5L7 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap transition-colors duration-300 ${
                    step.complete ? "text-[#8470ff]" : "text-gray-400"
                  }`}>{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px transition-colors duration-500" style={{ background: step.complete ? "#8470ff" : "#e5e7eb" }} />
                )}
              </div>
            ))}
            <div className="ml-auto pl-4 border-l border-gray-100 shrink-0 text-right">
              <div className="text-[10px] text-gray-400 leading-none mb-0.5">Progress</div>
              <div className="text-[11px] font-semibold text-[#8470ff] leading-none">
                {Math.round((completedCount / steps.length) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* ── Order Details ── */}
        <Card>
          <CardHeader title="Order Details" hint="Tab · Enter to move between fields" />
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            <FormCombobox
              label="PO Type"
              value={poType}
              onChange={setPoType}
              options={[
                { label: "Paddler", value: "paddler" },
                { label: "Direct", value: "direct" },
                { label: "Consignment", value: "consignment" },
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
                { label: "EXW - Ex Works", value: "EXW" },
                { label: "FOB - Free on Board", value: "FOB" },
                { label: "CIF - Cost Insurance Freight", value: "CIF" },
                { label: "DDP - Delivered Duty Paid", value: "DDP" },
              ]}
            />
            <FormCombobox
              label="Payment Terms"
              value={paymentTerms}
              onChange={setPaymentTerms}
              options={[
                { label: "Net 30 Days", value: "net30" },
                { label: "Net 60 Days", value: "net60" },
                { label: "15% Advance", value: "advance15" },
                { label: "50% Advance", value: "advance50" },
                { label: "100% Advance", value: "advance100" },
              ]}
            />
            <FormCombobox
              label="Transporter"
              value={transporter}
              onChange={setTransporter}
              options={[
                { label: "SafeLogistics Pvt Ltd", value: "safelogistics" },
                { label: "Global Freight", value: "globalfreight" },
                { label: "BlueDart Express", value: "bluedart" },
                { label: "DTDC Courier", value: "dtdc" },
              ]}
            />
          </div>
        </Card>

        {/* ── Purchase Items ── */}
        <ExcelTable<PurchaseItem>
          columns={purchaseItemColumns}
          data={items}
          rowKey={(row) => String(row.id)}
          className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          cellClassName="px-1 py-0.5"
          header={purchaseItemsHeader}
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
          className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          cellClassName="px-1 py-0.5"
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Schedule</h2>}
          statusBarClassName="px-3 py-1.5 flex items-center justify-between rounded-b-xl"
          statusBar={
            <button
              onClick={addSchedule}
              className="flex items-center gap-1 text-[11px] font-medium text-[#8470ff] hover:bg-[#8470ff]/8 px-2 py-1 rounded-lg transition-colors -ml-1"
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
          <>
            <ButtonLink href="/purchase-order" variant="pill-ghost">Cancel</ButtonLink>
            <Button variant="pill-secondary">Save as Draft</Button>
            <Button variant="pill-primary" icon="check">Submit PO</Button>
          </>
        }
      />

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(image) => { console.log("Selected image for item", selectedItemId, ":", image); }}
      />

    </div>
  );
}