import { CompanyManagementForm } from "@/components/company-management/CompanyManagementForm";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyManagementForm mode="edit" companyId={id} />;
}
