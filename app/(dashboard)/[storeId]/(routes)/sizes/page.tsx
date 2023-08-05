import prismadb from "@/lib/prismadb";
import { SizesColoumn } from "./components/columns";
import { SizeClient } from "./components/SizeClient";
import moment from "moment";

export default async function SizesPage({
  params,
}: {
  params: { storeId: string };
}) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedSizes: SizesColoumn[] = sizes.map((size) => ({
    name: size.name,
    id: size.id,
    value: size.value,
    createdAt: moment(size.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient sizes={formatedSizes} />
      </div>
    </div>
  );
}
