"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface BillboardColumn {
  createdAt: string;
  id: string;
  label: string;
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
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
