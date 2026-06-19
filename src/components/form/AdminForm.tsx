"use client";

import { useState, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminFormProps = {
  mode: "create" | "view" | "edit";
  adminId?: string;
};

// ── Options ───────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin",       value: "admin"       },
  { label: "Manager",     value: "manager"     },
  { label: "Staff",       value: "staff"       },
];

const ASSIGN_OPTIONS = [
  { label: "Team Alpha", value: "team_alpha" },
  { label: "Team Beta",  value: "team_beta"  },
  { label: "Team Gamma", value: "team_gamma" },
];

const STATE_OPTIONS = [
  { label: "Maharashtra", value: "MH" },
  { label: "Gujarat",     value: "GJ" },
  { label: "Delhi",       value: "DL" },
  { label: "Karnataka",   value: "KA" },
  { label: "Tamil Nadu",  value: "TN" },
];

const DISTRICT_OPTIONS = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Pune",   value: "pune"   },
  { label: "Nagpur", value: "nagpur" },
  { label: "Thane",  value: "thane"  },
];

const COUNTRY_OPTIONS = [
  { label: "India",          value: "IN" },
  { label: "United States",  value: "US" },
  { label: "United Kingdom", value: "UK" },
  { label: "Australia",      value: "AU" },
];

const THEME_OPTIONS = [
  { label: "Default Purple", value: "purple" },
  { label: "Ocean Blue",     value: "blue"   },
  { label: "Forest Green",   value: "green"  },
  { label: "Coral Red",      value: "red"    },
];

const PERMISSION_OPTIONS = [
  { label: "Partner Management",  value: "partner_mgmt"   },
  { label: "API Management",      value: "api_mgmt"       },
  { label: "Employee Management", value: "employee_mgmt"  },
  { label: "Reports Access",      value: "reports_access" },
];

// ── Mock data (prefills view / edit modes) ────────────────────────────────────

