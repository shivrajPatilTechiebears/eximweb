"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";

interface Props { mode: "create" | "edit"; }

const INPUT = "w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 text-slate-700 transition-all placeholder:text-gray-400";
const SELECT = INPUT + " appearance-none cursor-pointer";

const SECTION = "bg-white rounded-2xl border border-gray-100 p-5";
const SECTION_TITLE = "text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100";

export function CompanyForm({ mode }: Props) {
  const [form, setForm] = useState({
    name: "", domain: "", email: "", phone: "", state: "", country: "India", status: "pending",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Company Info */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Company Information</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Company Name">
            <input className={INPUT} placeholder="e.g. TechCorp Solutions" value={form.name} onChange={e => set("name", e.target.value)} />
          </FormField>
          <FormField label="Domain">
            <input className={INPUT} placeholder="e.g. techcorp.com" value={form.domain} onChange={e => set("domain", e.target.value)} />
          </FormField>
          <FormField label="Email Address">
            <input className={INPUT} type="email" placeholder="admin@company.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </FormField>
          <FormField label="Phone Number">
            <input className={INPUT} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </FormField>
        </div>
      </div>

      {/* Location & Status */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Location & Status</p>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="State / Province">
            <input className={INPUT} placeholder="e.g. Maharashtra" value={form.state} onChange={e => set("state", e.target.value)} />
          </FormField>
          <FormField label="Country">
            <select className={SELECT} value={form.country} onChange={e => set("country", e.target.value)}>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="UAE">UAE</option>
              <option value="Singapore">Singapore</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select className={SELECT} value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </FormField>
        </div>
      </div>

    </div>
  );
}
