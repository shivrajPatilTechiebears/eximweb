import { GroupCompanyForm } from "@/components/form/GroupCompanyForm";

export default async function EditGroupCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GroupCompanyForm mode="edit" groupCompanyId={id} />;
}
