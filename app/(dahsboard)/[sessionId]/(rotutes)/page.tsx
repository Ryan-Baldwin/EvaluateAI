
import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";


interface DashboardPageProps {
  params: {
    sessionId: string;
  };
};

const DashboardPage: React.FC<DashboardPageProps> = async ({ 
  params
}) => {


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your session" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Prompts 
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Prompt Samples</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respones</CardTitle>
            
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Response Examples</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluations</CardTitle>
            
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Extraction Criteria</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            Statistical Analysis
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;