"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getWorkflowRunOutputsByWorkflowId } from "@/server/getAllWorkflowOutputWithId";

const ITEMS_PER_PAGE = 10;

export async function Gallery({ workflowId }: { workflowId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
    async function fetchData() {
      const { data, total } = await getWorkflowRunOutputsByWorkflowId(workflowId, currentPage, ITEMS_PER_PAGE);
      console.log("gallery image data: ", data);
      // console.log("gallery total: ", total);
      setImages(data);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
    }
    fetchData();
  }, [workflowId, currentPage]);

  const handleDownload = (urls: string[]) => {
    urls.forEach((url) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || "image.jpg";
      link.click();
    });
  };

  const handleSelectAll = () => {
    setSelectedImages(images.map((image) => image.id));
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
              images
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
        {images.map((image) => (
          <div key={image.id} className="relative">
            <img src={image.url} alt={`Image ${image.id}`} className="w-full" />
            <Checkbox
              checked={selectedImages.includes(image.id)}
              onCheckedChange={() => handleToggleSelect(image.id)}
              className="absolute top-2 right-2"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}