import { GroupCompanyForm } from "@/components/group-company/GroupCompanyForm";

export default async function EditGroupCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GroupCompanyForm mode="edit" groupCompanyId={id} />;
}
