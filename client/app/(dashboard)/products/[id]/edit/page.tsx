"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GET_PRODUCT, UPDATE_PRODUCT, GET_PRODUCTS } from "@/lib/graphql/products";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

import {
  productSchema,
  ProductFormValues,
  defaultFormValues,
} from "../../new/_components/product-schema";
import { GeneralTab } from "../../new/_components/general-tab";
import { ShippingTab } from "../../new/_components/shipping-tab";
import { VariantsTab } from "../../new/_components/variants-tab";
import { PricingTab } from "../../new/_components/pricing-tab";
import { MediaTab, MediaTabRef } from "../../new/_components/media-tab";
import { SummarySidebar } from "../../new/_components/summary-sidebar";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const mediaRef = useRef<MediaTabRef>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Fetch product data
  const {
    data,
    loading: fetchingProduct,
    error,
  } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
    fetchPolicy: "network-only",
  });

  const productData = data?.product;

  const formValues: ProductFormValues = useMemo(() => {
    if (!productData) return defaultFormValues;

    // Mapping category logic
    // If category has a parentId, then it's a subcategory
    const isSubcategory = !!productData.category?.parentId;
    const parentId = isSubcategory ? productData.category.parentId : productData.category?.id;
    const subId = isSubcategory ? productData.category.id : "";

    return {
      name: productData.name || "",
      description: productData.description || "",
      sku: productData.sku || "",
      barcode: productData.barcode || "",
      brandId: productData.brandId || "",
      categoryId: parentId || "",
      subcategoryId: subId || "",
      unit: productData.unit || "PCS",
      costPrice: productData.costPrice || 0,
      salePrice: productData.salePrice || 0,
      discountPrice: productData.discountPrice || 0,
      taxRate: productData.taxRate || 0,
      stock: productData.stock || 0,
      lowStockThreshold: productData.lowStockThreshold || 10,
      isActive: productData.isActive ?? true,
      hasVariants: productData.hasVariants ?? false,
      variants:
        productData.variants?.map(
          (v: {
            id: string;
            name: string;
            sku: string;
            barcode?: string;
            costPrice: number;
            salePrice: number;
            discountPrice?: number;
            stock: number;
            isActive: boolean;
          }) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            barcode: v.barcode || "",
            costPrice: v.costPrice,
            salePrice: v.salePrice,
            discountPrice: v.discountPrice || 0,
            stock: v.stock,
            isActive: v.isActive ?? true,
          })
        ) || [],
      tags: productData.tags || [],
      weight: productData.weight || 0,
      dimensionL: productData.dimensionL || 0,
      dimensionW: productData.dimensionW || 0,
      dimensionH: productData.dimensionH || 0,
    };
  }, [productData]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultFormValues,
    values: formValues,
  });

  // Keep a ref to tracked product ID to prevent infinite loops
  const lastProductId = useRef<string | null>(null);

  useEffect(() => {
    if (productData && productData.id !== lastProductId.current) {
      form.reset(formValues);
      lastProductId.current = productData.id;
    }
  }, [productData, form, formValues]);

  const [updateProduct, { loading: submitting }] = useMutation<
    { updateProduct: Product },
    { id: string; input: Record<string, unknown> }
  >(UPDATE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product updated successfully");
      router.push("/products");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update product");
    },
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setUploadingImages(true);

      const mediaResult = await mediaRef.current?.uploadImages();

      const { categoryId, subcategoryId, variants, hasVariants, ...restValues } = values;
      const finalCategoryId = subcategoryId || categoryId;

      updateProduct({
        variables: {
          id: productId,
          input: {
            ...restValues,
            hasVariants,
            categoryId: finalCategoryId,
            ...(hasVariants && variants?.length ? { variants } : { variants: [] }),
            ...(mediaResult?.mainImage && { mainImage: mediaResult.mainImage }),
            ...(mediaResult?.supportingImages && {
              supportingImages: mediaResult.supportingImages,
            }),
          },
        },
      });
    } catch {
      toast.error("Failed to update images");
      setUploadingImages(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-destructive font-medium">Failed to load product</p>
        <Link href="/products">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const product = data.product;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update your product details.</p>
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
                  <MediaTab
                    ref={mediaRef}
                    initialMainImage={product.mainImage}
                    initialSupportingImages={product.supportingImages}
                  />
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
