"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getWorkflowRunOutputsByWorkflowId } from "@/server/getAllWorkflowOutputWithId";
import { PaginationControl } from "./GalleryPaginationControl";
import { parseAsInteger } from "next-usequerystate";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const itemPerPage = 50;
const pageParser = parseAsInteger.withDefault(1);

export function Gallery(props: {
  workflow_id: string;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const page = pageParser.parseServerSide(
    props.searchParams?.g_page ?? undefined
  );

  // console.log(props, page);

  useEffect(() => {
    async function fetchData() {
      const { data, total } = await getWorkflowRunOutputsByWorkflowId({
        workflow_id: props.workflow_id,
        limit: itemPerPage,
        offset: (page - 1) * itemPerPage,
      });
      setData(data);
      setTotal(total);
    }
    fetchData();
  }, [page, props.workflow_id, props.searchParams]);

  // console.log("data: ", data);

  // handleDownload function
  const handleDownload = async (urls: string[]) => {
    const zip = new JSZip();
    const imgFolder = zip.folder("images");
  
    const fetchImage = async (url: string) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }
      const blob = await response.blob();
      const fileName = url.split('/').pop() || 'default_filename';
      if (imgFolder && fileName) {
        imgFolder.file(fileName, blob);
      }
    };
  
    try {
      await Promise.all(urls.map(url => fetchImage(url)));
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "images.zip");
    } catch (error) {
      console.error("Error downloading images:", error);
    }
  };
  
    const handleSelectAll = () => {
      setSelectedImages(data.map((image) => image.id));
    };
  
    const handleDeselectAll = () => {
      setSelectedImages([]);
    };
  
    const handleToggleSelect = (id: number) => {
      setSelectedImages((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((imageId) => imageId !== id)
          : [...prevSelected, id]
      );
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={handleSelectAll}>Select All</Button>
        <Button onClick={handleDeselectAll}>Deselect All</Button>
        <Button
          onClick={() =>
            handleDownload(
              data
                .filter((image) => selectedImages.includes(image.id))
                .map((image) => image.url)
            )
          }
          disabled={selectedImages.length === 0}
        >
          Download Selected
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((image) => (
            <div
              key={image.id}
              className="relative cursor-pointer"
              onClick={() => handleToggleSelect(image.id)}
            >
              <img src={image.url} alt={image.id} className="w-full" />
              <Checkbox
                checked={selectedImages.includes(image.id)}
                onChange={(e) => e.stopPropagation()}
                className="absolute top-2 right-2"
              />
            </div>
          ))}
        </div>
      {Math.ceil(total / itemPerPage) > 0 && (
        <PaginationControl
          totalPage={Math.ceil(total / itemPerPage)}
          currentPage={page}
        />
      )}
    </div>
  );
}