import { UserButton, auth } from "@clerk/nextjs";
import MainNav from "./MainNav";
import { StoreSwitch } from "./StoreSwitch";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div>
      <div className="border-b">
        <div className="h-16 flex items-center px-6 ">
          <div className="">
            <StoreSwitch items={store} />
          </div>
          <div className="">
            <MainNav className="mx-5" />
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
