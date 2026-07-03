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
import { MOCK_DEPARTMENTS, STATUS_OPTIONS, ORGANISATION_OPTIONS, GROUP_COMPANY_OPTIONS } from "./types";
import type { DepartmentFormData } from "./types";

export type DepartmentFormProps = {
  mode: "create" | "view" | "edit";
  departmentId?: string;
};

const DEFAULT_FORM: DepartmentFormData = {
  departmentName: "",
  organisation: "",
  groupCompany: "",
  email: "",
  contact: "",
  city: "",
  status: "",
};

export function DepartmentForm({ mode, departmentId }: DepartmentFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = departmentId ? (MOCK_DEPARTMENTS[departmentId] ?? null) : null;
  const [form, setForm] = useState<DepartmentFormData>({ ...DEFAULT_FORM, ...initial?.form });

  const handleChange = (key: keyof DepartmentFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(form).length;
  const filledCount = Object.values(form).filter(Boolean).length;

  const steps = [
    {
      label: "Department Details",
      complete: [
        form.departmentName,
        form.organisation,
        form.status,
      ].every(Boolean),
    },
  ];

  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <DashboardPageHeader
        breadcrumbs={[
          { label: "Dashboard",  href: "/" },
          { label: "Department", href: "/department" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <StatusBadge label={isCreate ? "New Department" : "Editing"} color="info" pulse />
          )
        }
      />

      {!isView && <ProgressPill steps={steps} />}

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        {/* ── Department Details ── */}
        <Card className="card-glass">
          <CardHeader
            title="Department Details"
            hint={disabled ? undefined : "Tab · Enter to move between fields"}
          />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormInput
              disabled={disabled} label="Department Name"
              value={form.departmentName}
              onChange={(v) => handleChange("departmentName", v)}
              placeholder="e.g. Engineering"
              autoComplete="off"
            />
            <FormCombobox
              disabled={disabled} label="Organisation"
              value={form.organisation}
              onChange={(v) => handleChange("organisation", v)}
              options={ORGANISATION_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Group Company"
              value={form.groupCompany}
              onChange={(v) => handleChange("groupCompany", v)}
              options={GROUP_COMPANY_OPTIONS}
            />
            <FormInput
              disabled={disabled} label="Email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              placeholder="e.g. dept@company.com"
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
          </div>
        </Card>

      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/department" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/department/${departmentId}/edit`} variant="cta-sunset">
                Edit Department
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
              <ButtonLink href="/department" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-sunset" icon="check">
                {isCreate ? "Create Department" : "Update Department"}
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
