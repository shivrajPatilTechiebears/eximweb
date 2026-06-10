"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";

// ── Nav ────────────────────────────────────────────────────────────────────────

type SubItem = { label: string; href: string; icon: string; badge?: string };
type NavItemDef = { label: string; href: string; active: boolean; muted: boolean; sub?: SubItem[] };

const NAV_ITEMS: NavItemDef[] = [
  { label: "Dashboard", href: "/", active: false, muted: false },
  { label: "Image Library", href: "/", active: false, muted: false },
  {
    label: "Purchase Request", href: "/purchase-request", active: false, muted: false,
    sub: [
      { label: "All Requests", href: "/purchase-request", icon: "format_list_bulleted" },
      { label: "Open Requests", href: "/purchase-request/open", icon: "pending_actions" },
      { label: "PR Details", href: "/purchase-request/details", icon: "description" },
    ],
  },
  {
    label: "Purchase Order", href: "/purchase-order", active: true, muted: false,
    sub: [
      { label: "All Purchase order", href: "/purchase-order", icon: "format_list_bulleted" },
      { label: "Open Purchase order", href: "/purchase-order/open", icon: "pending_actions" },
      { label: "Purchase order details", href: "/purchase-order/details", icon: "receipt_long" },
    ],
  },
  {
    label: "Shipments", href: "/shipments", active: false, muted: false,
    sub: [
      { label: "All Shipments", href: "/shipments", icon: "format_list_bulleted" },
      { label: "Confirmed Shipments", href: "/shipments/confirmed", icon: "task_alt" },
      { label: "Intransit Shipment", href: "/shipments/intransit", icon: "directions_boat" },
    ],
  },
  {
    label: "Bookings", href: "/bookings", active: false, muted: false,
    sub: [
      { label: "All Bookings", href: "/bookings", icon: "format_list_bulleted" },
      { label: "Booking Confirmed", href: "/bookings/confirmed", icon: "event_available" },
      { label: "Intransit Bookings", href: "/bookings/intransit", icon: "flight_takeoff" },
    ],
  },
];

