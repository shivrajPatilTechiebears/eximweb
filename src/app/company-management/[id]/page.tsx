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
  displayName: string; status: string;
  domain: string; name: string; email: string; phone: string;
  address1: string; address2: string; state: string; country: string;
  theme: string; pincode: string; supportEmail: string; supportPhone: string;
  logoUrl: string; permissions: string[];
}

const MOCK_COMPANIES: Record<string, CompanyRecord> = {
  "COMP-001": {
    displayName: "TechCorp Solutions", status: "active",
    domain: "techcorp.com", name: "TechCorp Solutions",
    email: "admin@techcorp.com", phone: "+91 98765 43210",
    address1: "101 Tech Park, Andheri East", address2: "Near WEH Metro",
    state: "MH", country: "IN", theme: "purple", pincode: "400069",
    supportEmail: "support@techcorp.com", supportPhone: "+91 98765 00000",
    logoUrl: "", permissions: ["partner_mgmt"],
  },
  "COMP-002": {
    displayName: "InnoSoft Pvt Ltd", status: "active",
    domain: "innosoft.in", name: "InnoSoft Pvt Ltd",
    email: "contact@innosoft.in", phone: "+91 91234 56789",
    address1: "22 SG Highway", address2: "Prahlad Nagar",
    state: "GJ", country: "IN", theme: "blue", pincode: "380015",
    supportEmail: "help@innosoft.in", supportPhone: "+91 91234 00000",
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt"],
  },
};

const FALLBACK: CompanyRecord = {
  displayName: "Unknown Company", status: "pending",
  domain: "", name: "", email: "", phone: "",
  address1: "", address2: "", state: "", country: "",
  theme: "", pincode: "", supportEmail: "", supportPhone: "",
  logoUrl: "", permissions: [],
};

// ── FileUpload (view-only) ────────────────────────────────────────────────────

function FileUploadView({ value }: { value?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-100 bg-gray-50 rounded-xl px-6 py-8">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Company logo" className="h-16 object-contain rounded-lg" />
      ) : (
        <>
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
            <Icon name="add_photo_alternate" size={22} className="text-gray-300" />
          </div>
          <p className="text-[11px] font-medium text-gray-400">No logo uploaded</p>
        </>
      )}
      <input ref={ref} type="file" className="hidden" />
    </div>
  );
}

// ── CheckboxGroup (view-only) ─────────────────────────────────────────────────

function CheckboxGroupView({ options, value }: { options: { label: string; value: string }[]; value: string[] }) {
  return (
    <div className="flex flex-wrap gap-4 pt-1 opacity-50">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        return (
          <div key={opt.value} className="flex items-center gap-2">
            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
              checked ? "bg-[#884D70] border-[#884D70]" : "bg-white border-gray-300"
            }`}>
              {checked && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                </svg>
              )}
            </span>
            <span className="text-[12px] text-slate-700">{opt.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ViewCompanyPage() {
  const params = useParams();
  const id = params.id as string;
  const company = MOCK_COMPANIES[id] ?? FALLBACK;

  const [data] = useState(company);

  const statusColor = company.status === "active" ? "success" : company.status === "pending" ? "warning" : "error";
  const statusLabel = company.status === "active" ? "Active" : company.status === "pending" ? "Pending" : "Inactive";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800">

      <FloatingNavbar />

      <DashboardPageHeader
        title={company.displayName}
        breadcrumbs={[
          { label: "Dashboard",              href: "/" },
          { label: "White Label Management" },
          { label: "Company Management",     href: "/company-management" },
          { label: company.displayName },
        ]}
        rightContent={
          <>
            <StatusBadge label={statusLabel} color={statusColor} />
            <div className="w-px h-4 bg-gray-200" />
            <Link href={`/company-management/${id}/edit`}>
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#884D70] text-white text-[12px] font-semibold rounded-full hover:bg-[#6B3A5A] transition-colors shadow-md">
                Edit Company
              </button>
            </Link>
          </>
        }
      />

      <main className="flex-1 px-6 py-4 pb-10">
        <div className="space-y-3">

          {/* ── Company Details ── */}
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="px-5 py-2.5 border-b border-gray-100">
              <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Company Details</h2>
            </div>
            <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
              {COMPANY_FIELDS.map((field) =>
                field.type === "select" ? (
                  <FormSelect
                    key={field.key}
                    label={field.label}
                    value={(data as Record<string, string>)[field.key] ?? ""}
                    options={field.options}
                    placeholder="—"
                    onChange={() => {}}
                    disabled
                  />
                ) : (
                  <FormInput
                    key={field.key}
                    label={field.label}
                    value={(data as Record<string, string>)[field.key] ?? ""}
                    placeholder={field.placeholder}
                    type={field.inputType}
                    onChange={() => {}}
                    disabled
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
                <FileUploadView value={data.logoUrl || undefined} />
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
                <CheckboxGroupView options={PERMISSION_OPTIONS} value={data.permissions} />
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
