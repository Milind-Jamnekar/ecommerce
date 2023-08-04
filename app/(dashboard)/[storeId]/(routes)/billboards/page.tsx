import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/BillboardClient";
import { BillboardColumn } from "./components/columns";
import moment from "moment";

export default async function BillboardPage({
  params,
}: {
  params: { storeId: string };
}) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    label: billboard.label,
    id: billboard.id,
    createdAt: moment(billboard.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={formatedBillboards} />
      </div>
    </div>
  );
}
