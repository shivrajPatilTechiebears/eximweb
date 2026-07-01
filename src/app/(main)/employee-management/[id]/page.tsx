import { EmployeeForm } from "@/components/form/EmployeeForm";

export default async function ViewEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployeeForm mode="view" employeeId={id} />;
}
