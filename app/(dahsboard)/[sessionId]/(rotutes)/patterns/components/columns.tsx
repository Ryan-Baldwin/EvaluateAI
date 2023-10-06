"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type CriterionColumn = {
  id: string
  name: string;
  instructions: string;
  patterns: string;
  examples: string;
  score: number; 
  createdAt: string;
}

export const columns: ColumnDef<CriterionColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "instructions",
    header: "instructions",
  },
  {
    accessorKey: "patterns",
    header: "Patterns",
  },
  {
    accessorKey: "examples",
    header: "Examples",
  },
  {
    accessorKey: "score",
    header: "Score",
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
