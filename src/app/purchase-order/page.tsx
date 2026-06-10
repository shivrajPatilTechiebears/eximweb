"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";

// ── Data ───────────────────────────────────────────────────────────────────────

type POStatus = "created" | "pending";

interface PurchaseOrder {
  id: string; poNumber: string; poType: string; deliveryLocation: string;
  itemName: string; itemQty: number; price: string; currency: string;
  shipTerm: string; payTerm: string; transporter: string; truckNo: string;
  driver: string; status: POStatus;
}

const STATUS_STYLE: Record<POStatus, string> = {
  created: "text-emerald-600 bg-emerald-50",
  pending: "text-amber-600 bg-amber-50",
};

const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: "PO-001", poNumber: "PO-2024-00139", poType: "Paddler", deliveryLocation: "Mumbai Port Terminal 2", itemName: "Steel Wire Mesh G12", itemQty: 150, price: "$12,500", currency: "USD", shipTerm: "EXW - Ex Works", payTerm: "Net 30 Days", transporter: "SafeLogistics Pvt Ltd", truckNo: "MH05-1234", driver: "Shivraj P.", status: "created" },
  { id: "PO-002", poNumber: "PO-2024-00140", poType: "Direct", deliveryLocation: "Delhi Warehouse A", itemName: "Hydraulic Seal Kit", itemQty: 45, price: "$3,400", currency: "USD", shipTerm: "FOB - Free on Board", payTerm: "15% Advance", transporter: "Global Freight", truckNo: "KA01-9988", driver: "Amit S.", status: "pending" },
];

const STAT_TILES = [
  { label: "Total POs", value: "6", badge: "+12%", badgeCls: "text-emerald-600 bg-emerald-50", barColor: "bg-[#8470ff]", barW: "75%", sub: "All time", accent: "#8470ff" },
  { label: "Pending", value: "1", badge: "17%", badgeCls: "text-amber-600 bg-amber-50", barColor: "bg-amber-400", barW: "17%", sub: "Awaiting approval", accent: "#fbbf24" },
  { label: "Created", value: "3", badge: "+50%", badgeCls: "text-emerald-600 bg-emerald-50", barColor: "bg-emerald-400", barW: "50%", sub: "Processed orders", accent: "#34d399" },
  { label: "Approved", value: "1", badge: "17%", badgeCls: "text-sky-600 bg-sky-50", barColor: "bg-sky-400", barW: "17%", sub: "Ready to dispatch", accent: "#38bdf8" },
];

const TABS: { label: string; statuses: POStatus[] | null }[] = [
  { label: "All", statuses: null },
  { label: "Open", statuses: ["pending"] },
  { label: "Created", statuses: ["created"] },
];

const ALL_COLS = [
  { key: "poNumber", header: "PO Number", sortable: true, align: "left" },
  { key: "poType", header: "Type", sortable: true, align: "left" },
  { key: "itemName", header: "Item", sortable: true, align: "left" },
  { key: "itemQty", header: "Qty", sortable: true, align: "right" },
  { key: "price", header: "Price", sortable: true, align: "right" },
  { key: "currency", header: "Currency", sortable: false, align: "center" },
  { key: "deliveryLocation", header: "Delivery", sortable: true, align: "left" },
  { key: "shipTerm", header: "Ship Terms", sortable: false, align: "left" },
  { key: "payTerm", header: "Pay Terms", sortable: false, align: "left" },
  { key: "transporter", header: "Transporter", sortable: true, align: "left" },
  { key: "truckNo", header: "Truck No", sortable: false, align: "left" },
  { key: "driver", header: "Driver", sortable: true, align: "left" },
  { key: "status", header: "Status", sortable: true, align: "center" },
  { key: "actions", header: "Actions", sortable: false, align: "right" },
];

