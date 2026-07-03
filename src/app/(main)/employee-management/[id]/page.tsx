import { EmployeeManagementForm } from "@/components/employee-management/EmployeeManagementForm";

export default async function ViewEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployeeManagementForm mode="view" employeeId={id} />;
}
