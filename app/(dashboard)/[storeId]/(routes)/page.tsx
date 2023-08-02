import prismadb from "@/lib/prismadb";
import { FC } from "react";

interface pageProps {
  params: { storeId: string };
}

const page: FC<pageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  return <div>Store name is {store?.name}</div>;
};

export default page;
