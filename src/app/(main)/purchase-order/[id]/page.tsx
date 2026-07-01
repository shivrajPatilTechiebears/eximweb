"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  { type: "select", key: "poType",      label: "PO Type",          options: PO_TYPE_OPTIONS },
  { type: "input",  key: "truckNo",     label: "Truck No",         placeholder: "MH-12-AQ-9082" },
  { type: "input",  key: "driver",      label: "Driver Details",   placeholder: "Driver name & contact" },
  { type: "input",  key: "delivery",    label: "Delivery Location", placeholder: "Mumbai Port Terminal 2" },
  { type: "select", key: "currency",    label: "Currency",         options: CURRENCY_OPTIONS },
  { type: "select", key: "shipTerm",    label: "Shipment Terms",   options: SHIP_TERM_OPTIONS },
  { type: "select", key: "payTerm",     label: "Payment Terms",    options: PAY_TERM_OPTIONS },
  { type: "select", key: "transporter", label: "Transporter",      options: TRANSPORTER_OPTIONS },
];

const TABS: TabBarItem[] = [
  { label: "Schedule" }, { label: "Shipment Logs" },
  { label: "Test Samples" }, { label: "Remarks" },
];

const ITEM_COLS: Column<PurchaseItem>[] = [
  { key: "name", header: "Item Name" }, { key: "qty", header: "Qty" },
  { key: "price", header: "Price (₹)" }, { key: "uom", header: "UOM" },
  { key: "taxCode", header: "Tax Code" }, { key: "packaging", header: "Packaging" },
];

