"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import type { CompanyDetailsProps } from "./types";
import {
  STATE_OPTIONS, COUNTRY_OPTIONS, THEME_OPTIONS, PERMISSION_OPTIONS,
} from "./types";

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

// ── CompanyDetails ────────────────────────────────────────────────────────────

export function CompanyDetails({
  companyData, logoUrl, permissions, onChange, onLogoChange, onPermissionsChange, disabled,
}: CompanyDetailsProps) {
  return (
    <Card className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <CardHeader
        title="Company Details"
        hint={disabled ? undefined : "Tab · Enter to move between fields"}
      />
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <FormInput disabled={disabled} label="Company Domain"  value={companyData.domain}       onChange={(v) => onChange("domain", v)}       placeholder="e.g. acme.com" />
        <FormInput disabled={disabled} label="Company Name"    value={companyData.name}         onChange={(v) => onChange("name", v)}         placeholder="Enter company name" />
        <FormInput disabled={disabled} label="Company Email"   value={companyData.email}        onChange={(v) => onChange("email", v)}        placeholder="contact@company.com"  type="email" />
        <FormInput disabled={disabled} label="Company Phone"   value={companyData.phone}        onChange={(v) => onChange("phone", v)}        placeholder="+91 98765 43210"      type="tel" />
        <FormInput disabled={disabled} label="Address Line 1"  value={companyData.address1}     onChange={(v) => onChange("address1", v)}     placeholder="Street / Building" />
        <FormInput disabled={disabled} label="Address Line 2"  value={companyData.address2}     onChange={(v) => onChange("address2", v)}     placeholder="Area / Locality" />
        <FormCombobox disabled={disabled} label="State"        value={companyData.state}        onChange={(v) => onChange("state", v)}        options={STATE_OPTIONS} />
        <FormCombobox disabled={disabled} label="Country"      value={companyData.country}      onChange={(v) => onChange("country", v)}      options={COUNTRY_OPTIONS} />
        <FormCombobox disabled={disabled} label="Theme"        value={companyData.theme}        onChange={(v) => onChange("theme", v)}        options={THEME_OPTIONS} />
        <FormInput disabled={disabled} label="Pincode"         value={companyData.pincode}      onChange={(v) => onChange("pincode", v)}      placeholder="Enter pincode" />
        <FormInput disabled={disabled} label="Support Email"   value={companyData.supportEmail} onChange={(v) => onChange("supportEmail", v)} placeholder="support@company.com"  type="email" />
        <FormInput disabled={disabled} label="Support Phone"   value={companyData.supportPhone} onChange={(v) => onChange("supportPhone", v)} placeholder="+91 80000 00000"      type="tel" />

        <div className="lg:col-span-1 sm:col-span-2 col-span-1">
          <LogoUpload value={logoUrl} onChange={onLogoChange} disabled={disabled} />
        </div>

        <div className="lg:col-span-2 sm:col-span-2 col-span-1 flex items-center">
          <CheckboxGroup
            label="Dashboard Permissions"
            options={PERMISSION_OPTIONS}
            value={permissions}
            onChange={onPermissionsChange}
            disabled={disabled}
          />
        </div>
      </div>
    </Card>
  );
}
