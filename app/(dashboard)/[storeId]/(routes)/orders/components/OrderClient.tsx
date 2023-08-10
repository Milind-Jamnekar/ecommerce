"use client";
import Heading from "@/components/Heading";
import { DataTable } from "@/components/ui/DataTable";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";

interface OrdersProps {
  orders: OrderColumn[];
}
export default function OrdersClient({ orders }: OrdersProps) {
  return (
    <>
      <Heading
        title={`Billboards (${orders.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={orders} />
    </>
  );
}
