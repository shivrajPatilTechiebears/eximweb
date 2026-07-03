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
import {
  MOCK_EMPLOYEES, USER_TYPE_OPTIONS, ACCESS_SCOPE_OPTIONS, EMPLOYEE_ROLE_OPTIONS,
  DEPARTMENT_OPTIONS, ORGANISATION_OPTIONS, GROUP_COMPANY_OPTIONS,
  COMPANY_OPTIONS, LOCATION_OPTIONS,
} from "./types";
import type { EmployeeFormData } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type EmployeeManagementFormProps = {
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

// ── EmployeeManagementForm ────────────────────────────────────────────────────

export function EmployeeManagementForm({ mode, employeeId }: EmployeeManagementFormProps) {
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

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">

        <div className="flex items-center px-1 pb-2 gap-2">
          <Breadcrumbs items={[
            { label: "Dashboard",          href: "/" },
            { label: "Employee Management", href: "/employee-management" },
            { label: lastCrumb },
          ]} />
          <div className="flex-1" />
          {isView && <StatusBadge label="Read Only" color="warning" />}
        </div>

        {!isView && <ProgressPill steps={steps} />}

        {/* ── Organisation Assignment ── */}
        <Card className="card-glass">
          <CardHeader title="Organisation Assignment" />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
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
            <FormCombobox
              disabled={disabled} label="Company"
              value={form.company}
              onChange={(v) => handleChange("company", v)}
              options={COMPANY_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Location"
              value={form.location}
              onChange={(v) => handleChange("location", v)}
              options={LOCATION_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Department"
              value={form.department}
              onChange={(v) => handleChange("department", v)}
              options={DEPARTMENT_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Role"
              value={form.role}
              onChange={(v) => handleChange("role", v)}
              options={EMPLOYEE_ROLE_OPTIONS}
            />
          </div>
        </Card>

        {/* ── Personal Information ── */}
        <Card className="card-glass">
          <CardHeader
            title="Personal Information"
            hint={disabled ? undefined : "Tab · Enter to move between fields"}
          />
          <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            <FormInput
              disabled={disabled} label="First Name"
              value={form.firstName}
              onChange={(v) => handleChange("firstName", v)}
              placeholder="Enter first name"
            />
            <FormInput
              disabled={disabled} label="Last Name"
              value={form.lastName}
              onChange={(v) => handleChange("lastName", v)}
              placeholder="Enter last name"
            />
            <FormInput
              disabled={disabled} label="Email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              placeholder="name@company.com"
              type="email"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="Mobile"
              value={form.mobile}
              onChange={(v) => handleChange("mobile", v)}
              placeholder="+91 98765 43210"
              type="tel"
              autoComplete="off"
            />
            <FormInput
              disabled={disabled} label="Password"
              value={form.password}
              onChange={(v) => handleChange("password", v)}
              placeholder="Enter password"
              type={isView ? "text" : "password"}
              autoComplete="new-password"
            />
            <FormInput
              disabled={disabled} label="Designation"
              value={form.designation}
              onChange={(v) => handleChange("designation", v)}
              placeholder="e.g. Software Engineer"
            />
            <FormCombobox
              disabled={disabled} label="User Type"
              value={form.userType}
              onChange={(v) => handleChange("userType", v)}
              options={USER_TYPE_OPTIONS}
            />
            <FormCombobox
              disabled={disabled} label="Access Scope"
              value={form.accessScope}
              onChange={(v) => handleChange("accessScope", v)}
              options={ACCESS_SCOPE_OPTIONS}
            />
          </div>
        </Card>

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
