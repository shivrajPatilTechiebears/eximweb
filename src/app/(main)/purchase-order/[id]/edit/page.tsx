import { PurchaseOrderForm } from "@/components/purchase-order/PurchaseOrderForm";

export default async function EditPurchaseOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PurchaseOrderForm mode="edit" orderId={id} />;
}
