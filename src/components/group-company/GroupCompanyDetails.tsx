"use client";

import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import type { GroupCompanyDetailsProps } from "./types";
import { STATUS_OPTIONS, ORGANISATION_OPTIONS } from "./types";

export function GroupCompanyDetails({ formData, onChange, disabled }: GroupCompanyDetailsProps) {
  return (
    <Card className="card-glass">
      <CardHeader
        title="Group Company Details"
        hint={disabled ? undefined : "Tab · Enter to move between fields"}
      />
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        <FormInput
          disabled={disabled} label="Group Company Name"
          value={formData.groupCompanyName}
          onChange={(v) => onChange("groupCompanyName", v)}
          placeholder="e.g. Group Alpha"
          autoComplete="off"
        />
<FormCombobox
          disabled={disabled} label="Organisation"
          value={formData.organisation}
          onChange={(v) => onChange("organisation", v)}
          options={ORGANISATION_OPTIONS}
        />
        <FormInput
          disabled={disabled} label="Email"
          value={formData.email}
          onChange={(v) => onChange("email", v)}
          placeholder="e.g. group@company.com"
          type="email"
          autoComplete="off"
        />
        <FormInput
          disabled={disabled} label="Contact"
          value={formData.contact}
          onChange={(v) => onChange("contact", v)}
          placeholder="e.g. +91 98000 00000"
          autoComplete="off"
        />
        <FormInput
          disabled={disabled} label="City"
          value={formData.city}
          onChange={(v) => onChange("city", v)}
          placeholder="e.g. Mumbai"
          autoComplete="off"
        />
        <FormCombobox
          disabled={disabled} label="Status"
          value={formData.status}
          onChange={(v) => onChange("status", v)}
          options={STATUS_OPTIONS}
        />
        <div className="lg:col-span-2">
          <FormInput
            disabled={disabled} label="Description"
            value={formData.description}
            onChange={(v) => onChange("description", v)}
            placeholder="Brief description of this group company"
            autoComplete="off"
          />
        </div>
      </div>
    </Card>
  );
}
