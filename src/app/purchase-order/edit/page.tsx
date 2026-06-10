"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";

// ── Types & data ───────────────────────────────────────────────────────────────

interface PurchaseItem {
  id: number; name: string; qty: number; price: string;
  uom: string; taxCode: string; containers: string; packaging: string;
}

interface ScheduleRow {
  id: number; itemName: string; schedule: string;
  qty: string; reqDispatch: string; reqDelivery: string;
}

const PO_ID = "PO-2024-00139";

const FORM_FIELDS = [
  { key: "poType",    label: "PO Type",           type: "select", options: ["Paddler", "Standard"],           defaultValue: "Paddler" },
  { key: "truckNo",   label: "Truck No",           type: "input",  options: [],                               defaultValue: "MH-05-1234" },
  { key: "driver",    label: "Driver Details",     type: "input",  options: [],                               defaultValue: "Shivraj Patil" },
  { key: "delivery",  label: "Delivery Location",  type: "input",  options: [],                               defaultValue: "Pune, Maharashtra" },
  { key: "currency",  label: "Currency",           type: "select", options: ["USD ($)", "EUR (€)", "INR (₹)"], defaultValue: "USD ($)" },
  { key: "shipTerm",  label: "Shipment Terms",     type: "select", options: ["EXW - Ex Works", "FOB - Free on Board"], defaultValue: "EXW - Ex Works" },
  { key: "payTerm",   label: "Payment Terms",      type: "select", options: ["After Delivered", "Pre-paid"],  defaultValue: "" },
  { key: "transport", label: "Transporter",        type: "select", options: ["DHL", "FedEx"],                 defaultValue: "" },
];

