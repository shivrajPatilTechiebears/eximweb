import { OrganisationForm } from "@/components/form/OrganisationForm";

export default async function ViewOrganisationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganisationForm mode="view" organisationId={id} />;
}
