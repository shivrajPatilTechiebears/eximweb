import { CompanyForm } from "@/components/form/CompanyForm";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyForm mode="edit" companyId={id} />;
}
