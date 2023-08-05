"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface SizesColoumn {
  createdAt: string;
  id: string;
  name: string;
  value: string;
}

export const columns: ColumnDef<SizesColoumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "created",
  },
  {
    accessorKey: "Actions",
    cell: ({ row }) => <CellAction rowData={row.original} />,
  },
];
