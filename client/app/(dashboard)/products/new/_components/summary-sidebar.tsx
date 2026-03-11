"use client";

import { Control, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductFormValues } from "./product-schema";

interface SummarySidebarProps {
  control: Control<ProductFormValues>;
  submitting: boolean;
  uploadingImages: boolean;
}

function SummaryFields({ control }: { control: Control<ProductFormValues> }) {
  const formValues = useWatch({ control }) as Partial<ProductFormValues>;
  const watchedName = formValues?.name;
  const watchedCostPrice = Number(formValues?.costPrice) || 0;
  const watchedSalePrice = Number(formValues?.salePrice) || 0;
  const watchedIsActive = formValues?.isActive;
  const watchedHasVariants = formValues?.hasVariants;
  const watchedVariants = formValues?.variants;

  const profit = watchedSalePrice - watchedCostPrice;
  const margin = watchedSalePrice > 0 ? (profit / watchedSalePrice) * 100 : 0;

  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Product</span>
        <span className="font-medium text-right max-w-[150px] truncate">
          {watchedName || "Untitled"}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Status</span>
        <span
          className={cn("font-medium", watchedIsActive ? "text-emerald-600" : "text-amber-600")}
        >
          {watchedIsActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="flex justify-between text-sm border-t pt-2 border-zinc-200 dark:border-zinc-800">
        <span className="text-muted-foreground">Profit/Unit</span>
        <span className="font-medium text-green-600">${profit.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Margin</span>
        <span className="font-medium">{margin.toFixed(1)}%</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Variants:</span>
          <span className="font-medium">
            {watchedHasVariants ? `${watchedVariants?.length || 0} variant(s)` : "Disabled"}
          </span>
        </div>
      </div>
    </>
  );
}

export function SummarySidebar({ control, submitting, uploadingImages }: SummarySidebarProps) {
  return (
    <div className="space-y-6 sticky top-6 self-start">
      <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base text-primary">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-2">
          <SummaryFields control={control} />
        </CardContent>
        <div className="p-6 pt-0 mt-4">
          <Button
            type="submit"
            className="w-full rounded-full shadow-lg h-12 gap-2"
            disabled={submitting || uploadingImages}
          >
            {submitting || uploadingImages ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />{" "}
                {uploadingImages ? "Uploading..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" /> Save Product
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-2 px-2">
        <Link href="/products" className="w-full">
          <Button variant="outline" className="w-full rounded-full h-11" type="button">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}
