"use client";

import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import type { OrganisationDetailsProps } from "./types";
import {
  STATUS_OPTIONS, SUBSCRIPTION_PLAN_OPTIONS, CURRENCY_OPTIONS,
  STATE_OPTIONS, COUNTRY_OPTIONS,
} from "./types";

export function OrganisationDetails({ formData, onChange, disabled }: OrganisationDetailsProps) {
  return (
    <>
      {/* ── Organisation Details ── */}
      <Card className="card-glass">
        <CardHeader
          title="Organisation Details"
          hint={disabled ? undefined : "Tab · Enter to move between fields"}
        />
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <FormInput
            disabled={disabled} label="Organisation Name"
            value={formData.organisationName}
            onChange={(v) => onChange("organisationName", v)}
            placeholder="e.g. Techiebears Pvt Ltd"
            autoComplete="off"
          />
<FormInput
            disabled={disabled} label="Email"
            value={formData.email}
            onChange={(v) => onChange("email", v)}
            placeholder="admin@company.com"
            type="email"
            autoComplete="off"
          />
          <FormInput
            disabled={disabled} label="Contact Number"
            value={formData.contact}
            onChange={(v) => onChange("contact", v)}
            placeholder="+91 98765 43210"
            type="tel"
            autoComplete="off"
          />
          <FormCombobox
            disabled={disabled} label="Subscription Plan"
            value={formData.subscriptionPlan}
            onChange={(v) => onChange("subscriptionPlan", v)}
            options={SUBSCRIPTION_PLAN_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Base Currency"
            value={formData.baseCurrency}
            onChange={(v) => onChange("baseCurrency", v)}
            options={CURRENCY_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Status"
            value={formData.status}
            onChange={(v) => onChange("status", v)}
            options={STATUS_OPTIONS}
          />
        </div>
      </Card>

      {/* ── Address ── */}
      <Card className="card-glass">
        <CardHeader title="Address" />
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <FormInput
            disabled={disabled} label="Address Line 1"
            value={formData.addressLine1}
            onChange={(v) => onChange("addressLine1", v)}
            placeholder="Street / Building / Plot"
            autoComplete="off"
          />
          <FormInput
            disabled={disabled} label="Address Line 2"
            value={formData.addressLine2}
            onChange={(v) => onChange("addressLine2", v)}
            placeholder="Area / Locality"
            autoComplete="off"
          />
          <FormInput
            disabled={disabled} label="City"
            value={formData.city}
            onChange={(v) => onChange("city", v)}
            placeholder="Enter city"
            autoComplete="off"
          />
          <FormCombobox
            disabled={disabled} label="State"
            value={formData.state}
            onChange={(v) => onChange("state", v)}
            options={STATE_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Country"
            value={formData.country}
            onChange={(v) => onChange("country", v)}
            options={COUNTRY_OPTIONS}
          />
          <FormInput
            disabled={disabled} label="Pincode"
            value={formData.pincode}
            onChange={(v) => onChange("pincode", v)}
            placeholder="Enter pincode"
            autoComplete="off"
          />
        </div>
      </Card>

      {/* ── Tax & Legal ── */}
      <Card className="card-glass">
        <CardHeader title="Tax & Legal" />
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <FormInput
            disabled={disabled} label="GST Number"
            value={formData.gstNumber}
            onChange={(v) => onChange("gstNumber", v)}
            placeholder="e.g. 27AAPFU0939F1ZV"
            autoComplete="off"
          />
          <FormInput
            disabled={disabled} label="PAN Number"
            value={formData.panNumber}
            onChange={(v) => onChange("panNumber", v)}
            placeholder="e.g. AAPFU0939F"
            autoComplete="off"
          />
        </div>
      </Card>
    </>
  );
}
