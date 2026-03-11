"use client";

import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CREATE_PRODUCT, GET_PRODUCTS } from "@/lib/graphql/products";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

import { productSchema, ProductFormValues, defaultFormValues } from "./_components/product-schema";
import { GeneralTab } from "./_components/general-tab";
import { ShippingTab } from "./_components/shipping-tab";
import { VariantsTab } from "./_components/variants-tab";
import { PricingTab } from "./_components/pricing-tab";
import { MediaTab, MediaTabRef } from "./_components/media-tab";
import { SummarySidebar } from "./_components/summary-sidebar";

export default function NewProductPage() {
  const router = useRouter();
  const mediaRef = useRef<MediaTabRef>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultFormValues,
  });

  const [createProduct, { loading: submitting }] = useMutation<
    { createProduct: Product },
    { input: Record<string, unknown> }
  >(CREATE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product created successfully");
      router.push("/products");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setUploadingImages(true);
      const { mainImage, supportingImages } = (await mediaRef.current?.uploadImages()) ?? {
        mainImage: null,
        supportingImages: [],
      };

      const { categoryId, subcategoryId, variants, hasVariants, ...restValues } = values;
      const finalCategoryId = subcategoryId || categoryId;

      createProduct({
        variables: {
          input: {
            ...restValues,
            hasVariants,
            categoryId: finalCategoryId,
            ...(hasVariants && variants?.length ? { variants } : {}),
            ...(mainImage && { mainImage }),
            ...(supportingImages.length > 0 && { supportingImages }),
          },
        },
      });
    } catch {
      toast.error("Failed to upload images");
      setUploadingImages(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">Create a new item in your inventory.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={(e) => form.handleSubmit(onSubmit)(e)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping & Details</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-0">
                  <GeneralTab form={form} />
                </TabsContent>

                <TabsContent value="variants" className="space-y-6 mt-0">
                  <VariantsTab form={form} />
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6 mt-0">
                  <PricingTab form={form} />
                </TabsContent>

                <TabsContent value="shipping" className="space-y-6 mt-0">
                  <ShippingTab form={form} />
                </TabsContent>

                <TabsContent value="media" className="space-y-6 mt-0">
                  <MediaTab ref={mediaRef} />
                </TabsContent>
              </Tabs>
            </div>

            <SummarySidebar
              control={form.control}
              submitting={submitting}
              uploadingImages={uploadingImages}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
