"use client";

import { useState } from "react";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CompanyDetails } from "@/components/admin/CompanyDetails";
import type { CompanyFormData } from "@/components/admin/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CompanyFormProps = {
  mode: "view" | "edit";
  companyId?: string;
};

// ── Mock data keyed by COMP-xxx ───────────────────────────────────────────────

const MOCK_COMPANIES: Record<string, {
  company: Partial<CompanyFormData>;
  logoUrl: string;
  permissions: string[];
}> = {
  "COMP-001": {
    company: { domain: "techcorp.com", name: "TechCorp Solutions", email: "admin@techcorp.com", phone: "+91 98765 43210", address1: "101, Tech Park, Andheri East", address2: "Mumbai Suburban", state: "MH", country: "IN", theme: "purple", pincode: "400093", supportEmail: "support@techcorp.com", supportPhone: "+91 80000 11111" },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt", "reports_access"],
  },
  "COMP-002": {
    company: { domain: "innosoft.in", name: "InnoSoft Pvt Ltd", email: "contact@innosoft.in", phone: "+91 91234 56789", address1: "42, IT Hub, Kothrud", address2: "Pune City", state: "MH", country: "IN", theme: "blue", pincode: "411038", supportEmail: "support@innosoft.in", supportPhone: "+91 80000 22222" },
    logoUrl: "", permissions: ["employee_mgmt", "reports_access"],
  },
  "COMP-003": {
    company: { domain: "globaledge.io", name: "GlobalEdge Inc", email: "info@globaledge.io", phone: "+1 555 234 5678", address1: "5th Floor, Commerce House", address2: "C.G. Road, Navrangpura", state: "GJ", country: "US", theme: "green", pincode: "380009", supportEmail: "support@globaledge.io", supportPhone: "+1 800 123 4567" },
    logoUrl: "", permissions: ["api_mgmt"],
  },
  "COMP-004": {
    company: { domain: "apexsys.com", name: "Apex Systems", email: "hello@apexsys.com", phone: "+91 88776 65544", address1: "Plot 22, GIDC Estate", address2: "Sachin, Surat", state: "GJ", country: "IN", theme: "red", pincode: "394230", supportEmail: "support@apexsys.com", supportPhone: "+91 80000 33333" },
    logoUrl: "", permissions: [],
  },
  "COMP-005": {
    company: { domain: "bluestar.net", name: "BlueStar Logistics", email: "ops@bluestar.net", phone: "+91 77665 54433", address1: "Unit 8, Okhla Industrial Area", address2: "Phase II, New Delhi", state: "DL", country: "IN", theme: "blue", pincode: "110020", supportEmail: "support@bluestar.net", supportPhone: "+91 80000 44444" },
    logoUrl: "", permissions: ["partner_mgmt", "reports_access"],
  },
  "COMP-006": {
    company: { domain: "nexusdigital.co", name: "Nexus Digital", email: "nexus@nexusdigital.co", phone: "+91 99001 12233", address1: "12, Koramangala 4th Block", address2: "Bengaluru Urban", state: "KA", country: "IN", theme: "purple", pincode: "560034", supportEmail: "support@nexusdigital.co", supportPhone: "+91 80000 55555" },
    logoUrl: "", permissions: ["partner_mgmt", "api_mgmt", "employee_mgmt"],
  },
};

const DEFAULT_COMPANY: CompanyFormData = {
  domain: "", name: "", email: "", phone: "",
  address1: "", address2: "", state: "", country: "",
  theme: "", pincode: "", supportEmail: "", supportPhone: "",
};

// ── CompanyForm ───────────────────────────────────────────────────────────────

export function CompanyForm({ mode, companyId }: CompanyFormProps) {
  const isView = mode === "view";
  const disabled = isView;

  const initial = companyId ? (MOCK_COMPANIES[companyId] ?? null) : null;

  const [company, setCompany]         = useState<CompanyFormData>({ ...DEFAULT_COMPANY, ...initial?.company });
  const [logoUrl, setLogoUrl]         = useState(initial?.logoUrl ?? "");
  const [permissions, setPermissions] = useState<string[]>(initial?.permissions ?? []);

  const handleChange = (key: keyof CompanyFormData, value: string) =>
    setCompany((p) => ({ ...p, [key]: value }));

  const totalFields = Object.keys(company).length + 2;
  const filledCount =
    Object.values(company).filter(Boolean).length +
    (logoUrl ? 1 : 0) +
    permissions.length;

  const lastCrumb = isView ? "View" : "Edit";

  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">


      <DashboardPageHeader
        breadcrumbs={[
          { label: "Dashboard",          href: "/" },
          { label: "Company Mgmt",       href: "/company-management" },
          { label: lastCrumb },
        ]}
        rightContent={
          isView ? (
            <StatusBadge label="Read Only" color="warning" />
          ) : (
            <StatusBadge label="Editing" color="info" pulse />
          )
        }
      />

      <main className="flex-1 px-6 py-4 pb-20">
        <CompanyDetails
          companyData={company}
          logoUrl={logoUrl}
          permissions={permissions}
          onChange={handleChange}
          onLogoChange={setLogoUrl}
          onPermissionsChange={setPermissions}
          disabled={disabled}
        />
      </main>

      {isView && (
        <StickyFooter
          actions={
            <>
              <ButtonLink href="/company-management" variant="pill-ghost">Back</ButtonLink>
              <ButtonLink href={`/company-management/${companyId}/edit`} variant="cta-sunset">
                Edit Company
              </ButtonLink>
            </>
          }
        />
      )}

      {!isView && (
        <StickyFooter
          stats={[{ label: "Fields filled", value: `${filledCount} / ${totalFields}` }]}
          actions={
            <>
              <ButtonLink href="/company-management" variant="cta-ghost">Cancel</ButtonLink>
              <Button variant="cta-sunset" icon="check">Update Company</Button>
            </>
          }
        />
      )}

    </div>
  );
}
