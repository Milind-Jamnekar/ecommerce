import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/BillboardForm";

export default async function BillboardIdPage({
  params,
}: {
  params: { billboardId: string };
}) {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardForm billboard={billboard} />
        </div>
      </div>
    </>
  );
}