const TABS = ["Schedule", "Shipment", "Test Sample", "Goods Receipt"];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function EditPurchaseOrderPage() {
  const [activeTab, setActiveTab] = useState("Schedule");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [items, setItems] = useState<PurchaseItem[]>([
    { id: 1, name: "Steel-01", qty: 100, price: "$100", uom: "Kg", taxCode: "GST", containers: "2", packaging: "Box Packaging" },
    { id: 2, name: "Steel-01", qty: 100, price: "$100", uom: "Kg", taxCode: "GST", containers: "2", packaging: "Box Packaging" },
  ]);

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([
    { id: 1, itemName: "", schedule: "", qty: "", reqDispatch: "", reqDelivery: "" },
  ]);

  const addItem = useCallback(() => {
    setItems((p) => [...p, { id: p.length + 1, name: "", qty: 0, price: "", uom: "", taxCode: "", containers: "", packaging: "" }]);
  }, []);
  const deleteItem = useCallback((id: number) => setItems((p) => p.filter((r) => r.id !== id)), []);

  const addSchedule = useCallback(() => {
    setScheduleRows((p) => [...p, { id: p.length + 1, itemName: "", schedule: "", qty: "", reqDispatch: "", reqDelivery: "" }]);
  }, []);
  const deleteSchedule = useCallback((id: number) => setScheduleRows((p) => p.filter((r) => r.id !== id)), []);

  const totalQty  = items.reduce((s, i) => s + i.qty, 0);
  const netAmount = items.reduce((s, i) => s + i.qty * parseFloat(i.price.replace(/[$,]/g, "") || "0"), 0);
  const taxEst    = Math.round(netAmount * 0.08);

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />

      {/* ═══ PAGE HEADER ═══ */}
      <div className="pt-16 bg-white border-b border-gray-200/70 px-10 py-3 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
            <Link href="/" className="hover:text-slate-600 transition-colors">Dashboard</Link>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            <Link href="/purchase-order" className="hover:text-slate-600 transition-colors">Purchase Orders</Link>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            <span className="text-slate-600 font-medium">{PO_ID}</span>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            <span className="text-slate-600 font-medium">Edit</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Edit Purchase Order</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full font-mono">{PO_ID}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Draft
          </span>
          <div className="w-px h-4 bg-gray-200" />
          <button className="text-[12px] font-medium text-gray-500 px-3.5 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            Save Changes
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
                  <select defaultValue={f.defaultValue} className="w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 text-slate-700 appearance-none cursor-pointer transition-all">
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    defaultValue={f.defaultValue}
                    className="w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 text-slate-700 transition-all"
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
                  {["Item Name", "Qty", "Price", "UOM", "Tax Code", "Containers", "Packaging", "Img", ""].map((h) => (
                    <th key={h} className="bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((row, i) => (
                  <tr key={row.id} className={`group ${i % 2 === 0 ? "bg-white" : "bg-[#f2f4f8]"} hover:bg-[#eef3fe] transition-colors`}>
                    <td className="w-8 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] group-hover:bg-[#e4e9f7] transition-colors select-none py-1.5">{i + 1}</td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.name} placeholder="Item name…" className="w-full min-w-[140px] px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.qty || ""} placeholder="0" type="number" className="w-16 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center tabular-nums placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.price} placeholder="0.00" className="w-24 px-2 py-1.5 text-[11px] font-semibold text-slate-900 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-right tabular-nums placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.uom} placeholder="Kg" className="w-14 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.taxCode} placeholder="GST_18" className="w-20 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center placeholder:text-gray-300 transition-all" />
                    </td>
                    <td className="border-b border-r border-gray-200 px-1 py-0.5">
                      <input defaultValue={row.containers} placeholder="0" className="w-20 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center tabular-nums placeholder:text-gray-300 transition-all" />
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
          <div className="px-4 py-2 bg-[#f8f9fc] border-t border-gray-100 flex items-center gap-6 rounded-b-xl">
            <span className="text-[10px] text-gray-400">Rows: <strong className="text-gray-600">{items.length}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Total Qty: <strong className="text-gray-600 tabular-nums">{totalQty}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">${netAmount.toLocaleString()}</strong></span>
            <span className="text-gray-200">|</span>
            <span className="text-[10px] text-gray-400">Tax Est.: <strong className="text-slate-700 tabular-nums">${taxEst.toLocaleString()}</strong></span>
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
              placeholder="Enter material grade and special handling instructions…"
              className="w-full px-3 py-2.5 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 text-slate-700 placeholder:text-gray-300 resize-none transition-all"
            />
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

          {activeTab === "Schedule" ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-8 bg-[#e8eaed] border-b border-r border-gray-300 select-none" />
                    {["Item Name", "Schedule", "Qty", "Req. Dispatch", "Req. Delivery", ""].map((h) => (
                      <th key={h} className="bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row, i) => (
                    <tr key={row.id} className={`group ${i % 2 === 0 ? "bg-white" : "bg-[#f2f4f8]"} hover:bg-[#eef3fe] transition-colors`}>
                      <td className="w-8 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] group-hover:bg-[#e4e9f7] transition-colors select-none py-1.5">{i + 1}</td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.itemName} placeholder="Item name…" className="w-full min-w-[120px] px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.schedule} placeholder="Schedule…" className="w-28 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.qty} placeholder="0" className="w-16 px-2 py-1.5 text-[11px] font-semibold text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded text-center tabular-nums placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.reqDispatch} placeholder="dd/mm/yyyy" className="w-28 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
                      </td>
                      <td className="border-b border-r border-gray-200 px-1 py-0.5">
                        <input defaultValue={row.reqDelivery} placeholder="dd/mm/yyyy" className="w-28 px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded placeholder:text-gray-300 transition-all" />
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
          <span className="text-gray-400">Total Qty: <strong className="text-slate-700 tabular-nums">{totalQty}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Net Amount: <strong className="text-slate-700 tabular-nums">${netAmount.toLocaleString()}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Tax Est.: <strong className="text-slate-700 tabular-nums">${taxEst.toLocaleString()}</strong></span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400">Grand Total: <strong className="text-slate-900 tabular-nums">${(netAmount + taxEst).toLocaleString()}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/purchase-order">
            <button className="text-[12px] font-medium text-gray-500 px-4 py-1.5 hover:bg-gray-100 rounded-full transition-colors">Cancel</button>
          </Link>
          <button className="text-[12px] font-medium text-gray-600 px-4 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">Save Changes</button>
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
