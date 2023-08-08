import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/ProductClient";
import { ProductColumn } from "./components/columns";
import moment from "moment";
import { formatPrice } from "@/lib/utils";
import ProductClient from "./components/ProductClient";

export default async function ProductsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatPrice.format(product.price.toNumber()),
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    createdAt: moment(product.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={formatedProducts} />
      </div>
    </div>
  );
}