const SCHEDULE_COLS: Column<ScheduleRow>[] = [
  { key: "phase", header: "Delivery Phase" }, { key: "qty", header: "Qty" },
  { key: "reqDispatch", header: "Req. Dispatch" }, { key: "reqDelivery", header: "Req. Delivery" },
  { key: "actionLog", header: "Action Log" },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

interface PORecord {
  poNumber: string; status: string;
  orderDetails: Partial<OrderDetails>;
  items: PurchaseItem[];
  scheduleRows: ScheduleRow[];
}

const MOCK_POS: Record<string, PORecord> = {
  "PO-001": {
    poNumber: "PO-2024-00139", status: "created",
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
    poNumber: "PO-2024-00140", status: "pending",
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
const FALLBACK: PORecord = { poNumber: "Unknown PO", status: "pending", orderDetails: {}, items: [], scheduleRows: [] };

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ViewPurchaseOrderPage() {
  const params = useParams();
  const id = params.id as string;
  const po = MOCK_POS[id] ?? FALLBACK;

  const [order]    = useState<OrderDetails>({ ...EMPTY_ORDER, ...po.orderDetails });
  const [items]    = useState<PurchaseItem[]>(po.items);
  const [schedule] = useState<ScheduleRow[]>(po.scheduleRows);
  const [activeTab, setActiveTab] = useState(0);

  const totalQty  = items.reduce((s, i) => s + i.qty, 0);
  const netAmount = items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxEst    = Math.round(netAmount * 0.18);

  const statusColor = po.status === "created" ? "success" : po.status === "pending" ? "warning" : "error";
  const statusLabel = po.status === "created" ? "Created" : po.status === "pending" ? "Pending" : "Closed";

  // ── Cell renderers (read-only spans) ─────────────────────────────────────────

  const renderItemCell = (row: PurchaseItem, col: Column<PurchaseItem>): ReactNode => {
    switch (col.key) {
      case "name":      return <span className="text-[11px] font-semibold text-slate-800">{row.name}</span>;
      case "qty":       return <span className="text-[11px] font-semibold tabular-nums">{row.qty}</span>;
      case "price":     return <span className="text-[11px] font-bold tabular-nums">₹{row.price.toLocaleString("en-US")}</span>;
      case "uom":       return <span className="text-[11px] text-gray-700">{row.uom}</span>;
      case "taxCode":   return <span className="text-[11px] text-gray-700">{row.taxCode}</span>;
      case "packaging": return <span className="text-[11px] text-gray-700">{row.packaging}</span>;
      default:          return null;
    }
  };

  const renderScheduleCell = (row: ScheduleRow, col: Column<ScheduleRow>): ReactNode => {
    switch (col.key) {
      case "phase":       return <span className="text-[11px] text-slate-800 font-medium">{row.phase}</span>;
      case "qty":         return <span className="text-[11px] font-semibold text-[#884D70] tabular-nums">{row.qty}</span>;
      case "reqDispatch": return <span className="text-[11px] text-gray-600 tabular-nums">{row.reqDispatch}</span>;
      case "reqDelivery": return <span className="text-[11px] text-gray-600 tabular-nums">{row.reqDelivery}</span>;
      case "actionLog":   return <span className="text-[11px] text-gray-600">{row.actionLog}</span>;
      default:            return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">

      <DashboardPageHeader
        title={po.poNumber}
        breadcrumbs={[
          { label: "Dashboard",       href: "/" },
          { label: "Purchase Orders", href: "/purchase-order" },
          { label: po.poNumber },
        ]}
        rightContent={
          <>
            <StatusBadge label={statusLabel} color={statusColor} />
            <div className="w-px h-4 bg-gray-200" />
            <Link href={`/purchase-order/${id}/edit`}>
              <button className="btn-primary-pill">
                Edit PO
              </button>
            </Link>
          </>
        }
      />

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        {/* ── Order Details ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Order Details</h2>
          </div>
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            {ORDER_FIELDS.map((f) =>
              f.type === "select" ? (
                <FormSelect key={f.key} label={f.label} value={order[f.key]} options={f.options} placeholder="—" onChange={() => {}} disabled />
              ) : (
                <FormInput  key={f.key} label={f.label} value={order[f.key]} placeholder={f.placeholder} onChange={() => {}} disabled />
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
            <p className="text-[12px] text-gray-600 px-3 py-2.5 bg-[#f8f9fc] border border-gray-100 rounded-lg min-h-[52px]">
              {order.notes || "No notes added."}
            </p>
          </div>
        </div>

        {/* ── Purchase Items ── */}
        <ExcelTable
          columns={ITEM_COLS}
          data={items}
          rowKey={(row) => String(row.id)}
          renderCell={renderItemCell}
          header={<h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Purchase Items</h2>}
          statusBar={
            <>
              <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
              <span className="text-gray-200">|</span>
              <span className="text-[10px] text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">₹{netAmount.toLocaleString("en-US")}</strong></span>
              <span className="text-gray-200">|</span>
              <span className="text-[10px] text-gray-400">Tax (18%): <strong className="text-slate-700 tabular-nums">₹{taxEst.toLocaleString("en-US")}</strong></span>
            </>
          }
          className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          cellClassName="px-3 py-2 whitespace-nowrap text-left"
          statusBarClassName="px-4 py-2 bg-[#f8f9fc] border-t border-gray-100 flex items-center gap-6 rounded-b-xl"
          emptyMessage="No items."
        />

        {/* ── Schedule / Tabs ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="flex items-center border-b border-gray-100 px-1">
            <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          {activeTab === 0 ? (
            <ExcelTable
              columns={SCHEDULE_COLS}
              data={schedule}
              rowKey={(row) => String(row.id)}
              renderCell={renderScheduleCell}
              className=""
              cellClassName="px-3 py-2 whitespace-nowrap text-left"
              emptyMessage="No schedule rows."
            />
          ) : (
            <div className="py-12 text-center text-[11px] text-gray-400">{TABS[activeTab].label} — coming soon</div>
          )}
        </div>

      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-10 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-5 text-[11px]">
          <span className="text-gray-400">Total Qty: <strong className="text-slate-700 tabular-nums">{totalQty}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">₹{netAmount.toLocaleString("en-US")}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Grand Total: <strong className="text-slate-900 tabular-nums">₹{(netAmount + taxEst).toLocaleString("en-US")}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/purchase-order/${id}/edit`}>
            <button className="text-[12px] font-medium text-gray-600 px-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              Edit PO
            </button>
          </Link>
          <Link href="/purchase-order">
            <button className="btn-primary-pill">
              Back to List
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
