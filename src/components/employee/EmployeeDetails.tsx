"use client";

import { FormInput } from "@/components/ui/FormInput";
import { FormCombobox } from "@/components/ui/FormCombobox";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import type { EmployeeDetailsProps } from "./types";
import {
  USER_TYPE_OPTIONS, ACCESS_SCOPE_OPTIONS, EMPLOYEE_ROLE_OPTIONS,
  DEPARTMENT_OPTIONS, ORGANISATION_OPTIONS, GROUP_COMPANY_OPTIONS,
  COMPANY_OPTIONS, LOCATION_OPTIONS,
} from "./types";

export function EmployeeDetails({ formData, onChange, disabled, isView }: EmployeeDetailsProps) {
  return (
    <>
      {/* ── Organisation Assignment ── */}
      <Card className="card-glass">
        <CardHeader title="Organisation Assignment" />
        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          <FormCombobox
            disabled={disabled} label="Organisation"
            value={formData.organisation}
            onChange={(v) => onChange("organisation", v)}
            options={ORGANISATION_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Group Company"
            value={formData.groupCompany}
            onChange={(v) => onChange("groupCompany", v)}
            options={GROUP_COMPANY_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Company"
            value={formData.company}
            onChange={(v) => onChange("company", v)}
            options={COMPANY_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Location"
            value={formData.location}
            onChange={(v) => onChange("location", v)}
            options={LOCATION_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Department"
            value={formData.department}
            onChange={(v) => onChange("department", v)}
            options={DEPARTMENT_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Role"
            value={formData.role}
            onChange={(v) => onChange("role", v)}
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
            value={formData.firstName}
            onChange={(v) => onChange("firstName", v)}
            placeholder="Enter first name"
          />
          <FormInput
            disabled={disabled} label="Last Name"
            value={formData.lastName}
            onChange={(v) => onChange("lastName", v)}
            placeholder="Enter last name"
          />
          <FormInput
            disabled={disabled} label="Email"
            value={formData.email}
            onChange={(v) => onChange("email", v)}
            placeholder="name@company.com"
            type="email"
            autoComplete="off"
          />
          <FormInput
            disabled={disabled} label="Mobile"
            value={formData.mobile}
            onChange={(v) => onChange("mobile", v)}
            placeholder="+91 98765 43210"
            type="tel"
            autoComplete="off"
          />
          <FormInput
            disabled={disabled} label="Password"
            value={formData.password}
            onChange={(v) => onChange("password", v)}
            placeholder="Enter password"
            type={isView ? "text" : "password"}
            autoComplete="new-password"
          />
          <FormInput
            disabled={disabled} label="Designation"
            value={formData.designation}
            onChange={(v) => onChange("designation", v)}
            placeholder="e.g. Software Engineer"
          />
          <FormCombobox
            disabled={disabled} label="User Type"
            value={formData.userType}
            onChange={(v) => onChange("userType", v)}
            options={USER_TYPE_OPTIONS}
          />
          <FormCombobox
            disabled={disabled} label="Access Scope"
            value={formData.accessScope}
            onChange={(v) => onChange("accessScope", v)}
            options={ACCESS_SCOPE_OPTIONS}
          />
        </div>
      </Card>
    </>
  );
}
