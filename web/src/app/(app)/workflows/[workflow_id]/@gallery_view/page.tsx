"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // 假设你有一个 Button 组件
import { useRouter } from "next/navigation"; // 使用 next/navigation 进行导航

export default function Page({
  params,
}: {
  params: { workflow_id: string };
}) {
  const workflow_id = params.workflow_id;
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/workflows/${workflow_id}/gallery_download`);
  };

  return (
    <Card className="w-full h-fit min-w-0">
      <CardHeader className="relative">
        <CardTitle>Gallery</CardTitle>
        <Button className="absolute right-0 top-0" onClick={handleNavigation}>
          Go to Gallery
        </Button>
      </CardHeader>
    </Card>
  );
}