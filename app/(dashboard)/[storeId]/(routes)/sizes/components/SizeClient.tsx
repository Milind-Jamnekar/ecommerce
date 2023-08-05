"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizesColoumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";
import { ApiList } from "@/components/ui/ApiList";

interface SizesProps {
  sizes: SizesColoumn[];
}
export function SizeClient({ sizes }: SizesProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Manage sizes for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={sizes} />
      <Heading title="API" description="Api calls for Sizes" />
      <ApiList entityIdName="sizeId" entityName="sizes" />
    </>
  );
}
