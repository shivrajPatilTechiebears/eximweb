"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import {
  MOCK_COMPANIES, STATE_OPTIONS, COUNTRY_OPTIONS, THEME_OPTIONS, PERMISSION_OPTIONS,
} from "./types";
import type { CompanyFormData } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CompanyManagementFormProps = {
  mode: "view" | "edit";
  companyId?: string;
};

const DEFAULT_COMPANY: CompanyFormData = {
  domain: "", name: "", email: "", phone: "",
  address1: "", address2: "", state: "", country: "",
  theme: "", pincode: "", supportEmail: "", supportPhone: "",
};

// ── LogoUpload — shared by the disabled(view) and editable renderings ───────

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
          <div className="relative h-14 w-full">
            <Image
              src={value}
              alt="Company logo"
              fill
              unoptimized
              className="object-contain rounded-lg"
            />
          </div>
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

// ── CompanyManagementForm ─────────────────────────────────────────────────────

export function CompanyManagementForm({ mode, companyId }: CompanyManagementFormProps) {
  const isView = mode === "view";
  const disabled = isView;

  const initial = companyId ? (MOCK_COMPANIES[companyId] ?? null) : null;

  const [company, setCompany]         = useState<CompanyFormData>({ ...DEFAULT_COMPANY, ...initial?.company });
  const [logoUrl, setLogoUrl]         = useState(initial?.logoUrl ?? "");
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);

  const handleChange = (key: keyof CompanyFormData, value: string) =>
    setCompany((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(company).length + 2;
  const filledCount =
    Object.values(company).filter(Boolean).length +
    (logoUrl ? 1 : 0) +
    permissions.length;

  const lastCrumb = isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <DashboardPageHeader
        breadcrumbs={[
          { label: "Dashboard",          href: "/" },
          { label: "Company Mgmt",       href: "/company-management" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <StatusBadge label="Editing" color="info" pulse />
          )
        }
      />

      <main className="flex-1 px-6 py-4 pb-20">

        {/* ── Company Details ── */}
        <Card className="card-glass">
          <CardHeader
            title="Company Details"
            hint={disabled ? undefined : "Tab · Enter to move between fields"}
          />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormInput disabled={disabled} label="Company Domain"  value={company.domain}       onChange={(v) => handleChange("domain", v)}       placeholder="e.g. acme.com" />
            <FormInput disabled={disabled} label="Company Name"    value={company.name}         onChange={(v) => handleChange("name", v)}         placeholder="Enter company name" />
            <FormInput disabled={disabled} label="Company Email"   value={company.email}        onChange={(v) => handleChange("email", v)}        placeholder="contact@company.com"  type="email" />
            <FormInput disabled={disabled} label="Company Phone"   value={company.phone}        onChange={(v) => handleChange("phone", v)}        placeholder="+91 98765 43210"      type="tel" />
            <FormInput disabled={disabled} label="Address Line 1"  value={company.address1}     onChange={(v) => handleChange("address1", v)}     placeholder="Street / Building" />
            <FormInput disabled={disabled} label="Address Line 2"  value={company.address2}     onChange={(v) => handleChange("address2", v)}     placeholder="Area / Locality" />
            <FormCombobox disabled={disabled} label="State"        value={company.state}        onChange={(v) => handleChange("state", v)}        options={STATE_OPTIONS} />
            <FormCombobox disabled={disabled} label="Country"      value={company.country}      onChange={(v) => handleChange("country", v)}      options={COUNTRY_OPTIONS} />
            <FormCombobox disabled={disabled} label="Theme"        value={company.theme}        onChange={(v) => handleChange("theme", v)}        options={THEME_OPTIONS} />
            <FormInput disabled={disabled} label="Pincode"         value={company.pincode}      onChange={(v) => handleChange("pincode", v)}      placeholder="Enter pincode" />
            <FormInput disabled={disabled} label="Support Email"   value={company.supportEmail} onChange={(v) => handleChange("supportEmail", v)} placeholder="support@company.com"  type="email" />
            <FormInput disabled={disabled} label="Support Phone"   value={company.supportPhone} onChange={(v) => handleChange("supportPhone", v)} placeholder="+91 80000 00000"      type="tel" />

            <div className="lg:col-span-1 sm:col-span-2 col-span-1">
              <LogoUpload value={logoUrl} onChange={setLogoUrl} disabled={disabled} />
            </div>

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

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/company-management" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/company-management/${companyId}/edit`} variant="cta-sunset">
                Edit Company
              </ButtonLink>
            </>
          }
        />
      )}

      {!isView && (
        <StickyFooter
          stats={[{ label: "Fields filled", value: `${filledCount} / ${totalFields}` }]}
          actions={
            <>
              <ButtonLink href="/company-management" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-sunset" icon="check">Update Company</Button>
            </>
          }
        />
      )}

    </div>
  );
}
