import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import { PromptsClient } from "./components/client";
import { PromptColumn } from "./components/columns";


const PromptsPage = async ({
  params
}: {
  params: { sessionId: string }
}) => {
  const prompts = await prismadb.prompt.findMany({
    where: {
      sessionId: params.sessionId
    },
    include: {
      responses: true
    },
    orderBy: {
      createdAt: "desc"
    }     
  });

  // Formatting the prompts
  const formattedPrompts: PromptColumn[] = prompts.map((item) => ({
    id: item.id,
    userMessage: item.userMessage,
    systemMessage: item.systemMessage,
    responses: item.responses.map(response => response.content), // Necessary b/c the reponse array includes all the parameters e.g. temp

    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PromptsClient data={formattedPrompts} />
      </div>
    </div>
  );
};

export default PromptsPage;