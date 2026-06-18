"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import type { SelectOption } from "@/components/ui/FormSelect";

// ── Options ───────────────────────────────────────────────────────────────────

const STATE_OPTIONS: SelectOption[]   = [
  { label: "Maharashtra", value: "MH" }, { label: "Gujarat",        value: "GJ" },
  { label: "Delhi",       value: "DL" }, { label: "Karnataka",      value: "KA" },
  { label: "Tamil Nadu",  value: "TN" },
];
const COUNTRY_OPTIONS: SelectOption[] = [
  { label: "India",          value: "IN" }, { label: "United States", value: "US" },
  { label: "United Kingdom", value: "UK" }, { label: "Australia",     value: "AU" },
];
const THEME_OPTIONS: SelectOption[]   = [
  { label: "Default Purple", value: "purple" }, { label: "Ocean Blue",   value: "blue" },
  { label: "Forest Green",   value: "green"  }, { label: "Coral Red",    value: "red"  },
];
const PERMISSION_OPTIONS = [
  { label: "Partner Mgmt", value: "partner_mgmt" },
  { label: "API Mgmt",     value: "api_mgmt" },
];

// ── Field config ──────────────────────────────────────────────────────────────

type InputFieldDef  = { type: "input";  key: string; label: string; placeholder?: string; inputType?: string };
type SelectFieldDef = { type: "select"; key: string; label: string; options: SelectOption[] };
type FieldDef = InputFieldDef | SelectFieldDef;

