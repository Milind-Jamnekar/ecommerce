"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";
import { ApiList } from "@/components/ui/ApiList";

interface BillboardClientProps {
  products: ProductColumn[];
}
export default function ProductClient({ products }: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage billboards for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={products} />
      <Heading title="API" description="Api calls for Products" />
      <ApiList entityIdName="productId" entityName="products" />
    </>
  );
}
