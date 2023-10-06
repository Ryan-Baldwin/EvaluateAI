import prismadb from "@/lib/prismadb";

import { CriterionForm } from "./components/criterion-form";

const CriterionPage = async ({
  params
}: {
  params: { criterionId: string }
}) => {
  const criterion = await prismadb.criterion.findUnique({
    where: {
      id: params.criterionId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CriterionForm initialData={criterion} />
      </div>
    </div>
  );
}

export default CriterionPage;
