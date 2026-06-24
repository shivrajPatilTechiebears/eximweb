"use client";

import { use } from "react";
import { CompanyForm } from "@/components/form/CompanyForm";

export default function ViewCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CompanyForm mode="view" companyId={id} />;
}
