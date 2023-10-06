"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type PromptColumn = {
  id: string;
  userMessage: string;
  systemMessage: string;
  responses: string[];
}

export const columns: ColumnDef<PromptColumn>[] = [
  {
    accessorKey: "userMessage",
    header: "User Message",
  },
  {
    accessorKey: "systemMessage",
    header: "System Message",
  },
  {
    accessorKey: "responses",
    header: "Responses",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];

