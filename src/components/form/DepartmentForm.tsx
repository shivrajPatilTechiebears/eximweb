"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { DepartmentDetails } from "@/components/department/DepartmentDetails";
import { MOCK_DEPARTMENTS } from "@/components/department/types";
import type { DepartmentFormData } from "@/components/department/types";

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
        <DepartmentDetails
          formData={form}
          onChange={handleChange}
          disabled={disabled}
        />
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
