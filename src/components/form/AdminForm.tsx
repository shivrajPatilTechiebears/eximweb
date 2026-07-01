"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressPill } from "@/components/ui/ProgressPill";
import { AdminDetails } from "@/components/admin/AdminDetails";
import { CompanyDetails } from "@/components/admin/CompanyDetails";
import { MOCK_ADMINS } from "@/components/admin/types";
import type { AdminFormData, CompanyFormData } from "@/components/admin/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminFormProps = {
  mode: "create" | "view" | "edit";
  adminId?: string;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_FORM: AdminFormData = {
  firstName: "", lastName: "", email: "", password: "",
  phone: "", role: "", assignTo: "", city: "",
  state: "", district: "", tahsil: "", pincode: "",
  gstNo: "", aadhaarNo: "", panNo: "",
  bankBeneficiaryName: "", bankName: "", bankAccountNumber: "",
};

const DEFAULT_COMPANY: CompanyFormData = {
  domain: "", name: "", email: "", phone: "",
  address1: "", address2: "", state: "", country: "",
  theme: "", pincode: "", supportEmail: "", supportPhone: "",
};

// ── AdminForm ─────────────────────────────────────────────────────────────────

export function AdminForm({ mode, adminId }: AdminFormProps) {
  const isView   = mode === "view";
  const isEdit   = mode === "edit";
  const isCreate = mode === "create";
  const disabled = isView;

  const initial = adminId ? (MOCK_ADMINS[adminId] ?? null) : null;

  const [form, setForm]               = useState<AdminFormData>({ ...DEFAULT_FORM, ...initial?.form });
  const [company, setCompany]         = useState<CompanyFormData>({ ...DEFAULT_COMPANY, ...initial?.company });
  const [logoUrl, setLogoUrl]         = useState(initial?.logoUrl ?? "");
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);

  const handleFormChange = (key: keyof AdminFormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleCompanyChange = (key: keyof CompanyFormData, value: string) =>
    setCompany((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(form).length + Object.keys(company).length + 2;
  const filledCount =
    Object.values(form).filter(Boolean).length +
    Object.values(company).filter(Boolean).length +
    (logoUrl ? 1 : 0) +
    permissions.length;

  const steps = [
    {
      label: "Admin Details",
      complete: [form.firstName, form.lastName, form.email, form.phone, form.role,
        form.city, form.aadhaarNo, form.panNo, form.bankName].every(Boolean),
    },
    {
      label: "Company Details",
      complete: [company.domain, company.name, company.email, company.phone,
        company.address1, company.state, company.country, company.pincode].every(Boolean)
        && !!logoUrl && permissions.length > 0,
    },
    { label: "Review & Submit", complete: false },
  ];

  const title     = isCreate ? "Create Admin" : isView ? "View Admin" : "Edit Admin";
  const lastCrumb = isCreate ? "Create" : isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">


      <DashboardPageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard",  href: "/" },
          { label: "Admin Mgmt", href: "/admin-management" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <div className="flex items-center gap-3">
              <StatusBadge label={isCreate ? "New Admin" : "Editing"} color="info" pulse />
              <ProgressPill steps={steps} />
            </div>
          )
        }
      />

      <main className="flex-1 px-6 py-4 pb-20 space-y-3">
        <AdminDetails
          formData={form}
          onChange={handleFormChange}
          disabled={disabled}
          isView={isView}
        />
        {!isEdit && (
          <CompanyDetails
            companyData={company}
            logoUrl={logoUrl}
            permissions={permissions}
            onChange={handleCompanyChange}
            onLogoChange={setLogoUrl}
            onPermissionsChange={setPermissions}
            disabled={disabled}
          />
        )}
      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/admin-management" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/admin-management/${adminId}/edit`} variant="pill-primary">
                Edit Admin
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
              <ButtonLink href="/admin-management" variant="pill-ghost">Cancel</ButtonLink>
              {isCreate && <Button variant="pill-secondary">Save as Draft</Button>}
              <Button variant="pill-primary" icon="check">
                {isCreate ? "Create Admin" : "Update Admin"}
              </Button>
            </>
          }
        />
      )}

    </div>
  );
}
