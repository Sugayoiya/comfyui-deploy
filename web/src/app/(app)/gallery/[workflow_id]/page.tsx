import { findWorkflowById } from "@/server/findFirstTableWithVersion";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Gallery } from "@/components/Gallery";
import { RouteRefresher } from "@/components/RouteRefresher";
import { LoadingWrapper } from "@/components/LoadingWrapper";

export const maxDuration = 300; // 5 minutes

export default async function Page({
  params,
  searchParams,
}: {
  params: { workflow_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const workflow = await findWorkflowById(params.workflow_id);
  if (!workflow) redirect("/workflows");

  const workflow_id = params.workflow_id;

  return (
    <Card className="w-full h-fit min-w-0">
      <CardHeader className="relative">
        <CardTitle>Gallery Download</CardTitle>
        <div className="absolute right-6 top-6">
          <RouteRefresher interval={5000} autoRefresh={false} />
        </div>
      </CardHeader>

      <CardContent>
        <LoadingWrapper tag="gallery">
          <Gallery workflow_id={workflow_id} searchParams={searchParams} />
        </LoadingWrapper>
      </CardContent>
    </Card>
  );
}
