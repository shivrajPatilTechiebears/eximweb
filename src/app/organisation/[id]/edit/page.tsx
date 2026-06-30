import { OrganisationForm } from "@/components/form/OrganisationForm";

export default async function EditOrganisationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganisationForm mode="edit" organisationId={id} />;
}
