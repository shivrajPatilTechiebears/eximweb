"use client";

import { use } from "react";
import { CompanyManagementForm } from "@/components/company-management/CompanyManagementForm";

export default function ViewCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CompanyManagementForm mode="view" companyId={id} />;
}
