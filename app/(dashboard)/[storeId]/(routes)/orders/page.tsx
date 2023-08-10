import prismadb from "@/lib/prismadb";
import { formatPrice } from "@/lib/utils";
import moment from "moment";
import OrdersClient from "./components/OrderClient";
import { OrderColumn } from "./components/columns";

export default async function BillboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItem.map((orderItem) => orderItem.product.name),
    totalPrice: formatPrice.format(
      item.orderItem.reduce((total, item) => {
        return (total = Number(item.product.price));
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient orders={formatedOrders} />
      </div>
    </div>
  );
}
