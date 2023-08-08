"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

export default function MainNav({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  console.log(pathname);

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname.startsWith(`/${params.storeId}/billboards`),
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname.startsWith(`/${params.storeId}/categories`),
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname.startsWith(`/${params.storeId}/sizes`),
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathname.startsWith(`/${params.storeId}/colors`),
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathname.startsWith(`/${params.storeId}/products`),
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname.startsWith(`/${params.storeId}/settings`),
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map(({ href, active, label }) => (
        <Link
          href={href}
          key={href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            active
              ? "text-black dark:text-white font-semibold"
              : "text-muted-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
