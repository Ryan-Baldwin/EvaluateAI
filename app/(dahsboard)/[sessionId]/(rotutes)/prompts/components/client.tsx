"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { PromptColumn, columns } from "./columns";

interface PromptsClientProps {
  data: PromptColumn[];
};

export const PromptsClient: React.FC<PromptsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Prompts (${data.length})`} description="Manage prompts for your session" />
        <Button onClick={() => router.push(`/${params.sessionId}/prompts/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Prompts" />
      <Separator />
      <ApiList entityName="prompts" entityIdName="promptId" />
    </>
  );
};