const MOCK_ADMINS: Record<string, {
  form: Record<string, string>;
  company: Record<string, string>;
  logoUrl: string;
  permissions: string[];
}> = {
  "ADM-001": {
    form: {
      firstName: "Ramesh", lastName: "Kumar",
      email: "ramesh.kumar@techiebears.com", password: "secret123",
      phone: "+91 98765 43210", role: "super_admin", assignTo: "team_alpha",
      city: "Mumbai", state: "MH", district: "mumbai", tahsil: "Borivali",
      pincode: "400092", gstNo: "27AAPFU0939F1ZV", aadhaarNo: "2345 6789 0123",
      panNo: "ABCDE1234F", bankBeneficiaryName: "Ramesh Kumar",
      bankName: "HDFC Bank", bankAccountNumber: "50100123456789",
    },
    company: {
      domain: "techcorp.com", name: "TechCorp Solutions",
      email: "admin@techcorp.com", phone: "+91 98765 43210",
      address1: "101, Tech Park, Andheri East", address2: "Mumbai Suburban",
      state: "MH", country: "IN", theme: "purple", pincode: "400093",
      supportEmail: "support@techcorp.com", supportPhone: "+91 80000 11111",
    },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt", "reports_access"],
  },
  "ADM-002": {
    form: {
      firstName: "Priya", lastName: "Sharma",
      email: "priya.sharma@techiebears.com", password: "secret456",
      phone: "+91 91234 56789", role: "admin", assignTo: "team_beta",
      city: "Pune", state: "MH", district: "pune", tahsil: "Haveli",
      pincode: "411001", gstNo: "27AAAPS1234B1ZQ", aadhaarNo: "3456 7890 1234",
      panNo: "BCDEF2345G", bankBeneficiaryName: "Priya Sharma",
      bankName: "ICICI Bank", bankAccountNumber: "001201234567",
    },
    company: {
      domain: "innosoft.in", name: "InnoSoft Pvt Ltd",
      email: "contact@innosoft.in", phone: "+91 91234 56789",
      address1: "42, IT Hub, Kothrud", address2: "Pune City",
      state: "MH", country: "IN", theme: "blue", pincode: "411038",
      supportEmail: "support@innosoft.in", supportPhone: "+91 80000 22222",
    },
    logoUrl: "", permissions: ["employee_mgmt", "reports_access"],
  },
  "ADM-003": {
    form: {
      firstName: "Ankit", lastName: "Mehta",
      email: "ankit.mehta@techiebears.com", password: "secret789",
      phone: "+91 87654 32109", role: "manager", assignTo: "team_gamma",
      city: "Ahmedabad", state: "GJ", district: "nagpur", tahsil: "Navsari",
      pincode: "380001", gstNo: "24AACPM5678C1ZP", aadhaarNo: "4567 8901 2345",
      panNo: "CDEFG3456H", bankBeneficiaryName: "Ankit Mehta",
      bankName: "Axis Bank", bankAccountNumber: "9170123456789",
    },
    company: {
      domain: "globaledge.io", name: "GlobalEdge Inc",
      email: "info@globaledge.io", phone: "+1 555 234 5678",
      address1: "5th Floor, Commerce House", address2: "C.G. Road, Navrangpura",
      state: "GJ", country: "US", theme: "green", pincode: "380009",
      supportEmail: "support@globaledge.io", supportPhone: "+1 800 123 4567",
    },
    logoUrl: "", permissions: ["api_mgmt"],
  },
  "ADM-004": {
    form: {
      firstName: "Sunita", lastName: "Patel",
      email: "sunita.patel@techiebears.com", password: "secret000",
      phone: "+91 99887 76655", role: "staff", assignTo: "team_alpha",
      city: "Surat", state: "GJ", district: "thane", tahsil: "Surat City",
      pincode: "395003", gstNo: "24AABPS9876D1ZR", aadhaarNo: "5678 9012 3456",
      panNo: "DEFGH4567I", bankBeneficiaryName: "Sunita Patel",
      bankName: "SBI", bankAccountNumber: "20123456789012",
    },
    company: {
      domain: "apexsys.com", name: "Apex Systems",
      email: "hello@apexsys.com", phone: "+91 88776 65544",
      address1: "Plot 22, GIDC Estate", address2: "Sachin, Surat",
      state: "GJ", country: "IN", theme: "red", pincode: "394230",
      supportEmail: "support@apexsys.com", supportPhone: "+91 80000 33333",
    },
    logoUrl: "", permissions: [],
  },
  "ADM-005": {
    form: {
      firstName: "Vikram", lastName: "Singh",
      email: "vikram.singh@techiebears.com", password: "secret111",
      phone: "+91 77665 54433", role: "admin", assignTo: "team_beta",
      city: "Delhi", state: "DL", district: "mumbai", tahsil: "Central",
      pincode: "110001", gstNo: "07AACPV3456E1ZS", aadhaarNo: "6789 0123 4567",
      panNo: "EFGHI5678J", bankBeneficiaryName: "Vikram Singh",
      bankName: "PNB", bankAccountNumber: "3600123456789",
    },
    company: {
      domain: "bluestar.net", name: "BlueStar Logistics",
      email: "ops@bluestar.net", phone: "+91 77665 54433",
      address1: "Unit 8, Okhla Industrial Area", address2: "Phase II, New Delhi",
      state: "DL", country: "IN", theme: "blue", pincode: "110020",
      supportEmail: "support@bluestar.net", supportPhone: "+91 80000 44444",
    },
    logoUrl: "", permissions: ["partner_mgmt", "reports_access"],
  },
  "ADM-006": {
    form: {
      firstName: "Meena", lastName: "Iyer",
      email: "meena.iyer@techiebears.com", password: "secret222",
      phone: "+91 88776 65544", role: "manager", assignTo: "team_gamma",
      city: "Bangalore", state: "KA", district: "pune", tahsil: "Bengaluru South",
      pincode: "560001", gstNo: "29AACPM7890F1ZT", aadhaarNo: "7890 1234 5678",
      panNo: "FGHIJ6789K", bankBeneficiaryName: "Meena Iyer",
      bankName: "Canara Bank", bankAccountNumber: "0987654321012",
    },
    company: {
      domain: "nexusdigital.co", name: "Nexus Digital",
      email: "nexus@nexusdigital.co", phone: "+91 99001 12233",
      address1: "12, Koramangala 4th Block", address2: "Bengaluru Urban",
      state: "KA", country: "IN", theme: "purple", pincode: "560034",
      supportEmail: "support@nexusdigital.co", supportPhone: "+91 80000 55555",
    },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt"],
  },
};

// ── LogoUpload ────────────────────────────────────────────────────────────────

