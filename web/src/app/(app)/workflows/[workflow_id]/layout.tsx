export default async function Layout({
  children,
  deployment,
  runs,
  workflow,
  gallery,
  // gallery_view,
}: {
  children: React.ReactNode;
  deployment: React.ReactNode;
  runs: React.ReactNode;
  workflow: React.ReactNode;
  gallery: React.ReactNode;
  // gallery_view: React.ReactNode;
}) {
  return (
    <div className="mt-4 w-full grid grid-rows-[1fr,1fr] lg:grid-cols-[minmax(auto,500px),1fr] gap-4 max-h-[calc(100dvh-100px)]">
      <div className="w-full flex gap-4 flex-col min-w-0">
        {workflow}
        {deployment}
      </div>
      <div className="flex flex-col gap-4">
        {runs}
        {gallery}
        {/* {gallery_view} */}
      </div>
      {children}
    </div>
  );
}
