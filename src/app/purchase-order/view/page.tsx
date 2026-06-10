"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

// ── Nav ────────────────────────────────────────────────────────────────────────

type SubItem = { label: string; href: string; icon: string };
type NavItemDef = { label: string; href: string; active: boolean; muted: boolean; sub?: SubItem[] };

const NAV_ITEMS: NavItemDef[] = [
  { label: "Dashboard", href: "/", active: false, muted: false },
  { label: "Image Library", href: "/", active: false, muted: false },
  {
    label: "Purchase Request", href: "/purchase-request", active: false, muted: false,
    sub: [
      { label: "All Requests",   href: "/purchase-request",         icon: "format_list_bulleted" },
      { label: "Open Requests",  href: "/purchase-request/open",    icon: "pending_actions" },
      { label: "PR Details",     href: "/purchase-request/details", icon: "description" },
    ],
  },
  {
    label: "Purchase Order", href: "/purchase-order", active: true, muted: false,
    sub: [
      { label: "All Purchase order",      href: "/purchase-order",         icon: "format_list_bulleted" },
      { label: "Open Purchase order",     href: "/purchase-order/open",    icon: "pending_actions" },
      { label: "Purchase order details",  href: "/purchase-order/details", icon: "receipt_long" },
    ],
  },
  {
    label: "Shipments", href: "/shipments", active: false, muted: false,
    sub: [
      { label: "All Shipments",       href: "/shipments",           icon: "format_list_bulleted" },
      { label: "Confirmed Shipments", href: "/shipments/confirmed", icon: "task_alt" },
      { label: "Intransit Shipment",  href: "/shipments/intransit", icon: "directions_boat" },
    ],
  },
  {
    label: "Bookings", href: "/bookings", active: false, muted: false,
    sub: [
      { label: "All Bookings",       href: "/bookings",           icon: "format_list_bulleted" },
      { label: "Booking Confirmed",  href: "/bookings/confirmed", icon: "event_available" },
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

// ── Data ───────────────────────────────────────────────────────────────────────

const PO_ID     = "PO-2024-00139";
const PO_STATUS = "Draft";

const FORM_DATA = [
  { label: "PO Type",           value: "Paddler" },
  { label: "Truck No",          value: "MH-05-1234" },
  { label: "Driver Details",    value: "Shivraj Patil" },
  { label: "Delivery Location", value: "Pune, Maharashtra" },
  { label: "Currency",          value: "USD ($)" },
  { label: "Shipment Terms",    value: "EXW - Ex Works" },
  { label: "Payment Terms",     value: "After Delivered" },
  { label: "Transporter",       value: "DHL" },
];

interface PurchaseItem {
  id: number; name: string; qty: number; price: string;
  uom: string; taxCode: string; packaging: string; containers: number;
  imgSrc: string; imgLabel: string;
}

interface ScheduleRow {
  id: number; itemName: string; schedule: string;
  qty: number; reqDispatch: string; reqDelivery: string;
}

const PURCHASE_ITEMS: PurchaseItem[] = [
  { id: 1, name: "Steel-01", qty: 100, price: "$100", uom: "Kg", taxCode: "GST", packaging: "Box Packaging", containers: 2, imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl7wTC-rA26wrENnGGuuk9VWDDWe0SvPuZLSfqjHql-merHAkIgCl5ukEtNU7oByRD88G6uecgMMu2BhbjKErWVz74p_R5de7W3wCck8rKoDHKzWSfPSq7CiIT5MhxTjnk4oGwyB5SEkNpWjabCYUvNxsBZJwLkErWxy64jW56Fd4o4Rs1JAFH5Ox18sRywAxMExkYQ6BzOasXbNtAK56_d9WF14quM3bGPuLk7Eg7ECNzj5AcByLN-EVm4DCll-EiRDRMKXo_q3y_", imgLabel: "Img-001" },
  { id: 2, name: "Steel-01", qty: 100, price: "$100", uom: "Kg", taxCode: "GST", packaging: "Box Packaging", containers: 2, imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBADgOxp7tKUKb9NgROGVNM7vxq-T_ruvaqNddRh6XbdoMNLTdCaVNQrvguZAcTHkIG3LdUoZEewyRjiLqQBcXVq4i0rtLpiKltl9IsK5I5NRsZyZe1-PVun9F4O92j7MUpVfcklANPOdQCotWOBYDScA36NDx_tKaXqX6FBhymw4WHlMOd3vfO8bY09rkt8N630R-LxteiDOdYYSe_3d3Hb6C07-RvhWnAKbq8YOxKuwQD2d7eBAZy4R1HSbWxkik6KsFrOtyJLqFT", imgLabel: "Img-001" },
];

const SCHEDULE_ROWS: ScheduleRow[] = [
  { id: 1, itemName: "Steel-01", schedule: "Schedule-1", qty: 100, reqDispatch: "11/02/2026", reqDelivery: "13/02/2026" },
  { id: 2, itemName: "Steel-01", schedule: "Schedule-1", qty: 100, reqDispatch: "11/02/2026", reqDelivery: "13/02/2026" },
];

const TABS = ["Schedule", "Shipment", "Test Sample", "Goods Receipt"];

const totalQty   = PURCHASE_ITEMS.reduce((s, i) => s + i.qty, 0);
const netAmount  = PURCHASE_ITEMS.reduce((s, i) => s + i.qty * parseFloat(i.price.replace(/[$,]/g, "")), 0);
const taxEst     = Math.round(netAmount * 0.08);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ViewPurchaseOrderPage() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const [activeTab, setActiveTab] = useState("Schedule");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 20 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <span className="text-slate-600 font-medium">{PO_ID}</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Purchase Order Details</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full font-mono">{PO_ID}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {PO_STATUS}
          </span>
          <div className="w-px h-4 bg-gray-200" />
          <Link href="/purchase-order/edit">
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 px-3.5 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <Icon name="edit" size={12} />
              Edit
            </button>
          </Link>
          <Link href="/purchase-order">
            <button className="text-[12px] font-medium text-gray-500 px-3.5 py-1.5 hover:bg-gray-100 rounded-full transition-colors">
              Close
            </button>
          </Link>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 px-6 py-4 pb-20 bg-[#eaecf1] space-y-3">

        {/* ── Order Details (read-only) ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Order Details</h2>
          </div>
          <div className="px-5 py-4 grid grid-cols-4 gap-x-4 gap-y-3">
            {FORM_DATA.map((f) => (
              <div key={f.label}>
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{f.label}</p>
                <p className="text-[12px] font-medium text-slate-800 px-3 py-2 bg-[#f8f9fc] border border-gray-100 rounded-lg">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Purchase Items (read-only) ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Purchase Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-8 bg-[#e8eaed] border-b border-r border-gray-300 select-none" />
                  {["Item Name", "Qty", "Price", "UOM", "Tax Code", "Packaging", "Containers", "Image"].map((h) => (
                    <th key={h} className="bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PURCHASE_ITEMS.map((row, i) => (
                  <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f2f4f8]"}>
                    <td className="w-8 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] select-none py-2">{i + 1}</td>
                    <td className="border-b border-r border-gray-200 px-3 py-2">
                      <span className="text-[11px] font-semibold text-slate-800">{row.name}</span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-2 text-center">
                      <span className="text-[11px] font-semibold text-slate-800 tabular-nums">{row.qty}</span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-2 text-right">
                      <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.price}</span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-2 text-center">
                      <span className="text-[11px] text-gray-700">{row.uom}</span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-2 text-center">
                      <span className="text-[11px] text-gray-700">{row.taxCode}</span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-2">
                      <span className="text-[11px] text-gray-700">{row.packaging}</span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-2 text-center">
                      <span className="text-[11px] text-gray-700 tabular-nums">{row.containers}</span>
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <img src={row.imgSrc} alt={row.imgLabel} className="w-7 h-7 rounded-lg object-cover border border-gray-100 shrink-0" />
                        <span className="text-[10px] font-medium text-gray-500">{row.imgLabel}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 bg-[#f8f9fc] border-t border-gray-100 flex items-center gap-6 rounded-b-xl">
            <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">${netAmount.toLocaleString()}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Tax Est.: <strong className="text-slate-700 tabular-nums">${taxEst.toLocaleString()}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Grand Total: <strong className="text-slate-900 tabular-nums">${(netAmount + taxEst).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
          <div className="px-5 py-2.5 border-b border-gray-100">
            <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Notes</h2>
          </div>
          <div className="px-5 py-3">
            <p className="text-[12px] text-gray-600 px-3 py-2.5 bg-[#f8f9fc] border border-gray-100 rounded-lg min-h-[52px]">
              Enter material grade and special handling instructions…
            </p>
          </div>
        </div>

        {/* ── Schedule / Tabs ── */}
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
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
          </div>

          {activeTab === "Schedule" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-8 bg-[#e8eaed] border-b border-r border-gray-300 select-none" />
                    {["Item Name", "Schedule", "Qty", "Req. Dispatch", "Req. Delivery"].map((h) => (
                      <th key={h} className="bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE_ROWS.map((row, i) => (
                    <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f2f4f8]"}>
                      <td className="w-8 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] select-none py-2">{i + 1}</td>
                      <td className="border-b border-r border-gray-200 px-3 py-2"><span className="text-[11px] text-slate-800 font-medium">{row.itemName}</span></td>
                      <td className="border-b border-r border-gray-200 px-3 py-2"><span className="text-[11px] font-semibold text-[#8470ff]">{row.schedule}</span></td>
                      <td className="border-b border-r border-gray-200 px-3 py-2 text-center"><span className="text-[11px] font-semibold text-slate-800 tabular-nums">{row.qty}</span></td>
                      <td className="border-b border-r border-gray-200 px-3 py-2 text-center"><span className="text-[11px] text-gray-600 tabular-nums">{row.reqDispatch}</span></td>
                      <td className="border-b border-gray-200 px-3 py-2 text-center"><span className="text-[11px] text-gray-600 tabular-nums">{row.reqDelivery}</span></td>
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
          <span className="text-gray-400">Total Qty: <strong className="text-slate-700 tabular-nums">{totalQty}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">${netAmount.toLocaleString()}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Tax Est.: <strong className="text-slate-700 tabular-nums">${taxEst.toLocaleString()}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Grand Total: <strong className="text-slate-900 tabular-nums">${(netAmount + taxEst).toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/purchase-order/edit">
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 px-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              <Icon name="edit" size={12} />
              Edit PO
            </button>
          </Link>
          <Link href="/purchase-order">
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md">
              <Icon name="arrow_back" size={12} />
              Back to List
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
