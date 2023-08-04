import prismadb from "@/lib/prismadb";
import CategoryClient from "./components/Client";
import { CategoryColumn } from "./components/columns";
import moment from "moment";

export default async function CategoriesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedCategories: CategoryColumn[] = categories.map((item) => ({
    name: item.name,
    id: item.id,
    billboardLabel: item.billboard.label,
    createdAt: moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient categories={formatedCategories} />
      </div>
    </div>
  );
}