const COMPANY_FIELDS: FieldDef[] = [
  { type: "input",  key: "domain",       label: "Company Domain",         placeholder: "e.g. acme.com" },
  { type: "input",  key: "name",         label: "Company Name",           placeholder: "Enter company name" },
  { type: "input",  key: "email",        label: "Company Email",          placeholder: "contact@company.com",  inputType: "email" },
  { type: "input",  key: "phone",        label: "Company Phone Number",   placeholder: "+91 98765 43210",      inputType: "tel" },
  { type: "input",  key: "address1",     label: "Address 1",              placeholder: "Street / Building" },
  { type: "input",  key: "address2",     label: "Address 2",              placeholder: "Area / Locality" },
  { type: "select", key: "state",        label: "State",                  options: STATE_OPTIONS },
  { type: "select", key: "country",      label: "Country",                options: COUNTRY_OPTIONS },
  { type: "select", key: "theme",        label: "Theme",                  options: THEME_OPTIONS },
  { type: "input",  key: "pincode",      label: "Pincode",                placeholder: "Enter pincode" },
  { type: "input",  key: "supportEmail", label: "Company Support Email",  placeholder: "support@company.com",  inputType: "email" },
  { type: "input",  key: "supportPhone", label: "Company Support Number", placeholder: "+91 80000 00000",      inputType: "tel" },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

interface CompanyRecord {
  displayName: string;
  domain: string; name: string; email: string; phone: string;
  address1: string; address2: string; state: string; country: string;
  theme: string; pincode: string; supportEmail: string; supportPhone: string;
  logoUrl: string; permissions: string[];
}

const MOCK_COMPANIES: Record<string, CompanyRecord> = {
  "COMP-001": {
    displayName: "TechCorp Solutions",
    domain: "techcorp.com", name: "TechCorp Solutions",
    email: "admin@techcorp.com", phone: "+91 98765 43210",
    address1: "101 Tech Park, Andheri East", address2: "Near WEH Metro",
    state: "MH", country: "IN", theme: "purple", pincode: "400069",
    supportEmail: "support@techcorp.com", supportPhone: "+91 98765 00000",
    logoUrl: "", permissions: ["partner_mgmt"],
  },
  "COMP-002": {
    displayName: "InnoSoft Pvt Ltd",
    domain: "innosoft.in", name: "InnoSoft Pvt Ltd",
    email: "contact@innosoft.in", phone: "+91 91234 56789",
    address1: "22 SG Highway", address2: "Prahlad Nagar",
    state: "GJ", country: "IN", theme: "blue", pincode: "380015",
    supportEmail: "help@innosoft.in", supportPhone: "+91 91234 00000",
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt"],
  },
};

const FALLBACK: CompanyRecord = {
  displayName: "Unknown Company",
  domain: "", name: "", email: "", phone: "",
  address1: "", address2: "", state: "", country: "",
  theme: "", pincode: "", supportEmail: "", supportPhone: "",
  logoUrl: "", permissions: [],
};

// ── FileUpload ────────────────────────────────────────────────────────────────

function FileUpload({ value, onChange }: { value?: string; onChange: (dataUrl: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#884D70]/30 bg-[#FFF0EB]/40 hover:border-[#884D70]/60 hover:bg-[#FFF0EB]/70 rounded-xl px-6 py-8 cursor-pointer transition-all"
    >
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Company logo" className="h-16 object-contain rounded-lg" />
          <span className="text-[10px] text-[#884D70] font-medium">Click to change</span>
        </>
      ) : (
        <>
          <div className="w-11 h-11 rounded-xl bg-[#884D70]/10 flex items-center justify-center">
            <Icon name="add_photo_alternate" size={22} className="text-[#884D70]" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-medium text-slate-700">Upload Company Logo</p>
            <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG or SVG · max 2 MB</p>
          </div>
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

// ── CheckboxGroup ─────────────────────────────────────────────────────────────

function CheckboxGroup({
  options, value, onChange,
}: {
  options: { label: string; value: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <div className="flex flex-wrap gap-4 pt-1">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <label key={opt.value} onClick={() => toggle(opt.value)} className="flex items-center gap-2 cursor-pointer select-none">
            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
              checked ? "bg-[#884D70] border-[#884D70]" : "bg-white border-gray-300 hover:border-[#884D70]/50"
            }`}>
              {checked && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
              )}
            </span>
            <span className="text-[12px] text-slate-700">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditCompanyPage() {
  const params = useParams();
  const id = params.id as string;
  const company = MOCK_COMPANIES[id] ?? FALLBACK;

  const [data, setData] = useState(company);

  const set = (key: string, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">

      <FloatingNavbar />

      <DashboardPageHeader
        title={`Edit · ${company.displayName}`}
        breadcrumbs={[
          { label: "Dashboard",              href: "/" },
          { label: "White Label Management" },
          { label: "Company Management",     href: "/company-management" },
          { label: company.displayName,      href: `/company-management/${id}` },
          { label: "Edit" },
        ]}
        rightContent={<StatusBadge label="Editing" color="warning" pulse />}
      />

      <main className="flex-1 px-6 py-4 pb-20">
        <div className="space-y-3">

          {/* ── Company Details ── */}
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Company Details</h2>
              <span className="text-[10px] text-gray-400">Tab · Enter to move between fields</span>
            </div>
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
              {COMPANY_FIELDS.map((field) =>
                field.type === "select" ? (
                  <FormSelect
                    key={field.key}
                    label={field.label}
                    value={(data as Record<string, string>)[field.key] ?? ""}
                    options={field.options}
                    placeholder="Select…"
                    onChange={(v) => set(field.key, v)}
                  />
                ) : (
                  <FormInput
                    key={field.key}
                    label={field.label}
                    value={(data as Record<string, string>)[field.key] ?? ""}
                    placeholder={field.placeholder}
                    type={field.inputType}
                    onChange={(v) => set(field.key, v)}
                  />
                )
              )}
            </div>
          </div>

          {/* ── Logo + Permissions ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-5 py-2.5 border-b border-gray-100">
                <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Company Logo</h2>
              </div>
              <div className="px-5 py-4">
                <FileUpload
                  value={data.logoUrl || undefined}
                  onChange={(v) => setData((prev) => ({ ...prev, logoUrl: v }))}
                />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div className="px-5 py-2.5 border-b border-gray-100">
                <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Dashboard Permissions</h2>
              </div>
              <div className="px-5 py-4">
                <label className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Select Permissions
                </label>
                <CheckboxGroup
                  options={PERMISSION_OPTIONS}
                  value={data.permissions}
                  onChange={(v) => setData((prev) => ({ ...prev, permissions: v }))}
                />
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-10 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          Editing <strong className="text-slate-600">{company.displayName}</strong>
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/company-management/${id}`}>
            <button className="text-[12px] font-medium text-gray-500 px-4 py-1.5 hover:bg-gray-100 rounded-full transition-colors">
              Cancel
            </button>
          </Link>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#884D70] text-white text-[12px] font-semibold rounded-full hover:bg-[#6B3A5A] transition-colors shadow-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>

    </div>
  );
}
