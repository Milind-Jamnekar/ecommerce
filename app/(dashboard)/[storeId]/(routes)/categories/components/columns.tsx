"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface CategoryColumn {
  createdAt: string;
  id: string;
  billboardLabel: string;
  name: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Created AT",
  },
  {
    accessorKey: "Actions",
    cell: ({ row }) => <CellAction rowData={row.original} />,
  },
];
