"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// 假数据
const fakeImages = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  url: `https://via.placeholder.com/150?text=Image+${i + 1}`,
}));

const ITEMS_PER_PAGE = 10;

export function Gallery({ workflowId }: { workflowId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const totalPages = Math.ceil(fakeImages.length / ITEMS_PER_PAGE);
  const currentImages = fakeImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDownload = (urls: string[]) => {
    urls.forEach((url) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || "image.jpg";
      link.click();
    });
  };

  const handleSelectAll = () => {
    setSelectedImages(currentImages.map((image) => image.id));
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
              currentImages
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
        {currentImages.map((image) => (
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