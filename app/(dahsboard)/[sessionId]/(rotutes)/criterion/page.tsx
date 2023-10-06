import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { CriterionColumn } from "./components/columns"
import { CriterionClient } from "./components/client";

const CriterionsPage = async ({
  params
}: {
  params: { sessionId: string }
}) => {
  const criteria = await prismadb.criterion.findMany({
    where: {
      sessionId: params.sessionId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCriterions: CriterionColumn[] = criteria.map((item) => ({
    id: item.id,
    name: item.name,
    instructions: item.instructions,
    patterns: item.patterns,
    examples: item.examples,
    score: item.score,

    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CriterionClient data={formattedCriterions} />
      </div>
    </div>
  );
};

export default CriterionsPage;
