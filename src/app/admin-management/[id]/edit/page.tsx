"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import type { SelectOption } from "@/components/ui/FormSelect";

// ── Options ───────────────────────────────────────────────────────────────────

const ROLE_OPTIONS: SelectOption[] = [
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin",       value: "admin" },
  { label: "Manager",     value: "manager" },
  { label: "Staff",       value: "staff" },
];

const ASSIGN_OPTIONS: SelectOption[] = [
  { label: "Team Alpha", value: "team_alpha" },
  { label: "Team Beta",  value: "team_beta" },
  { label: "Team Gamma", value: "team_gamma" },
];

const STATE_OPTIONS: SelectOption[] = [
  { label: "Maharashtra", value: "MH" },
  { label: "Gujarat",     value: "GJ" },
  { label: "Delhi",       value: "DL" },
  { label: "Karnataka",   value: "KA" },
  { label: "Tamil Nadu",  value: "TN" },
];

const DISTRICT_OPTIONS: SelectOption[] = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Pune",   value: "pune" },
  { label: "Nagpur", value: "nagpur" },
  { label: "Thane",  value: "thane" },
];

// ── Field sections config ─────────────────────────────────────────────────────

type InputFieldDef  = { type: "input";  key: string; label: string; placeholder?: string; inputType?: string };
type SelectFieldDef = { type: "select"; key: string; label: string; options: SelectOption[] };
type FieldDef = InputFieldDef | SelectFieldDef;

const SECTIONS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Personal Info",
    fields: [
      { type: "input",  key: "firstName", label: "First Name",   placeholder: "Enter first name" },
      { type: "input",  key: "lastName",  label: "Last Name",    placeholder: "Enter last name" },
      { type: "input",  key: "email",     label: "Email",        placeholder: "Enter email address", inputType: "email" },
      { type: "input",  key: "password",  label: "Password",     placeholder: "Enter new password",  inputType: "password" },
      { type: "input",  key: "phone",     label: "Phone Number", placeholder: "Enter phone number",  inputType: "tel" },
      { type: "select", key: "role",      label: "Role",         options: ROLE_OPTIONS },
      { type: "select", key: "assignTo",  label: "Assign To",    options: ASSIGN_OPTIONS },
      { type: "input",  key: "city",      label: "City",         placeholder: "Enter city" },
      { type: "select", key: "state",     label: "State",        options: STATE_OPTIONS },
      { type: "select", key: "district",  label: "District",     options: DISTRICT_OPTIONS },
      { type: "input",  key: "tahsil",    label: "Tahsil",       placeholder: "Enter tahsil" },
      { type: "input",  key: "pincode",   label: "Pincode",      placeholder: "Enter pincode" },
    ],
  },
  {
    title: "Identity & Bank Details",
    fields: [
      { type: "input", key: "gstNo",              label: "GST No",               placeholder: "e.g. 27AAPFU0939F1ZV" },
      { type: "input", key: "aadhaarNo",           label: "Aadhaar No",           placeholder: "12-digit Aadhaar number" },
      { type: "input", key: "panNo",               label: "PAN No",               placeholder: "e.g. ABCDE1234F" },
      { type: "input", key: "bankBeneficiaryName", label: "Bank Beneficiary Name",placeholder: "Enter beneficiary name" },
      { type: "input", key: "bankName",            label: "Bank Name",            placeholder: "Enter bank name" },
      { type: "input", key: "bankAccountNumber",   label: "Bank Account Number",  placeholder: "Enter account number" },
    ],
  },
];

// ── Mock data ─────────────────────────────────────────────────────────────────

type AdminRecord = Record<string, string> & { displayName: string };

