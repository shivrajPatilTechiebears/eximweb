"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { OrganisationDetails } from "@/components/organisation/OrganisationDetails";
import { MOCK_ORGANISATIONS } from "@/components/organisation/types";
import type { OrganisationFormData } from "@/components/organisation/types";

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

  const title     = isCreate ? "Create Organisation" : isView ? "View Organisation" : "Edit Organisation";
  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <DashboardPageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard",    href: "/" },
          { label: "Organisation", href: "/organisation" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <div className="flex items-center gap-3">
              <StatusBadge label={isCreate ? "New Organisation" : "Editing"} color="info" pulse />
              <ProgressPill steps={steps} />
            </div>
          )
        }
      />

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">
        <OrganisationDetails
          formData={form}
          onChange={handleChange}
          disabled={disabled}
        />
      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/organisation" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/organisation/${organisationId}/edit`} variant="pill-primary">
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
              <ButtonLink href="/organisation" variant="pill-ghost">Cancel</ButtonLink>
              <Button variant="pill-primary" icon="check">
                {isCreate ? "Create Organisation" : "Update Organisation"}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
