import { DepartmentForm } from "@/components/form/DepartmentForm";

export default async function ViewDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DepartmentForm mode="view" departmentId={id} />;
}
