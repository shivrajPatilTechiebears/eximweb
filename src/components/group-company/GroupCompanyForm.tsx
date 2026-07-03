"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { MOCK_GROUP_COMPANIES, STATUS_OPTIONS, ORGANISATION_OPTIONS } from "./types";
import type { GroupCompanyFormData } from "./types";

export type GroupCompanyFormProps = {
  mode: "create" | "view" | "edit";
  groupCompanyId?: string;
};

const DEFAULT_FORM: GroupCompanyFormData = {
  groupCompanyName: "",
  organisation: "",
  email: "",
  contact: "",
  city: "",
  description: "",
  status: "",
};

export function GroupCompanyForm({ mode, groupCompanyId }: GroupCompanyFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = groupCompanyId ? (MOCK_GROUP_COMPANIES[groupCompanyId] ?? null) : null;
  const [form, setForm] = useState<GroupCompanyFormData>({ ...DEFAULT_FORM, ...initial?.form });

  const handleChange = (key: keyof GroupCompanyFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(form).length;
  const filledCount = Object.values(form).filter(Boolean).length;

  const steps = [
    {
      label: "Group Details",
      complete: [
        form.groupCompanyName,
        form.organisation,
        form.status,
      ].every(Boolean),
    },
  ];

  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        <div className="flex items-center px-1 pb-2 gap-2">
          <Breadcrumbs items={[
            { label: "Dashboard",       href: "/" },
            { label: "Group of Company", href: "/group-company" },
            { label: lastCrumb },
          ]} />
          <div className="flex-1" />
          {isView && <StatusBadge label="Read Only" color="warning" />}
        </div>

        {!isView && <ProgressPill steps={steps} />}

        {/* ── Group Company Details ── */}
        <Card className="card-glass">
          <CardHeader
            title="Group Company Details"
            hint={disabled ? undefined : "Tab · Enter to move between fields"}
          />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormInput
              disabled={disabled} label="Group Company Name"
              value={form.groupCompanyName}
              onChange={(v) => handleChange("groupCompanyName", v)}
              placeholder="e.g. Group Alpha"
              autoComplete="off"
            />
            <FormCombobox
              disabled={disabled} label="Organisation"
              value={form.organisation}
              onChange={(v) => handleChange("organisation", v)}
              options={ORGANISATION_OPTIONS}
            />
            <FormInput
              disabled={disabled} label="Email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              placeholder="e.g. group@company.com"
              type="email"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="Contact"
              value={form.contact}
              onChange={(v) => handleChange("contact", v)}
              placeholder="e.g. +91 98000 00000"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="City"
              value={form.city}
              onChange={(v) => handleChange("city", v)}
              placeholder="e.g. Mumbai"
              autoComplete="off"
            />
            <FormCombobox
              disabled={disabled} label="Status"
              value={form.status}
              onChange={(v) => handleChange("status", v)}
              options={STATUS_OPTIONS}
            />
            <div className="lg:col-span-2">
              <FormInput
                disabled={disabled} label="Description"
                value={form.description}
                onChange={(v) => handleChange("description", v)}
                placeholder="Brief description of this group company"
                autoComplete="off"
              />
            </div>
          </div>
        </Card>

      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/group-company" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/group-company/${groupCompanyId}/edit`} variant="cta-sunset">
                Edit Group Company
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
              <ButtonLink href="/group-company" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-sunset" icon="check">
                {isCreate ? "Create Group Company" : "Update Group Company"}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
