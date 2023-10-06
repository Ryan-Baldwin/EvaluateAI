"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, CriterionColumn } from "./columns";

interface CriterionsClientProps {
  data: CriterionColumn[];
}

export const CriterionClient: React.FC<CriterionsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Criteria (${data.length})`} description="Manage criteria for prompt evaluation" />
        <Button onClick={() => router.push(`/${params.sessionId}/criterion/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Criterions" />
      <Separator />
      <ApiList entityName="criteria" entityIdName="criterionId" />
    </>
  );
};
