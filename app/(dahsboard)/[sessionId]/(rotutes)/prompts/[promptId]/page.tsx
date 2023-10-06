import prismadb from "@/lib/prismadb";

import { PromptForm } from "./components/prompt-form";

const PromptPage = async ({
  params
}: {
  params: { promptId: string, sessionId: string}
}) => {
  const prompt = await prismadb.prompt.findUnique({
    where: {
      id: params.promptId,
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PromptForm 
          initialData={prompt}
        />
      </div>
    </div>
  );
}

export default PromptPage;