function NavItem({ item }: { item: NavItemDef }) {
  return (
    <div className="relative group">
      <Link
        href={item.href}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
          item.active ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
        }`}
      >
        {item.label}
        {item.sub && (
          <svg className="w-2 h-2 opacity-30 transition-transform duration-150 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        )}
      </Link>
      {item.sub && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-[60] opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-1.5 min-w-[168px]">
            {item.sub.map((s) => (
              <Link key={s.label} href={s.href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                <Icon name={s.icon} size={13} className="shrink-0 text-gray-400" strokeWidth={1.5} />
                <span className="flex-1">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Types & data ───────────────────────────────────────────────────────────────

interface PurchaseItem {
  id: number; name: string; qty: number; price: number;
  uom: string; taxCode: string; packaging: string;
}

interface ScheduleRow {
  id: number; phase: string; qty: number;
  reqDispatch: string; reqDelivery: string; actionLog: string;
}

const FORM_FIELDS = [
  { key: "poType",            label: "PO Type",            type: "select",  options: ["Paddler", "Direct", "Consignment"],                 placeholder: "" },
  { key: "truckNo",           label: "Truck No",           type: "input",   options: [],                                                   placeholder: "MH-12-AQ-9082" },
  { key: "driver",            label: "Driver Details",     type: "input",   options: [],                                                   placeholder: "Ramesh Kumar (+91 98...)" },
  { key: "delivery",          label: "Delivery Location",  type: "input",   options: [],                                                   placeholder: "Mumbai Port Terminal 2" },
  { key: "currency",          label: "Currency",           type: "select",  options: ["INR (₹)", "USD ($)", "EUR (€)"],                    placeholder: "" },
  { key: "shipTerm",          label: "Shipment Terms",     type: "select",  options: ["EXW - Ex Works", "FOB - Free on Board"],            placeholder: "" },
  { key: "payTerm",           label: "Payment Terms",      type: "select",  options: ["Net 30 Days", "15% Advance"],                       placeholder: "" },
  { key: "transporter",       label: "Transporter",        type: "select",  options: ["SafeLogistics Pvt Ltd", "Global Freight"],          placeholder: "" },
];

const TABS = ["Schedule", "Shipment Logs", "Test Samples", "Remarks"];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function CreatePurchaseOrderPage() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const [activeTab, setActiveTab] = useState("Schedule");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [items, setItems] = useState<PurchaseItem[]>([
    { id: 1, name: "Steel Wire Mesh G12", qty: 150, price: 12500, uom: "Roll",  taxCode: "GST_18", packaging: "Boxed" },
    { id: 2, name: "Hydraulic Seal Kit",  qty: 45,  price: 3400,  uom: "Sets",  taxCode: "GST_12", packaging: "Plastic" },
  ]);

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([
    { id: 1, phase: "Initial Inventory Batch",    qty: 100, reqDispatch: "24-Oct-2023", reqDelivery: "26-Oct-2023", actionLog: "Waiting for supplier confirm" },
    { id: 2, phase: "Residual Balance Shipment",  qty: 50,  reqDispatch: "02-Nov-2023", reqDelivery: "05-Nov-2023", actionLog: "Scheduled for Q4" },
  ]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 20 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const addItem = useCallback(() => {
    setItems((p) => [...p, { id: p.length + 1, name: "", qty: 0, price: 0, uom: "", taxCode: "", packaging: "" }]);
  }, []);

  const deleteItem = useCallback((id: number) => setItems((p) => p.filter((r) => r.id !== id)), []);

  const addSchedule = useCallback(() => {
    setScheduleRows((p) => [...p, { id: p.length + 1, phase: "", qty: 0, reqDispatch: "", reqDelivery: "", actionLog: "" }]);
  }, []);

  const deleteSchedule = useCallback((id: number) => setScheduleRows((p) => p.filter((r) => r.id !== id)), []);

  const totalQty   = items.reduce((s, i) => s + i.qty, 0);
  const netAmount  = items.reduce((s, i) => s + i.qty * i.price, 0);
  const taxEst     = Math.round(netAmount * 0.18);

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      {/* ═══ FLOATING PILL NAVBAR ═══ */}
      <div className={`fixed top-3 inset-x-0 z-50 flex justify-center transition-all duration-300 ease-out ${visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"}`}>
        <div className="flex items-center bg-[#2e0f3a] border border-white/[0.07] rounded-full shadow-[0_4px_28px_rgba(80,10,90,0.5)] px-1.5 py-1.5 gap-0.5">
          <div className="flex items-center gap-1.5 px-2.5 pr-3 shrink-0">
            <div className="w-4 h-4 bg-[#8470ff] rounded flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-sm" /></div>
            <span className="text-white font-bold text-[11px] tracking-tight">EXIM</span>
          </div>
          <div className="w-px h-3.5 bg-white/[0.08] shrink-0" />
          <div className="flex items-center gap-0.5 px-1.5">{NAV_ITEMS.map((item) => <NavItem key={item.label} item={item} />)}</div>
          <div className="w-px h-3.5 bg-white/[0.08] shrink-0" />
          <button className="p-1.5 mx-0.5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] rounded-full transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-white/[0.05] rounded-full transition-colors shrink-0">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">S</div>
            <span className="text-[11px] text-gray-400">Shivam</span>
            <svg className="w-2.5 h-2.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
          </button>
        </div>
      </div>

      {/* ═══ PAGE HEADER ═══ */}
      <div className="pt-16 bg-white border-b border-gray-200/70 px-10 py-3 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
            <Link href="/" className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            <Link href="/purchase-order" className="hover:text-slate-600 transition-colors">Purchase Orders</Link>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            <span className="text-slate-600 font-medium">Create</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Create Purchase Order</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Draft PO-9284
          </span>
          <div className="w-px h-4 bg-gray-200" />
          <button className="text-[12px] font-medium text-gray-500 px-3.5 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
            Submit PO
          </button>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 px-6 py-4 pb-20 bg-[#eaecf1] space-y-3">

        {/* ── Order Details ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Order Details</h2>
            <span className="text-[10px] text-gray-400">Tab · Enter to move between fields</span>
          </div>
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            {FORM_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                {f.type === "select" ? (
                  <select className="w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 text-slate-700 appearance-none cursor-pointer transition-all">
                    <option value="">Select…</option>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 placeholder:text-gray-300 text-slate-700 transition-all"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Purchase Items ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Purchase Items</h2>
            <button onClick={addItem} className="flex items-center gap-1 text-[11px] font-medium text-[#8470ff] hover:bg-[#8470ff]/8 px-2.5 py-1 rounded-lg transition-colors">
              <Icon name="add" size={13} />
              Add Row
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-8 bg-[#e8eaed] border-b border-r border-gray-300 select-none" />
                  {["Item Name", "Qty", "Price (₹)", "UOM", "Tax Code", "Packaging", "Img", ""].map((h) => (
                    <th key={h} className="bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((row, i) => (
                  <tr key={row.id} className={`group ${i % 2 === 0 ? "bg-white" : "bg-[#f2f4f8]"} hover:bg-[#eef3fe] transition-colors`}>
                    <td className="w-8 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] group-hover:bg-[#e4e9f7] transition-colors select-none py-1.5">{i + 1}</td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.name} placeholder="Item name…" className="w-full min-w-[160px] px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.qty || ""} placeholder="0" type="number" className="w-16 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center tabular-nums placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.price || ""} placeholder="0.00" type="number" className="w-24 px-2 py-1.5 text-[11px] font-semibold text-slate-900 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-right tabular-nums placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.uom} placeholder="Kg" className="w-14 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.taxCode} placeholder="GST_18" className="w-20 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.packaging} placeholder="Box / Roll…" className="w-28 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 text-center">
                      <button onClick={() => { setSelectedItemId(row.id); setIsGalleryOpen(true); }} className="text-gray-300 hover:text-[#8470ff] transition-colors" title="Attach image">
                        <Icon name="attachment" size={13} />
                      </button>
                    </td>
                    <td className="border-b border-gray-200 px-3 py-1.5 text-center">
                      <button onClick={() => deleteItem(row.id)} className="text-gray-300 hover:text-red-400 transition-colors" title="Remove">
                        <Icon name="delete" size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Items footer totals */}
          <div className="px-4 py-2 bg-[#f8f9fc] border-t border-gray-100 flex items-center gap-6 rounded-b-xl">
            <span className="text-[10px] text-gray-400">Rows: <strong className="text-gray-600">{items.length}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">₹{netAmount.toLocaleString("en-US")}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Tax (18%): <strong className="text-slate-700 tabular-nums">₹{taxEst.toLocaleString("en-US")}</strong></span>
          </div>
        </div>

        {/* ── Schedule / Tabs ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          {/* Tab bar */}
          <div className="flex items-center border-b border-gray-100 px-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-[11px] font-medium border-b-2 -mb-px transition-all ${
                  activeTab === tab ? "border-[#8470ff] text-[#8470ff]" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
            {activeTab === "Schedule" && (
              <>
                <div className="flex-1" />
                <button onClick={addSchedule} className="flex items-center gap-1 text-[11px] font-medium text-[#8470ff] hover:bg-[#8470ff]/8 px-2.5 py-1 mr-1.5 rounded-lg transition-colors">
                  <Icon name="add" size={13} />
                  Add Row
                </button>
              </>
            )}
          </div>

          {/* Tab content */}
          {activeTab === "Schedule" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-8 bg-[#e8eaed] border-b border-r border-gray-300 select-none" />
                    {["Delivery Phase", "Qty", "Req. Dispatch", "Req. Delivery", "Action Log", ""].map((h) => (
                      <th key={h} className="bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row, i) => (
                    <tr key={row.id} className={`group ${i % 2 === 0 ? "bg-white" : "bg-[#f2f4f8]"} hover:bg-[#eef3fe] transition-colors`}>
                      <td className="w-8 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] group-hover:bg-[#e4e9f7] transition-colors select-none py-1.5">{i + 1}</td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.phase} placeholder="Phase name…" className="w-full min-w-[160px] px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.qty || ""} placeholder="0" type="number" className="w-16 px-2 py-1.5 text-[11px] font-semibold text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center tabular-nums placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.reqDispatch} placeholder="dd-Mon-yyyy" className="w-28 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.reqDelivery} placeholder="dd-Mon-yyyy" className="w-28 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.actionLog} placeholder="Notes…" className="w-full min-w-[160px] px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-gray-200 px-3 py-1.5 text-center">
                        <button onClick={() => deleteSchedule(row.id)} className="text-gray-300 hover:text-red-400 transition-colors" title="Remove">
                          <Icon name="delete" size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-[11px] text-gray-400">{activeTab} — coming soon</div>
          )}
        </div>

      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-10 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-5 text-[11px]">
          <span className="text-gray-400">Total Qty: <strong className="text-slate-700 tabular-nums">{totalQty.toLocaleString("en-US")}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">₹{netAmount.toLocaleString("en-US")}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Tax Est.: <strong className="text-slate-700 tabular-nums">₹{taxEst.toLocaleString("en-US")}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Grand Total: <strong className="text-slate-900 tabular-nums">₹{(netAmount + taxEst).toLocaleString("en-US")}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/purchase-order">
            <button className="text-[12px] font-medium text-gray-500 px-4 py-1.5 hover:bg-gray-100 rounded-full transition-colors">Cancel</button>
          </Link>
          <button className="text-[12px] font-medium text-gray-600 px-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">Save as Draft</button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
            Submit PO
          </button>
        </div>
      </div>

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={(image) => { console.log("Selected image for item", selectedItemId, ":", image); }}
      />

    </div>
  );
}
