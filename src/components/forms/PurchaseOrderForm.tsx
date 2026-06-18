"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";

interface Props { mode: "create" | "edit"; }

const INPUT = "w-full px-3 py-2 text-[12px] bg-white border border-gray-300 rounded-lg outline-none focus:border-[#884D70]/50 focus:ring-1 focus:ring-[#884D70]/10 text-slate-700 transition-all placeholder:text-gray-500";
const SELECT = INPUT + " appearance-none cursor-pointer";

const SECTION = "bg-white rounded-2xl border border-gray-100 p-5";
const SECTION_TITLE = "text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100";

export function PurchaseOrderForm({ mode }: Props) {
  const [form, setForm] = useState({
    poNumber: "", poType: "", deliveryLocation: "", itemName: "",
    itemQty: "", price: "", currency: "USD", shipTerm: "", payTerm: "",
    transporter: "", truckNo: "", driver: "", status: "pending",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Order Details */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Order Details</p>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="PO Number">
            <input className={INPUT} placeholder="PO-2024-00001" value={form.poNumber} onChange={e => set("poNumber", e.target.value)} />
          </FormField>
          <FormField label="PO Type">
            <select className={SELECT} value={form.poType} onChange={e => set("poType", e.target.value)}>
              <option value="">Select type…</option>
              <option value="Direct">Direct</option>
              <option value="Paddler">Paddler</option>
              <option value="Indent">Indent</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select className={SELECT} value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="pending">Pending</option>
              <option value="created">Created</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Item Details */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Item Details</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FormField label="Item Name">
              <input className={INPUT} placeholder="e.g. Steel Wire Mesh G12" value={form.itemName} onChange={e => set("itemName", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Quantity">
            <input className={INPUT} type="number" placeholder="0" value={form.itemQty} onChange={e => set("itemQty", e.target.value)} />
          </FormField>
          <FormField label="Price">
            <input className={INPUT} placeholder="0.00" value={form.price} onChange={e => set("price", e.target.value)} />
          </FormField>
          <FormField label="Currency">
            <select className={SELECT} value={form.currency} onChange={e => set("currency", e.target.value)}>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </FormField>
          <FormField label="Delivery Location">
            <input className={INPUT} placeholder="e.g. Mumbai Port Terminal 2" value={form.deliveryLocation} onChange={e => set("deliveryLocation", e.target.value)} />
          </FormField>
        </div>
      </div>

      {/* Shipping & Payment Terms */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Terms</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Shipping Terms">
            <select className={SELECT} value={form.shipTerm} onChange={e => set("shipTerm", e.target.value)}>
              <option value="">Select…</option>
              <option value="EXW - Ex Works">EXW - Ex Works</option>
              <option value="FOB - Free on Board">FOB - Free on Board</option>
              <option value="CIF - Cost Insurance Freight">CIF - Cost Insurance Freight</option>
              <option value="DDP - Delivered Duty Paid">DDP - Delivered Duty Paid</option>
            </select>
          </FormField>
          <FormField label="Payment Terms">
            <select className={SELECT} value={form.payTerm} onChange={e => set("payTerm", e.target.value)}>
              <option value="">Select…</option>
              <option value="Net 30 Days">Net 30 Days</option>
              <option value="Net 60 Days">Net 60 Days</option>
              <option value="15% Advance">15% Advance</option>
              <option value="100% Advance">100% Advance</option>
              <option value="LC at Sight">LC at Sight</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Logistics */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Logistics</p>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Transporter">
            <input className={INPUT} placeholder="e.g. SafeLogistics Pvt Ltd" value={form.transporter} onChange={e => set("transporter", e.target.value)} />
          </FormField>
          <FormField label="Truck Number">
            <input className={INPUT} placeholder="e.g. MH05-1234" value={form.truckNo} onChange={e => set("truckNo", e.target.value)} />
          </FormField>
          <FormField label="Driver Name">
            <input className={INPUT} placeholder="e.g. Shivraj P." value={form.driver} onChange={e => set("driver", e.target.value)} />
          </FormField>
        </div>
      </div>

    </div>
  );
}
