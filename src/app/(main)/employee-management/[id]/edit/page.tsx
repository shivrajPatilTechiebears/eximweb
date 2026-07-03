import { EmployeeManagementForm } from "@/components/employee-management/EmployeeManagementForm";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployeeManagementForm mode="edit" employeeId={id} />;
}
