import { ShipmentForm } from "@/components/shipments/ShipmentForm";

export default async function EditShipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentForm mode="edit" shipmentId={id} />;
}
