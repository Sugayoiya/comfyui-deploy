import { LoadingWrapper } from "@/components/LoadingWrapper";
import { RouteRefresher } from "@/components/RouteRefresher";
import { Gallery } from "@/components/Gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  params,
  searchParams,
}: {
  params: { workflow_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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