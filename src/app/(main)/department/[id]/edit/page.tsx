import { DepartmentForm } from "@/components/department/DepartmentForm";

export default async function EditDepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DepartmentForm mode="edit" departmentId={id} />;
}
