"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { EmployeeDetails } from "@/components/employee/EmployeeDetails";
import { MOCK_EMPLOYEES } from "@/components/employee/types";
import type { EmployeeFormData } from "@/components/employee/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type EmployeeFormProps = {
  mode: "create" | "view" | "edit";
  employeeId?: string;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_FORM: EmployeeFormData = {
  firstName: "", lastName: "",
  email: "", mobile: "", password: "",
  designation: "", userType: "", accessScope: "",
  role: "", department: "",
  organisation: "", groupCompany: "", company: "", location: "",
};

// ── EmployeeForm ──────────────────────────────────────────────────────────────

export function EmployeeForm({ mode, employeeId }: EmployeeFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = employeeId ? (MOCK_EMPLOYEES[employeeId] ?? null) : null;

  const [form, setForm] = useState<EmployeeFormData>({ ...DEFAULT_FORM, ...initial?.form });

  const handleChange = (key: keyof EmployeeFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(form).length;
  const filledCount = Object.values(form).filter(Boolean).length;

  const steps = [
    {
      label: "Personal Info",
      complete: [
        form.firstName, form.lastName,
        form.email, form.mobile, form.designation,
        form.userType, form.accessScope,
      ].every(Boolean),
    },
    {
      label: "Organisation",
      complete: [
        form.organisation, form.company,
        form.department, form.role,
      ].every(Boolean),
    },
    { label: "Review & Submit", complete: false },
  ];

  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">


      <DashboardPageHeader
        breadcrumbs={[
          { label: "Dashboard",    href: "/" },
          { label: "Employee Mgmt", href: "/employee-management" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <StatusBadge label={isCreate ? "New Employee" : "Editing"} color="info" pulse />
          )
        }
      />

      {!isView && <ProgressPill steps={steps} />}

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">
        <EmployeeDetails
          formData={form}
          onChange={handleChange}
          disabled={disabled}
          isView={isView}
        />
      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/employee-management" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/employee-management/${employeeId}/edit`} variant="cta-sunset">
                Edit Employee
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
              <ButtonLink href="/employee-management" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-sunset" icon="check">
                {isCreate ? "Create Employee" : "Update Employee"}
              </Button>
            </>
          }
        />
      )}

    </div>
  );
}