const DEFAULT_VISIBLE = new Set(["poNumber", "itemName", "itemQty", "price", "deliveryLocation", "status", "actions"]);

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PurchaseOrderListPage() {
  const [orders, setOrders] = useState([...PURCHASE_ORDERS]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [moreMenuId, setMoreMenuId] = useState<string | null>(null);
  const [moreMenuPos, setMoreMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE);
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const colMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) { setMoreMenuId(null); setMoreMenuPos(null); }
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) setColMenuOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const tabStatuses = TABS[activeTab].statuses;

  const filteredOrders = [...orders]
    .filter((o) => {
      if (tabStatuses && !tabStatuses.includes(o.status)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return o.poNumber.toLowerCase().includes(q) || o.itemName.toLowerCase().includes(q) || o.deliveryLocation.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? "");
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? "");
      return sortDir === "asc" ? av.localeCompare(bv, undefined, { numeric: true }) : bv.localeCompare(av, undefined, { numeric: true });
    });

  const totalValue = orders.reduce((s, o) => s + parseFloat(o.price.replace(/[$,]/g, "")), 0);
  const shownCols = ALL_COLS.filter((c) => visibleCols.has(c.key));

  const toggleCol = (key: string) =>
    setVisibleCols((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); n.add("actions"); return n; });

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />

      {/* ═══ WHITE PAGE HEADER ═══ */}
      <div className="pt-16 bg-white border-b border-gray-200/70 px-10 py-3 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
            <Link href="/" className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            <span className="text-slate-600 font-medium">Purchase Orders</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Purchase Orders</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] text-gray-500 font-medium">{orders.length} total · 1 pending</span>
          <div className="w-px h-4 bg-gray-200" />
          <Link href="/purchase-order/create">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
              Create PO
            </button>
          </Link>
        </div>
      </div>

      {/* ═══ STAT TILES ═══ */}
      <div className="px-6 pt-4 pb-0 bg-[#eaecf1] grid grid-cols-4 gap-3">
        {STAT_TILES.map((t) => (
          <div key={t.label} className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.07)] p-3 relative overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.09)] hover:-translate-y-px transition-all cursor-default">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ backgroundColor: t.accent }} />
            <div className="flex items-center justify-between mt-0.5 mb-2">
              <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">{t.label}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${t.badgeCls}`}>{t.badge}</span>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{t.value}</p>
              <p className="text-[9px] text-gray-400 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 truncate">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ TABLE SECTION ═══ */}
      <main className="flex-1 px-6 pt-3 pb-4 bg-[#eaecf1]">

        {/* ── Tabs + Controls (no bg — sits on page gray) ── */}
        <div className="flex items-center px-1 pb-2 gap-2">
          {/* Tabs */}
          <div className="flex items-center shrink-0">
            {TABS.map((tab, i) => {
              const count = tab.statuses
                ? orders.filter((o) => tab.statuses!.includes(o.status)).length
                : orders.length;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium border-b-2 transition-all ${activeTab === i
                    ? "border-[#8470ff] text-[#8470ff]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab.label}
                  <span className={`text-[9px] px-1 py-px rounded font-semibold ${activeTab === i ? "text-[#8470ff]" : "text-gray-400"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders…"
              className="pl-7 pr-3 py-2 text-[11px] bg-white/70 border border-gray-200 rounded-xl outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200 w-44 placeholder:text-gray-400 text-slate-700 transition-all"
            />
          </div>

          <div className="w-px h-4 bg-gray-300/60 shrink-0" />

          {/* Column toggle */}
          <div className="relative" ref={colMenuRef}>
            <button
              onClick={() => setColMenuOpen((v) => !v)}
              className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-xl border transition-all ${colMenuOpen ? "bg-white border-gray-300 text-slate-700 shadow-sm" : "bg-white/70 border-gray-200 text-gray-500 hover:text-slate-700 hover:bg-white hover:border-gray-300"}`}
            >
              <Icon name="filter_list" size={13} />
              Columns
            </button>
              {colMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-2 z-50 w-44">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">Columns</p>
                  {ALL_COLS.filter((c) => c.key !== "actions").map((c) => (
                    <button key={c.key} onClick={() => toggleCol(c.key)} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-xl text-[11px] hover:bg-gray-50 transition-colors">
                      <div className={`w-3.5 h-3.5 rounded-sm border-2 transition-all flex items-center justify-center shrink-0 ${visibleCols.has(c.key) ? "bg-[#8470ff] border-[#8470ff]" : "border-gray-300"}`}>
                        {visibleCols.has(c.key) && <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>}
                      </div>
                      <span className={visibleCols.has(c.key) ? "text-slate-700" : "text-gray-400"}>{c.header}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-white px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#8470ff] to-[#6366f1] hover:from-[#9480ff] hover:to-[#7375f5] shadow-[0_2px_10px_rgba(132,112,255,0.35)] hover:shadow-[0_4px_16px_rgba(132,112,255,0.5)] transition-all">
              <Icon name="download" size={13} />
              Export
            </button>
          </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-xl border border-gray-300/50 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">

          {/* ── Excel-style Table ── */}
          <div className="overflow-x-auto overflow-y-hidden rounded-b-none">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {/* Row-number corner cell */}
                  <th className="w-9 bg-[#e8eaed] border-b border-r border-gray-300 select-none" />
                  {shownCols.map((c) => (
                    <th
                      key={c.key}
                      onClick={() => c.sortable && handleSort(c.key)}
                      className={`bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none ${c.sortable ? "cursor-pointer hover:bg-[#d8dce5] transition-colors" : ""}`}
                    >
                      <div className="flex items-center gap-1 justify-start">
                        <span>{c.header}</span>
                        {c.sortable && (
                          <span className={`text-[10px] leading-none transition-opacity ${sortKey === c.key ? "opacity-100" : "opacity-20"}`}>
                            {sortKey === c.key && sortDir === "asc" ? "↑" : sortKey === c.key ? "↓" : "⇅"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((row, i) => (
                  <Fragment key={row.id}>
                    <tr className={`group transition-colors ${deleteId === row.id
                      ? "bg-red-50"
                      : i % 2 === 0
                        ? "bg-white hover:bg-[#eef3fe]"
                        : "bg-[#f2f4f8] hover:bg-[#eef3fe]"
                      }`}>
                      {/* Row number */}
                      <td className="w-9 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] group-hover:bg-[#e4e9f7] transition-colors select-none py-2">
                        {i + 1}
                      </td>

                      {shownCols.map((c) => (
                        <td key={c.key} className="border-b border-r border-gray-200 px-3 py-2 whitespace-nowrap text-left">
                          {c.key === "poNumber" && (
                            <Link href="/purchase-order/details" className="text-[11px] font-semibold text-[#8470ff] hover:underline underline-offset-2">
                              {row.poNumber}
                            </Link>
                          )}
                          {c.key === "poType" && <span className="text-[11px] text-gray-700">{row.poType}</span>}
                          {c.key === "itemName" && <span className="text-[11px] text-slate-800 font-medium">{row.itemName}</span>}
                          {c.key === "itemQty" && <span className="text-[11px] font-semibold text-slate-800 tabular-nums">{row.itemQty}</span>}
                          {c.key === "price" && <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.price}</span>}
                          {c.key === "currency" && <span className="text-[11px] text-gray-600 font-medium tracking-wide">{row.currency}</span>}
                          {c.key === "deliveryLocation" && <span className="text-[11px] text-gray-700 max-w-[160px] truncate block">{row.deliveryLocation}</span>}
                          {c.key === "shipTerm" && <span className="text-[11px] text-gray-700">{row.shipTerm}</span>}
                          {c.key === "payTerm" && <span className="text-[11px] text-gray-700">{row.payTerm}</span>}
                          {c.key === "transporter" && <span className="text-[11px] text-gray-700">{row.transporter}</span>}
                          {c.key === "truckNo" && <span className="text-[11px] text-gray-700 tabular-nums font-mono">{row.truckNo}</span>}
                          {c.key === "driver" && <span className="text-[11px] text-gray-700">{row.driver}</span>}
                          {c.key === "status" && (
                            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[row.status]}`}>
                              {row.status}
                            </span>
                          )}
                          {c.key === "actions" && (
                            <div className="flex items-center gap-0.5">
                              <Link href="/purchase-order/view">
                                <button className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors" title="View"><Icon name="visibility" size={13} /></button>
                              </Link>
                              <Link href="/purchase-order/edit">
                                <button className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors" title="Edit"><Icon name="edit" size={13} /></button>
                              </Link>
                              <button onClick={() => setDeleteId(deleteId === row.id ? null : row.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Icon name="delete" size={13} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (moreMenuId === row.id) { setMoreMenuId(null); setMoreMenuPos(null); }
                                  else {
                                    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                                    setMoreMenuPos({ top: rect.bottom + 4, left: rect.right - 160 });
                                    setMoreMenuId(row.id);
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
                                title="More"
                              >
                                <Icon name="more_vert" size={13} />
                              </button>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {deleteId === row.id && (
                      <tr className="bg-red-50">
                        <td colSpan={shownCols.length + 1} className="px-4 py-2.5 border-b border-red-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-red-700 font-medium">Delete <strong>{row.poNumber}</strong>? This cannot be undone.</span>
                            <div className="flex gap-2">
                              <button onClick={() => { setOrders((p) => p.filter((o) => o.id !== row.id)); setDeleteId(null); }} className="px-3 py-1 bg-red-500 text-white text-[10px] font-semibold rounded-lg hover:bg-red-600 transition-colors">Confirm</button>
                              <button onClick={() => setDeleteId(null)} className="px-3 py-1 bg-white text-gray-700 text-[10px] font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={shownCols.length + 1} className="px-4 py-12 text-center">
                      <p className="text-[11px] text-gray-400">No purchase orders found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Excel status bar ── */}
          <div className="px-4 py-1.5 bg-[#e8eaed] border-t border-gray-300/50 flex items-center justify-between rounded-b-xl">
            <div className="flex items-center gap-4 text-[10px] text-gray-500">
              <span>Count: <strong className="text-gray-700 font-semibold">{filteredOrders.length}</strong></span>
              <span className="text-gray-300">|</span>
              <span>Total Value: <strong className="text-gray-700 font-semibold">${totalValue.toLocaleString()}</strong></span>
              <span className="text-gray-300">|</span>
              <span>Created: <strong className="text-emerald-600 font-semibold">{orders.filter((o) => o.status === "created").length}</strong></span>
              <span className="text-gray-300">·</span>
              <span>Pending: <strong className="text-amber-600 font-semibold">{orders.filter((o) => o.status === "pending").length}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 text-[10px] text-gray-500 hover:bg-gray-200 rounded transition-colors disabled:opacity-40" disabled>← Prev</button>
              <button className="px-2.5 py-1 text-[10px] bg-[#8470ff] text-white rounded font-semibold">1</button>
              <button className="px-2.5 py-1 text-[10px] text-gray-500 hover:bg-gray-200 rounded transition-colors disabled:opacity-40" disabled>Next →</button>
            </div>
          </div>

        </div>
      </main>

      {/* ═══ MORE MENU (fixed portal — escapes overflow clipping) ═══ */}
      {moreMenuId && moreMenuPos && (
        <div
          ref={moreMenuRef}
          style={{ position: "fixed", top: moreMenuPos.top, left: moreMenuPos.left, zIndex: 9999 }}
          className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 py-1 w-40"
        >
          {[{ label: "View Details", href: "/purchase-order/details" }, { label: "Duplicate", href: "#" }, { label: "Export PDF", href: "#" }].map((item) => (
            <Link key={item.label} href={item.href}>
              <button onClick={() => { setMoreMenuId(null); setMoreMenuPos(null); }} className="w-full text-left px-4 py-2 text-[11px] text-gray-700 hover:bg-gray-50 transition-colors">{item.label}</button>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
