import { GroupCompanyForm } from "@/components/form/GroupCompanyForm";

export default async function ViewGroupCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <GroupCompanyForm mode="view" groupCompanyId={id} />;
}