function LogoUpload({
  value, onChange, disabled = false,
}: {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => { if (!disabled) e.preventDefault(); }}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-6 transition-all h-full ${
        disabled
          ? "border-gray-200 bg-gray-50/60 cursor-default opacity-60"
          : "border-[#884D70]/30 bg-[#FFF0EB]/40 hover:border-[#884D70]/60 hover:bg-[#FFF0EB]/70 cursor-pointer"
      }`}
    >
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Company logo" className="h-14 object-contain rounded-lg" />
          {!disabled && <span className="text-[10px] text-[#884D70] font-medium">Click to change</span>}
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-[#884D70]/10 flex items-center justify-center">
            <Icon name="add_photo_alternate" size={20} className="text-[#884D70]" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-medium text-slate-700">
              {disabled ? "No logo uploaded" : "Upload Company Logo"}
            </p>
            {!disabled && <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP · max 2 MB</p>}
          </div>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

// ── CheckboxGroup ─────────────────────────────────────────────────────────────

function CheckboxGroup({
  label, options, value, onChange, disabled = false,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) {
  const toggle = (opt: string) => {
    if (disabled) return;
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <div>
      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
        {label} {!disabled && <span className="text-rose-400">*</span>}
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-2.5">
        {options.map((opt) => {
          const checked = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`flex items-center gap-2 select-none ${disabled ? "cursor-default opacity-70" : "cursor-pointer"}`}
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                checked
                  ? "bg-[#884D70] border-[#884D70]"
                  : "bg-white border-gray-300 hover:border-[#884D70]/50"
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
    </div>
  );
}

// ── AdminForm ─────────────────────────────────────────────────────────────────

export function AdminForm({ mode, adminId }: AdminFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = adminId ? (MOCK_ADMINS[adminId] ?? null) : null;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    phone: "", role: "", assignTo: "", city: "",
    state: "", district: "", tahsil: "", pincode: "",
    gstNo: "", aadhaarNo: "", panNo: "",
    bankBeneficiaryName: "", bankName: "", bankAccountNumber: "",
    ...initial?.form,
  });

  const [company, setCompany] = useState({
    domain: "", name: "", email: "", phone: "",
    address1: "", address2: "",
    state: "", country: "", theme: "",
    pincode: "", supportEmail: "", supportPhone: "",
    ...initial?.company,
  });

  const [logoUrl, setLogoUrl]         = useState(initial?.logoUrl ?? "");
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);

  const setF = (key: string, v: string) => setForm((p) => ({ ...p, [key]: v }));
  const setC = (key: string, v: string) => setCompany((p) => ({ ...p, [key]: v }));

  const totalFields = Object.keys(form).length + Object.keys(company).length + 2;
  const filledCount =
    Object.values(form).filter(Boolean).length +
    Object.values(company).filter(Boolean).length +
    (logoUrl ? 1 : 0) +
    permissions.length;

  const steps = [
    {
      label: "Admin Details",
      complete: [form.firstName, form.lastName, form.email, form.phone, form.role,
        form.city, form.aadhaarNo, form.panNo, form.bankName].every(Boolean),
    },
    {
      label: "Company Details",
      complete: [company.domain, company.name, company.email, company.phone,
        company.address1, company.state, company.country, company.pincode].every(Boolean)
        && !!logoUrl && permissions.length > 0,
    },
    { label: "Review & Submit", complete: false },
  ];

  const title     = isCreate ? "Create Admin" : isView ? "View Admin" : "Edit Admin";
  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <FloatingNavbar />
      <SecondaryNav />

      <DashboardPageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard",  href: "/" },
          { label: "Admin Mgmt", href: "/admin-management" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <div className="flex items-center gap-3">
              <StatusBadge label={isCreate ? "New Admin" : "Editing"} color="info" pulse />
              <ProgressPill steps={steps} />
            </div>
          )
        }
      />

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        {/* ── Admin Details ── */}
        <Card className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <CardHeader
            title="Admin Details"
            hint={disabled ? undefined : "Tab · Enter to move between fields"}
          />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormInput disabled={disabled} label="First Name"            value={form.firstName}           onChange={(v) => setF("firstName", v)}           placeholder="Enter first name" />
            <FormInput disabled={disabled} label="Last Name"             value={form.lastName}            onChange={(v) => setF("lastName", v)}            placeholder="Enter last name" />
            <FormInput disabled={disabled} label="Email"                 value={form.email}               onChange={(v) => setF("email", v)}               placeholder="name@company.com"    type="email" />
            <FormInput disabled={disabled} label="Password"              value={form.password}            onChange={(v) => setF("password", v)}            placeholder="Enter password"       type={isView ? "text" : "password"} />
            <FormInput disabled={disabled} label="Phone Number"          value={form.phone}               onChange={(v) => setF("phone", v)}               placeholder="+91 98765 43210"     type="tel" />
            <FormCombobox disabled={disabled} label="Role"               value={form.role}                onChange={(v) => setF("role", v)}                options={ROLE_OPTIONS} />
            <FormCombobox disabled={disabled} label="Assign To"          value={form.assignTo}            onChange={(v) => setF("assignTo", v)}            options={ASSIGN_OPTIONS} />
            <FormInput disabled={disabled} label="City"                  value={form.city}                onChange={(v) => setF("city", v)}                placeholder="Enter city" />
            <FormCombobox disabled={disabled} label="State"              value={form.state}               onChange={(v) => setF("state", v)}               options={STATE_OPTIONS} />
            <FormCombobox disabled={disabled} label="District"           value={form.district}            onChange={(v) => setF("district", v)}            options={DISTRICT_OPTIONS} />
            <FormInput disabled={disabled} label="Tahsil"                value={form.tahsil}              onChange={(v) => setF("tahsil", v)}              placeholder="Enter tahsil" />
            <FormInput disabled={disabled} label="Pincode"               value={form.pincode}             onChange={(v) => setF("pincode", v)}             placeholder="Enter pincode" />
            <FormInput disabled={disabled} label="GST No"                value={form.gstNo}               onChange={(v) => setF("gstNo", v)}               placeholder="e.g. 27AAPFU0939F1ZV" />
            <FormInput disabled={disabled} label="Aadhaar No"            value={form.aadhaarNo}           onChange={(v) => setF("aadhaarNo", v)}           placeholder="12-digit Aadhaar" />
            <FormInput disabled={disabled} label="PAN No"                value={form.panNo}               onChange={(v) => setF("panNo", v)}               placeholder="e.g. ABCDE1234F" />
            <FormInput disabled={disabled} label="Bank Beneficiary Name" value={form.bankBeneficiaryName} onChange={(v) => setF("bankBeneficiaryName", v)} placeholder="Enter beneficiary name" />
            <FormInput disabled={disabled} label="Bank Name"             value={form.bankName}            onChange={(v) => setF("bankName", v)}            placeholder="Enter bank name" />
            <FormInput disabled={disabled} label="Bank Account Number"   value={form.bankAccountNumber}   onChange={(v) => setF("bankAccountNumber", v)}   placeholder="Enter account number" />
          </div>
        </Card>

        {/* ── Company Details ── */}
        <Card className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <CardHeader
            title="Company Details"
            hint={disabled ? undefined : "Tab · Enter to move between fields"}
          />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormInput disabled={disabled} label="Company Domain"         value={company.domain}       onChange={(v) => setC("domain", v)}       placeholder="e.g. acme.com" />
            <FormInput disabled={disabled} label="Company Name"           value={company.name}         onChange={(v) => setC("name", v)}         placeholder="Enter company name" />
            <FormInput disabled={disabled} label="Company Email"          value={company.email}        onChange={(v) => setC("email", v)}        placeholder="contact@company.com"  type="email" />
            <FormInput disabled={disabled} label="Company Phone"          value={company.phone}        onChange={(v) => setC("phone", v)}        placeholder="+91 98765 43210"      type="tel" />
            <FormInput disabled={disabled} label="Address Line 1"         value={company.address1}     onChange={(v) => setC("address1", v)}     placeholder="Street / Building" />
            <FormInput disabled={disabled} label="Address Line 2"         value={company.address2}     onChange={(v) => setC("address2", v)}     placeholder="Area / Locality" />
            <FormCombobox disabled={disabled} label="State"               value={company.state}        onChange={(v) => setC("state", v)}        options={STATE_OPTIONS} />
            <FormCombobox disabled={disabled} label="Country"             value={company.country}      onChange={(v) => setC("country", v)}      options={COUNTRY_OPTIONS} />
            <FormCombobox disabled={disabled} label="Theme"               value={company.theme}        onChange={(v) => setC("theme", v)}        options={THEME_OPTIONS} />
            <FormInput disabled={disabled} label="Pincode"                value={company.pincode}      onChange={(v) => setC("pincode", v)}      placeholder="Enter pincode" />
            <FormInput disabled={disabled} label="Support Email"          value={company.supportEmail} onChange={(v) => setC("supportEmail", v)} placeholder="support@company.com"  type="email" />
            <FormInput disabled={disabled} label="Support Phone"          value={company.supportPhone} onChange={(v) => setC("supportPhone", v)} placeholder="+91 80000 00000"      type="tel" />

            {/* Logo upload */}
            <div className="lg:col-span-1 sm:col-span-2 col-span-1">
              <LogoUpload value={logoUrl} onChange={setLogoUrl} disabled={disabled} />
            </div>

            {/* Dashboard permissions */}
            <div className="lg:col-span-2 sm:col-span-2 col-span-1 flex items-center">
              <CheckboxGroup
                label="Dashboard Permissions"
                options={PERMISSION_OPTIONS}
                value={permissions}
                onChange={setPermissions}
                disabled={disabled}
              />
            </div>
          </div>
        </Card>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/admin-management" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/admin-management/${adminId}/edit`} variant="pill-primary">
                Edit Admin
              </ButtonLink>
            </>
          }
        />
      )}

      {(isCreate || isEdit) && (
        <StickyFooter
          stats={[{ label: "Fields filled", value: `${filledCount} / ${totalFields}` }]}
          actions={
            <>
              <ButtonLink href="/admin-management" variant="pill-ghost">Cancel</ButtonLink>
              {isCreate && <Button variant="pill-secondary">Save as Draft</Button>}
              <Button variant="pill-primary" icon="check">
                {isCreate ? "Create Admin" : "Update Admin"}
              </Button>
            </>
          }
        />
      )}

    </div>
  );
}
