"use client";

import { useState } from "react";
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
import {
  MOCK_ORGANISATIONS, STATUS_OPTIONS, SUBSCRIPTION_PLAN_OPTIONS,
  CURRENCY_OPTIONS, STATE_OPTIONS, COUNTRY_OPTIONS,
} from "./types";
import type { OrganisationFormData } from "./types";

export type OrganisationFormProps = {
  mode: "create" | "view" | "edit";
  organisationId?: string;
};

const DEFAULT_FORM: OrganisationFormData = {
  organisationName: "",
  email: "", contact: "",
  addressLine1: "", addressLine2: "", city: "", state: "", country: "", pincode: "",
  gstNumber: "", panNumber: "",
  subscriptionPlan: "", baseCurrency: "", status: "",
};

export function OrganisationForm({ mode, organisationId }: OrganisationFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = organisationId ? (MOCK_ORGANISATIONS[organisationId] ?? null) : null;
  const [form, setForm] = useState<OrganisationFormData>({ ...DEFAULT_FORM, ...initial?.form });

  const handleChange = (key: keyof OrganisationFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(form).length;
  const filledCount = Object.values(form).filter(Boolean).length;

  const steps = [
    {
      label: "Org Details",
      complete: [
        form.organisationName,
        form.email, form.contact,
        form.subscriptionPlan, form.baseCurrency, form.status,
      ].every(Boolean),
    },
    {
      label: "Address",
      complete: [
        form.addressLine1, form.city, form.state, form.country, form.pincode,
      ].every(Boolean),
    },
    {
      label: "Tax & Legal",
      complete: [form.gstNumber, form.panNumber].every(Boolean),
    },
  ];

  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <DashboardPageHeader
        breadcrumbs={[
          { label: "Dashboard",    href: "/" },
          { label: "Organisation", href: "/organisation" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <StatusBadge label={isCreate ? "New Organisation" : "Editing"} color="info" pulse />
          )
        }
      />

      {!isView && <ProgressPill steps={steps} />}

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        {/* ── Organisation Details ── */}
        <Card className="card-glass">
          <CardHeader
            title="Organisation Details"
            hint={disabled ? undefined : "Tab · Enter to move between fields"}
          />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormInput
              disabled={disabled} label="Organisation Name"
              value={form.organisationName}
              onChange={(v) => handleChange("organisationName", v)}
              placeholder="e.g. Techiebears Pvt Ltd"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="Email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              placeholder="admin@company.com"
              type="email"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="Contact Number"
              value={form.contact}
              onChange={(v) => handleChange("contact", v)}
              placeholder="+91 98765 43210"
              type="tel"
              autoComplete="off"
            />
            <FormCombobox
              disabled={disabled} label="Subscription Plan"
              value={form.subscriptionPlan}
              onChange={(v) => handleChange("subscriptionPlan", v)}
              options={SUBSCRIPTION_PLAN_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Base Currency"
              value={form.baseCurrency}
              onChange={(v) => handleChange("baseCurrency", v)}
              options={CURRENCY_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Status"
              value={form.status}
              onChange={(v) => handleChange("status", v)}
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
              value={form.addressLine1}
              onChange={(v) => handleChange("addressLine1", v)}
              placeholder="Street / Building / Plot"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="Address Line 2"
              value={form.addressLine2}
              onChange={(v) => handleChange("addressLine2", v)}
              placeholder="Area / Locality"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="City"
              value={form.city}
              onChange={(v) => handleChange("city", v)}
              placeholder="Enter city"
              autoComplete="off"
            />
            <FormCombobox
              disabled={disabled} label="State"
              value={form.state}
              onChange={(v) => handleChange("state", v)}
              options={STATE_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Country"
              value={form.country}
              onChange={(v) => handleChange("country", v)}
              options={COUNTRY_OPTIONS}
            />
            <FormInput
              disabled={disabled} label="Pincode"
              value={form.pincode}
              onChange={(v) => handleChange("pincode", v)}
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
              value={form.gstNumber}
              onChange={(v) => handleChange("gstNumber", v)}
              placeholder="e.g. 27AAPFU0939F1ZV"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="PAN Number"
              value={form.panNumber}
              onChange={(v) => handleChange("panNumber", v)}
              placeholder="e.g. AAPFU0939F"
              autoComplete="off"
            />
          </div>
        </Card>

      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/organisation" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/organisation/${organisationId}/edit`} variant="cta-sunset">
                Edit Organisation
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
              <ButtonLink href="/organisation" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-sunset" icon="check">
                {isCreate ? "Create Organisation" : "Update Organisation"}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
