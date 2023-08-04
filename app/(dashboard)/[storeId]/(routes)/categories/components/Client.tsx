"use client";
import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";
import { ApiList } from "@/components/ui/ApiList";

interface CategoryClientProps {
  categories: CategoryColumn[];
}
export default function CategoryClient({ categories }: CategoryClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={categories} />
      <Heading title="API" description="Api calls for categories" />
      <ApiList entityIdName="categoriesId" entityName="categories" />
    </>
  );
}