const MOCK_ADMINS: Record<string, AdminRecord> = {
  "ADM-001": {
    displayName: "Ramesh Kumar",
    firstName: "Ramesh", lastName: "Kumar",
    email: "ramesh.kumar@techiebears.com", phone: "+91 98765 43210",
    role: "super_admin", assignTo: "team_alpha",
    city: "Mumbai", state: "MH", district: "mumbai", tahsil: "Andheri", pincode: "400069",
    gstNo: "27AAPFU0939F1ZV", aadhaarNo: "1234 5678 9012", panNo: "ABCDE1234F",
    bankBeneficiaryName: "Ramesh Kumar", bankName: "HDFC Bank", bankAccountNumber: "50100123456789",
  },
  "ADM-002": {
    displayName: "Priya Sharma",
    firstName: "Priya", lastName: "Sharma",
    email: "priya.sharma@techiebears.com", phone: "+91 91234 56789",
    role: "admin", assignTo: "team_beta",
    city: "Pune", state: "MH", district: "pune", tahsil: "Haveli", pincode: "411001",
    gstNo: "27BBPFU1939F1ZV", aadhaarNo: "9876 5432 1098", panNo: "FGHIJ5678K",
    bankBeneficiaryName: "Priya Sharma", bankName: "ICICI Bank", bankAccountNumber: "60200987654321",
  },
  "ADM-003": {
    displayName: "Ankit Mehta",
    firstName: "Ankit", lastName: "Mehta",
    email: "ankit.mehta@techiebears.com", phone: "+91 87654 32109",
    role: "manager", assignTo: "team_gamma",
    city: "Ahmedabad", state: "GJ", district: "thane", tahsil: "Daskroi", pincode: "380015",
    gstNo: "", aadhaarNo: "", panNo: "", bankBeneficiaryName: "", bankName: "", bankAccountNumber: "",
  },
  "ADM-004": {
    displayName: "Sunita Patel",
    firstName: "Sunita", lastName: "Patel",
    email: "sunita.patel@techiebears.com", phone: "+91 99887 76655",
    role: "staff", city: "Surat", state: "GJ",
    assignTo: "", district: "", tahsil: "", pincode: "",
    gstNo: "", aadhaarNo: "", panNo: "", bankBeneficiaryName: "", bankName: "", bankAccountNumber: "",
  },
  "ADM-005": {
    displayName: "Vikram Singh",
    firstName: "Vikram", lastName: "Singh",
    email: "vikram.singh@techiebears.com", phone: "+91 77665 54433",
    role: "admin", city: "Delhi", state: "DL",
    assignTo: "", district: "", tahsil: "", pincode: "",
    gstNo: "", aadhaarNo: "", panNo: "", bankBeneficiaryName: "", bankName: "", bankAccountNumber: "",
  },
  "ADM-006": {
    displayName: "Meena Iyer",
    firstName: "Meena", lastName: "Iyer",
    email: "meena.iyer@techiebears.com", phone: "+91 88776 65544",
    role: "manager", city: "Bangalore", state: "KA",
    assignTo: "", district: "", tahsil: "", pincode: "",
    gstNo: "", aadhaarNo: "", panNo: "", bankBeneficiaryName: "", bankName: "", bankAccountNumber: "",
  },
};

const FALLBACK: AdminRecord = { displayName: "Unknown Admin" };

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditAdminPage() {
  const params = useParams();
  const id = params.id as string;
  const admin = MOCK_ADMINS[id] ?? FALLBACK;

  const [data, setData] = useState<Record<string, string>>(admin);

  const set = (key: string, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-[#eaecf1]">

      <FloatingNavbar />

      <DashboardPageHeader
        title={`Edit · ${admin.displayName}`}
        breadcrumbs={[
          { label: "Dashboard",              href: "/" },
          { label: "White Label Management" },
          { label: "Admin Management",       href: "/admin-management" },
          { label: admin.displayName,        href: `/admin-management/${id}` },
          { label: "Edit" },
        ]}
        rightContent={<StatusBadge label="Editing" color="warning" pulse />}
      />

      <main className="flex-1 px-6 py-4 pb-20 bg-[#eaecf1]">
        <div className="space-y-3">
          {SECTIONS.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            >
              <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                  {section.title}
                </h2>
                <span className="text-[10px] text-gray-400">Tab · Enter to move between fields</span>
              </div>
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3">
                {section.fields.map((field) =>
                  field.type === "select" ? (
                    <FormSelect
                      key={field.key}
                      label={field.label}
                      value={data[field.key] ?? ""}
                      options={field.options}
                      placeholder="Select…"
                      onChange={(v) => set(field.key, v)}
                    />
                  ) : (
                    <FormInput
                      key={field.key}
                      label={field.label}
                      value={data[field.key] ?? ""}
                      placeholder={field.placeholder}
                      type={field.inputType}
                      onChange={(v) => set(field.key, v)}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ═══ STICKY FOOTER ═══ */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-10 py-2.5 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          Editing <strong className="text-slate-600">{admin.displayName}</strong>
        </span>
        <div className="flex items-center gap-2">
          <Link href={`/admin-management/${id}`}>
            <button className="text-[12px] font-medium text-gray-500 px-4 py-1.5 hover:bg-gray-100 rounded-full transition-colors">
              Cancel
            </button>
          </Link>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md">
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
