"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";
import { ApiList } from "@/components/ui/ApiList";

interface BillboardClientProps {
  billboards: BillboardColumn[];
}
export default function BillboardClient({ billboards }: BillboardClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={billboards} />
      <Heading title="API" description="Api calls for billboards" />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  );
}
