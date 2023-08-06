import prismadb from "@/lib/prismadb";
import moment from "moment";
import ColorClient from "./components/ColorClient";
import { ColorColumn } from "./components/columns";

export default async function ColorsPage({
  params,
}: {
  params: { storeId: string };
}) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedColors: ColorColumn[] = colors.map((color) => ({
    name: color.name,
    value: color.value,
    id: color.id,
    createdAt: moment(color.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient colors={formatedColors} />
      </div>
    </div>
  );
}
