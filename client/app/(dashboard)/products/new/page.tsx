"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CREATE_PRODUCT,
  GET_CATEGORIES,
  GET_PRODUCTS,
  CREATE_CATEGORY,
  GET_BRANDS,
  CREATE_BRAND,
} from "@/lib/graphql/products";
import { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  ChevronLeft,
  Package,
  Save,
  Loader2,
  Plus,
  X,
  ImagePlus,
  Info,
  Tag,
  Ruler,
  BadgeDollarSign,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { BadgeInput } from "@/components/ui/badge-input";
import { DatePicker } from "@/components/ui/date-picker";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  barcode: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  unit: z.string().min(1, "Please select a unit"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  salePrice: z.number().min(0, "Sale price must be positive"),
  discountPrice: z.number().min(0, "Discount price must be positive").optional(),
  taxRate: z.number().min(0, "Tax rate must be positive").optional(),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  lowStockThreshold: z.number().int().min(0, "Threshold must be non-negative"),
  isActive: z.boolean(),
  expiryDate: z.date().optional(),
  warrantyPeriod: z.string().optional(),
  tags: z.array(z.string()),
  weight: z.number().min(0).optional(),
  dimensionL: z.number().min(0).optional(),
  dimensionW: z.number().min(0).optional(),
  dimensionH: z.number().min(0).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

function SummaryFields({ control }: { control: Control<ProductFormValues> }) {
  const name = useWatch({ control, name: "name" }) || "Untitled";
  const costPrice = Number(useWatch({ control, name: "costPrice" })) || 0;
  const salePrice = Number(useWatch({ control, name: "salePrice" })) || 0;
  const isActive = useWatch({ control, name: "isActive" });

  const profit = salePrice - costPrice;
  const margin = salePrice > 0 ? (profit / salePrice) * 100 : 0;

  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Product</span>
        <span className="font-medium text-right max-w-[150px] truncate">{name}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Status</span>
        <span className={cn("font-medium", isActive ? "text-emerald-600" : "text-amber-600")}>
          {isActive ? "Active" : "Inactive"}
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
    </>
  );
}

const units = ["PCS", "KG", "LITER", "BOX", "PACK", "METER"];

export default function NewProductPage() {
  const router = useRouter();
  const [newCatName, setNewCatName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [brandPopoverOpen, setBrandPopoverOpen] = useState(false);

  const { data: catData, loading: catLoading } = useQuery<{ categories: Category[] }>(
    GET_CATEGORIES
  );
  const { data: brandData, loading: brandLoading } = useQuery<{
    brands: { id: string; name: string }[];
  }>(GET_BRANDS);
  const categories = catData?.categories || [];
  const brands = brandData?.brands || [];

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

  const [createCategory, { loading: catCreating }] = useMutation<
    { createCategory: Category },
    { input: { name: string } }
  >(CREATE_CATEGORY, {
    onCompleted: (data) => {
      toast.success("Category created successfully");
      form.setValue("categoryId", data.createCategory.id);
      setNewCatName("");
      setPopoverOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const [createBrand, { loading: brandCreating }] = useMutation<
    { createBrand: { id: string; name: string } },
    { input: { name: string } }
  >(CREATE_BRAND, {
    onCompleted: (data) => {
      toast.success("Brand created successfully");
      form.setValue("brandId", data.createBrand.id);
      setNewBrandName("");
      setBrandPopoverOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create brand");
    },
    refetchQueries: [{ query: GET_BRANDS }],
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      barcode: "",
      brandId: "",
      categoryId: "",
      unit: "PCS",
      costPrice: 0,
      salePrice: 0,
      discountPrice: 0,
      taxRate: 0,
      stock: 0,
      lowStockThreshold: 10,
      isActive: true,
      tags: [],
      weight: 0,
      dimensionL: 0,
      dimensionW: 0,
      dimensionH: 0,
    },
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [supportingImageFiles, setSupportingImageFiles] = useState<File[]>([]);
  const [supportingImagePreviews, setSupportingImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const uploadImages = async () => {
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
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setUploadingImages(true);
      const { mainImage, supportingImages } = await uploadImages();

      createProduct({
        variables: {
          input: {
            ...values,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping & Details</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-0">
                  {/* Basic Information */}
                  <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Basic Information
                      </CardTitle>
                      <CardDescription>Enter the primary details of the product.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50 mb-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Active Status</FormLabel>
                          <FormDescription className="text-xs">
                            Visible to customers in the store
                          </FormDescription>
                        </div>
                        <FormField
                          control={form.control}
                          name="isActive"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Wireless Mouse" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="brandId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand / Manufacturer</FormLabel>
                              <div className="flex gap-2">
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue
                                        placeholder={brandLoading ? "Loading..." : "Select brand"}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {brands.map((brand: { id: string; name: string }) => (
                                      <SelectItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Popover open={brandPopoverOpen} onOpenChange={setBrandPopoverOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="shrink-0"
                                      type="button"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80" align="end">
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium leading-none">New Brand</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Add a new brand for your products.
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Brand Name"
                                          value={newBrandName}
                                          onChange={(e) => setNewBrandName(e.target.value)}
                                          className="h-9"
                                        />
                                        <Button
                                          size="sm"
                                          className="h-9"
                                          disabled={brandCreating || !newBrandName.trim()}
                                          onClick={() =>
                                            createBrand({
                                              variables: { input: { name: newBrandName } },
                                            })
                                          }
                                        >
                                          {brandCreating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            "Add"
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {units.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. WM-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="barcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Barcode (UPC/EAN)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 123456789012" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="categoryId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <div className="flex gap-2">
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="flex-1">
                                      <SelectValue
                                        placeholder={catLoading ? "Loading..." : "Select category"}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((category: Category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="shrink-0"
                                      type="button"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80" align="end">
                                    <div className="grid gap-4">
                                      <div className="space-y-2">
                                        <h4 className="font-medium leading-none">New Category</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Add a new category to organize your products.
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Category Name"
                                          value={newCatName}
                                          onChange={(e) => setNewCatName(e.target.value)}
                                          className="h-9"
                                        />
                                        <Button
                                          size="sm"
                                          className="h-9"
                                          disabled={catCreating || !newCatName.trim()}
                                          onClick={() =>
                                            createCategory({
                                              variables: { input: { name: newCatName } },
                                            })
                                          }
                                        >
                                          {catCreating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            "Add"
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Product Description
                      </CardTitle>
                      <CardDescription>Give your product a detailed description.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RichTextEditor value={field.value || ""} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6 mt-0">
                  {/* Pricing & Stock */}
                  <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BadgeDollarSign className="h-5 w-5 text-primary" />
                        Pricing & Stock
                      </CardTitle>
                      <CardDescription>Configure pricing and inventory settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="costPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cost Price ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="salePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sale Price ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="discountPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Price ($)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                              <FormDescription>Promotional price</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="taxRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax Rate (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Initial Stock</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lowStockThreshold"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Low Stock Alert</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="shipping" className="space-y-6 mt-0">
                  {/* Physical Attributes */}
                  <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-primary" />
                        Physical Attributes
                      </CardTitle>
                      <CardDescription>
                        Enter weight and dimensions (Shipping info).
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="dimensionL"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Length (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dimensionW"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Width (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dimensionH"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.1"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Details */}
                  <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        Additional Details
                      </CardTitle>
                      <CardDescription>Set tags, expiry date, and warranty info.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Expiry Date</FormLabel>
                              <DatePicker
                                date={field.value}
                                setDate={field.onChange}
                                placeholder="Select expiry date"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="warrantyPeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Warranty Period</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 1 Year" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <BadgeInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Type a tag and press Enter"
                              />
                            </FormControl>
                            <FormDescription>Press Enter to add multiple tags</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-6 mt-0">
                  {/* Images */}
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
                                      setSupportingImageFiles((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      );
                                      setSupportingImagePreviews((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      );

                                      // Revoke URL to prevent memory leaks
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
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6 sticky top-6 self-start">
              <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base text-primary">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-2">
                  <SummaryFields control={form.control} />
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
          </div>
        </form>
      </Form>
    </div>
  );
}
