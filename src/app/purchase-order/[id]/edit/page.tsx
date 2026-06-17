"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import type { SelectOption } from "@/components/ui/FormSelect";
import { ExcelTable, type Column } from "@/components/table/DataTable";
import { TabBar, type TabBarItem } from "@/components/ui/Tabs";
import type { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderDetails {
  poType: string; truckNo: string; driver: string; delivery: string;
  currency: string; shipTerm: string; payTerm: string; transporter: string; notes: string;
}

interface PurchaseItem {
  id: number; name: string; qty: number; price: number;
  uom: string; taxCode: string; packaging: string;
}

interface ScheduleRow {
  id: number; phase: string; qty: number;
  reqDispatch: string; reqDelivery: string; actionLog: string;
}

// ── Options ───────────────────────────────────────────────────────────────────

const PO_TYPE_OPTIONS: SelectOption[]    = [{ label: "Paddler", value: "Paddler" }, { label: "Direct", value: "Direct" }, { label: "Consignment", value: "Consignment" }];
const CURRENCY_OPTIONS: SelectOption[]   = [{ label: "INR (₹)", value: "INR" }, { label: "USD ($)", value: "USD" }, { label: "EUR (€)", value: "EUR" }];
const SHIP_TERM_OPTIONS: SelectOption[]  = [{ label: "EXW - Ex Works", value: "EXW" }, { label: "FOB - Free on Board", value: "FOB" }];
const PAY_TERM_OPTIONS: SelectOption[]   = [{ label: "Net 30 Days", value: "Net30" }, { label: "15% Advance", value: "Advance15" }];
const TRANSPORTER_OPTIONS: SelectOption[]= [{ label: "SafeLogistics Pvt Ltd", value: "SafeLogistics" }, { label: "Global Freight", value: "GlobalFreight" }];

type InputFieldDef  = { type: "input";  key: keyof OrderDetails; label: string; placeholder?: string };
type SelectFieldDef = { type: "select"; key: keyof OrderDetails; label: string; options: SelectOption[] };
type FieldDef = InputFieldDef | SelectFieldDef;

const ORDER_FIELDS: FieldDef[] = [
  { type: "select", key: "poType",      label: "PO Type",           options: PO_TYPE_OPTIONS },
  { type: "input",  key: "truckNo",     label: "Truck No",          placeholder: "MH-12-AQ-9082" },
  { type: "input",  key: "driver",      label: "Driver Details",    placeholder: "Driver name & contact" },
  { type: "input",  key: "delivery",    label: "Delivery Location", placeholder: "Mumbai Port Terminal 2" },
  { type: "select", key: "currency",    label: "Currency",          options: CURRENCY_OPTIONS },
  { type: "select", key: "shipTerm",    label: "Shipment Terms",    options: SHIP_TERM_OPTIONS },
  { type: "select", key: "payTerm",     label: "Payment Terms",     options: PAY_TERM_OPTIONS },
  { type: "select", key: "transporter", label: "Transporter",       options: TRANSPORTER_OPTIONS },
];

const TABS: TabBarItem[] = [
  { label: "Schedule" }, { label: "Shipment Logs" },
  { label: "Test Samples" }, { label: "Remarks" },
];

const ITEM_COLS: Column[] = [
  { key: "name", header: "Item Name" }, { key: "qty", header: "Qty" },
  { key: "price", header: "Price (₹)" }, { key: "uom", header: "UOM" },
  { key: "taxCode", header: "Tax Code" }, { key: "packaging", header: "Packaging" },
  { key: "img", header: "Img" }, { key: "delete", header: "" },
];

const SCHEDULE_COLS: Column[] = [
  { key: "phase", header: "Delivery Phase" }, { key: "qty", header: "Qty" },
  { key: "reqDispatch", header: "Req. Dispatch" }, { key: "reqDelivery", header: "Req. Delivery" },
  { key: "actionLog", header: "Action Log" }, { key: "delete", header: "" },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

interface PORecord {
  poNumber: string;
  orderDetails: Partial<OrderDetails>;
  items: PurchaseItem[];
  scheduleRows: ScheduleRow[];
}

const MOCK_POS: Record<string, PORecord> = {
  "PO-001": {
    poNumber: "PO-2024-00139",
    orderDetails: { poType: "Paddler", truckNo: "MH-05-1234", driver: "Shivraj Patil", delivery: "Mumbai Port Terminal 2", currency: "USD", shipTerm: "EXW", payTerm: "Net30", transporter: "SafeLogistics", notes: "Handle with care. Ensure packaging is sealed before dispatch." },
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
    orderDetails: { poType: "Direct", truckNo: "KA01-9988", driver: "Amit S.", delivery: "Delhi Warehouse A", currency: "USD", shipTerm: "FOB", payTerm: "Advance15", transporter: "GlobalFreight", notes: "" },
    items: [
      { id: 1, name: "Hydraulic Seal Kit", qty: 45, price: 3400, uom: "Sets", taxCode: "GST_12", packaging: "Plastic" },
    ],
    scheduleRows: [
      { id: 1, phase: "Initial Batch", qty: 45, reqDispatch: "01-Dec-2023", reqDelivery: "05-Dec-2023", actionLog: "Scheduled" },
    ],
  },
};

const EMPTY_ORDER: OrderDetails = { poType: "", truckNo: "", driver: "", delivery: "", currency: "", shipTerm: "", payTerm: "", transporter: "", notes: "" };
const FALLBACK: PORecord = { poNumber: "Unknown PO", orderDetails: {}, items: [], scheduleRows: [] };

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditPurchaseOrderPage() {
  const params = useParams();
  const id = params.id as string;
  const po = MOCK_POS[id] ?? FALLBACK;

  const [order, setOrder]       = useState<OrderDetails>({ ...EMPTY_ORDER, ...po.orderDetails });
  const [items, setItems]       = useState<PurchaseItem[]>(po.items);
  const [schedule, setSchedule] = useState<ScheduleRow[]>(po.scheduleRows);
  const [activeTab, setActiveTab]       = useState(0);
  const [isGalleryOpen, setIsGalleryOpen]   = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const setField = (key: keyof OrderDetails, value: string) =>
    setOrder((prev) => ({ ...prev, [key]: value }));

  const addItem = useCallback(() => {
    setItems((p) => [...p, { id: p.length + 1, name: "", qty: 0, price: 0, uom: "", taxCode: "", packaging: "" }]);
  }, []);
  const deleteItem = useCallback((id: number) => setItems((p) => p.filter((r) => r.id !== id)), []);

  const addSchedule = useCallback(() => {
    setSchedule((p) => [...p, { id: p.length + 1, phase: "", qty: 0, reqDispatch: "", reqDelivery: "", actionLog: "" }]);
  }, []);
  const deleteSchedule = useCallback((id: number) => setSchedule((p) => p.filter((r) => r.id !== id)), []);

  const totalQty  = items.reduce((s, i) => s + i.qty, 0);
  const netAmount = items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxEst    = Math.round(netAmount * 0.18);

  const inputCls = "px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all";

  // ── Item cell renderer ────────────────────────────────────────────────────────

  const renderItemCell = (row: PurchaseItem, col: Column): ReactNode => {
    switch (col.key) {
      case "name":      return <input defaultValue={row.name}      placeholder="Item name…"  className={`w-full min-w-[160px] ${inputCls}`} />;
      case "qty":       return <input defaultValue={row.qty || ""}  placeholder="0" type="number" className={`w-16 text-center tabular-nums ${inputCls}`} />;
      case "price":     return <input defaultValue={row.price || ""} placeholder="0.00" type="number" className={`w-24 font-semibold text-right tabular-nums ${inputCls}`} />;
      case "uom":       return <input defaultValue={row.uom}       placeholder="Kg"          className={`w-14 text-center ${inputCls}`} />;
      case "taxCode":   return <input defaultValue={row.taxCode}   placeholder="GST_18"      className={`w-20 text-center ${inputCls}`} />;
      case "packaging": return <input defaultValue={row.packaging} placeholder="Box / Roll…" className={`w-28 ${inputCls}`} />;
      case "img": return (
        <button onClick={() => { setSelectedItemId(row.id); setIsGalleryOpen(true); }} className="text-gray-300 hover:text-[#8470ff] transition-colors" title="Attach image">
          <Icon name="attachment" size={13} />
        </button>
      );
      case "delete": return (
        <button onClick={() => deleteItem(row.id)} className="text-gray-300 hover:text-red-400 transition-colors" title="Remove">
          <Icon name="delete" size={13} />
        </button>
      );
      default: return null;
    }
  };

  // ── Schedule cell renderer ────────────────────────────────────────────────────

  const renderScheduleCell = (row: ScheduleRow, col: Column): ReactNode => {
    switch (col.key) {
      case "phase":       return <input defaultValue={row.phase}       placeholder="Phase name…"  className={`w-full min-w-[160px] ${inputCls}`} />;
      case "qty":         return <input defaultValue={row.qty || ""}   placeholder="0" type="number" className={`w-16 text-center tabular-nums font-semibold ${inputCls}`} />;
      case "reqDispatch": return <input defaultValue={row.reqDispatch} placeholder="dd-Mon-yyyy"  className={`w-28 ${inputCls}`} />;
      case "reqDelivery": return <input defaultValue={row.reqDelivery} placeholder="dd-Mon-yyyy"  className={`w-28 ${inputCls}`} />;
      case "actionLog":   return <input defaultValue={row.actionLog}   placeholder="Notes…"       className={`w-full min-w-[160px] ${inputCls}`} />;
      case "delete": return (
        <button onClick={() => deleteSchedule(row.id)} className="text-gray-300 hover:text-red-400 transition-colors" title="Remove">
          <Icon name="delete" size={13} />
        </button>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />

      <DashboardPageHeader
        title={`Edit · ${po.poNumber}`}
        breadcrumbs={[
          { label: "Dashboard",       href: "/" },
          { label: "Purchase Orders", href: "/purchase-order" },
          { label: po.poNumber,       href: `/purchase-order/${id}` },
          { label: "Edit" },
        ]}
        rightContent={<StatusBadge label="Editing" color="warning" pulse />}
      />

      <main className="flex-1 px-6 py-4 pb-20 bg-[#eaecf1] space-y-3">

        {/* ── Order Details ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Order Details</h2>
            <span className="text-[10px] text-gray-400">Tab · Enter to move between fields</span>
          </div>
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            {ORDER_FIELDS.map((f) =>
              f.type === "select" ? (
                <FormSelect key={f.key} label={f.label} value={order[f.key]} options={f.options} placeholder="Select…" onChange={(v) => setField(f.key, v)} />
              ) : (
                <FormInput  key={f.key} label={f.label} value={order[f.key]} placeholder={f.placeholder} onChange={(v) => setField(f.key, v)} />
              )
            )}
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Notes</h2>
          </div>
          <div className="px-5 py-3">
            <textarea
              rows={3}
              value={order.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Enter material grade and special handling instructions…"
              className="w-full px-3 py-2.5 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 text-slate-700 placeholder:text-gray-300 resize-none transition-all"
            />
          </div>
        </div>

        {/* ── Purchase Items ── */}
        <ExcelTable
          columns={ITEM_COLS}
          data={items}
          rowKey={(row) => String(row.id)}
          renderCell={renderItemCell}
          header={
            <>
              <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Purchase Items</h2>
              <button onClick={addItem} className="flex items-center gap-1 text-[11px] font-medium text-[#8470ff] hover:bg-[#8470ff]/8 px-2.5 py-1 rounded-lg transition-colors">
                <Icon name="add" size={13} /> Add Row
              </button>
            </>
          }
          statusBar={
            <>
              <span className="text-[10px] text-gray-400">Rows: <strong className="text-gray-600">{items.length}</strong></span>
              <span className="text-gray-200">|</span>
              <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
              <span className="text-gray-200">|</span>
              <span className="text-[10px] text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">₹{netAmount.toLocaleString("en-US")}</strong></span>
              <span className="text-gray-200">|</span>
              <span className="text-[10px] text-gray-400">Tax (18%): <strong className="text-slate-700 tabular-nums">₹{taxEst.toLocaleString("en-US")}</strong></span>
            </>
          }
          className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          cellClassName="px-1 py-0.5 whitespace-nowrap text-left"
          statusBarClassName="px-4 py-2 bg-[#f8f9fc] border-t border-gray-100 flex items-center gap-6 rounded-b-xl"
          emptyMessage="No items added yet."
        />

        {/* ── Schedule / Tabs ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="flex items-center border-b border-gray-100 px-1">
            <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 0 && (
              <>
                <div className="flex-1" />
                <button onClick={addSchedule} className="flex items-center gap-1 text-[11px] font-medium text-[#8470ff] hover:bg-[#8470ff]/8 px-2.5 py-1 mr-1.5 rounded-lg transition-colors">
                  <Icon name="add" size={13} /> Add Row
                </button>
              </>
            )}
          </div>
          {activeTab === 0 ? (
            <ExcelTable
              columns={SCHEDULE_COLS}
              data={schedule}
              rowKey={(row) => String(row.id)}
              renderCell={renderScheduleCell}
              className=""
              cellClassName="px-1 py-0.5 whitespace-nowrap text-left"
              emptyMessage="No schedule rows added yet."
            />
          ) : (
            <div className="py-12 text-center text-[11px] text-gray-400">{TABS[activeTab].label} — coming soon</div>
          )}
        </div>

      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-10 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          Editing <strong className="text-slate-600">{po.poNumber}</strong>
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/purchase-order/${id}`}>
            <button className="text-[12px] font-medium text-gray-500 px-4 py-1.5 hover:bg-gray-100 rounded-full transition-colors">
              Cancel
            </button>
          </Link>
          <button className="text-[12px] font-medium text-gray-600 px-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            Save Changes
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
            Submit PO
          </button>
        </div>
      </div>

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(image) => { console.log("Image attached to item", selectedItemId, ":", image); }}
      />

    </div>
  );
}
