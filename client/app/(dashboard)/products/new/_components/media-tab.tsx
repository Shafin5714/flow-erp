"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";

export interface MediaTabRef {
  uploadImages: () => Promise<{
    mainImage: string | null;
    supportingImages: string[];
  }>;
}

export const MediaTab = forwardRef<MediaTabRef>(function MediaTab(_props, ref) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [supportingImageFiles, setSupportingImageFiles] = useState<File[]>([]);
  const [supportingImagePreviews, setSupportingImagePreviews] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    uploadImages: async () => {
      if (!mainImageFile && supportingImageFiles.length === 0)
        return { mainImage: null, supportingImages: [] };

      const formData = new FormData();
      if (mainImageFile) formData.append("mainImage", mainImageFile);
      supportingImageFiles.forEach((file) => formData.append("supportingImages", file));

      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload images");
      const data = await res.json();

      const uploadedUrls: string[] = data.images.map((img: { url: string }) => img.url);
      const mainImageUrl = mainImageFile ? uploadedUrls[0] : null;
      const supportingImageUrls = mainImageFile ? uploadedUrls.slice(1) : uploadedUrls;

      return { mainImage: mainImageUrl, supportingImages: supportingImageUrls };
    },
  }));

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-primary" />
            Product Images
          </CardTitle>
          <CardDescription>Upload a main image and supporting images.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <FormLabel>Main Image</FormLabel>
            <div className="mt-2 flex items-center gap-4">
              {mainImagePreview ? (
                <div className="relative h-24 w-24 rounded-md border overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainImagePreview}
                    alt="Main Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImageFile(null);
                      setMainImagePreview(null);
                    }}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 shadow-sm hover:bg-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-md border border-dashed flex items-center justify-center bg-muted/50">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                className="flex-1"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setMainImageFile(file);
                    setMainImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          <div>
            <FormLabel>Supporting Images</FormLabel>
            <div className="mt-2 space-y-4">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSupportingImageFiles((prev) => [...prev, ...files]);
                  const newPreviews = files.map((f) => URL.createObjectURL(f));
                  setSupportingImagePreviews((prev) => [...prev, ...newPreviews]);
                }}
              />
              {supportingImagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {supportingImagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative h-20 w-20 rounded-md border overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSupportingImageFiles((prev) => prev.filter((_, i) => i !== index));
                          setSupportingImagePreviews((prev) => prev.filter((_, i) => i !== index));
                          URL.revokeObjectURL(preview);
                        }}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-1 shadow-sm hover:bg-background"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
