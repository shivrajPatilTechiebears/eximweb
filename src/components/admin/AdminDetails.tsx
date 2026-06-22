"use client";

import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import type { AdminDetailsProps } from "./types";
import {
  ROLE_OPTIONS, ASSIGN_OPTIONS, STATE_OPTIONS, DISTRICT_OPTIONS,
} from "./types";

export function AdminDetails({ formData, onChange, disabled, isView }: AdminDetailsProps) {
  return (
    <Card className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <CardHeader
        title="Admin Details"
        hint={disabled ? undefined : "Tab · Enter to move between fields"}
      />
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <FormInput disabled={disabled} label="First Name"            value={formData.firstName}           onChange={(v) => onChange("firstName", v)}           placeholder="Enter first name" />
        <FormInput disabled={disabled} label="Last Name"             value={formData.lastName}            onChange={(v) => onChange("lastName", v)}            placeholder="Enter last name" />
        <FormInput disabled={disabled} label="Email"                 value={formData.email}               onChange={(v) => onChange("email", v)}               placeholder="name@company.com"    type="email" />
        <FormInput disabled={disabled} label="Password"              value={formData.password}            onChange={(v) => onChange("password", v)}            placeholder="Enter password"       type={isView ? "text" : "password"} />
        <FormInput disabled={disabled} label="Phone Number"          value={formData.phone}               onChange={(v) => onChange("phone", v)}               placeholder="+91 98765 43210"     type="tel" />
        <FormCombobox disabled={disabled} label="Role"               value={formData.role}                onChange={(v) => onChange("role", v)}                options={ROLE_OPTIONS} />
        <FormCombobox disabled={disabled} label="Assign To"          value={formData.assignTo}            onChange={(v) => onChange("assignTo", v)}            options={ASSIGN_OPTIONS} />
        <FormInput disabled={disabled} label="City"                  value={formData.city}                onChange={(v) => onChange("city", v)}                placeholder="Enter city" />
        <FormCombobox disabled={disabled} label="State"              value={formData.state}               onChange={(v) => onChange("state", v)}               options={STATE_OPTIONS} />
        <FormCombobox disabled={disabled} label="District"           value={formData.district}            onChange={(v) => onChange("district", v)}            options={DISTRICT_OPTIONS} />
        <FormInput disabled={disabled} label="Tahsil"                value={formData.tahsil}              onChange={(v) => onChange("tahsil", v)}              placeholder="Enter tahsil" />
        <FormInput disabled={disabled} label="Pincode"               value={formData.pincode}             onChange={(v) => onChange("pincode", v)}             placeholder="Enter pincode" />
        <FormInput disabled={disabled} label="GST No"                value={formData.gstNo}               onChange={(v) => onChange("gstNo", v)}               placeholder="e.g. 27AAPFU0939F1ZV" />
        <FormInput disabled={disabled} label="Aadhaar No"            value={formData.aadhaarNo}           onChange={(v) => onChange("aadhaarNo", v)}           placeholder="12-digit Aadhaar" />
        <FormInput disabled={disabled} label="PAN No"                value={formData.panNo}               onChange={(v) => onChange("panNo", v)}               placeholder="e.g. ABCDE1234F" />
        <FormInput disabled={disabled} label="Bank Beneficiary Name" value={formData.bankBeneficiaryName} onChange={(v) => onChange("bankBeneficiaryName", v)} placeholder="Enter beneficiary name" />
        <FormInput disabled={disabled} label="Bank Name"             value={formData.bankName}            onChange={(v) => onChange("bankName", v)}            placeholder="Enter bank name" />
        <FormInput disabled={disabled} label="Bank Account Number"   value={formData.bankAccountNumber}   onChange={(v) => onChange("bankAccountNumber", v)}   placeholder="Enter account number" />
      </div>
    </Card>
  );
}
