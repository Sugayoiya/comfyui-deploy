"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoadingWrapper } from "@/components/LoadingWrapper";
import { Gallery } from "@/components/Gallery";
import { RouteRefresher } from "@/components/RouteRefresher";


export default function Page({
  params,
  searchParams,
}: {
  params: { workflow_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const workflow_id = params.workflow_id;

  const handleNavigation = () => {
    window.location.href = `/gallery/${workflow_id}`;
  };

  return (
    <Card className="w-full h-fit min-w-0">
      <CardHeader className="relative">
        <CardTitle>Gallery</CardTitle>
        <div className="absolute right-6 top-6">
          <RouteRefresher interval={5000} autoRefresh={true} />
        </div>
      </CardHeader>

      <CardContent>
        <LoadingWrapper tag="gallery">
          <Gallery workflow_id={workflow_id} searchParams={searchParams}/>
        </LoadingWrapper>
      </CardContent>
    </Card>
  );
}