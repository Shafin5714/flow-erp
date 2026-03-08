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
import { ChevronLeft, Package, Save, Loader2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useState } from "react";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  unit: z.string().min(1, "Please select a unit"),
  costPrice: z.number().min(0, "Cost price must be positive"),
  salePrice: z.number().min(0, "Sale price must be positive"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  lowStockThreshold: z.number().int().min(0, "Threshold must be non-negative"),
});

type ProductFormValues = z.infer<typeof productSchema>;

function SummaryFields({ control }: { control: Control<ProductFormValues> }) {
  const name = useWatch({ control, name: "name" }) || "Untitled";
  const costPrice = Number(useWatch({ control, name: "costPrice" })) || 0;
  const salePrice = Number(useWatch({ control, name: "salePrice" })) || 0;

  const profit = salePrice - costPrice;
  const margin = salePrice > 0 ? (profit / salePrice) * 100 : 0;

  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Product</span>
        <span className="font-medium">{name}</span>
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
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: catData, loading: catLoading } = useQuery<{ categories: Category[] }>(
    GET_CATEGORIES
  );
  const categories = catData?.categories || [];

  const [createProduct, { loading: submitting }] = useMutation<
    { createProduct: Product },
    { input: ProductFormValues }
  >(CREATE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product created successfully");
      router.push("/dashboard/products");
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      unit: "PCS",
      costPrice: 0,
      salePrice: 0,
      stock: 0,
      lowStockThreshold: 10,
    },
  });

  const onSubmit = (values: ProductFormValues) => {
    createProduct({
      variables: {
        input: values,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
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
              <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Enter the primary details of the product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU / Barcode</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. WM-001" {...field} />
                          </FormControl>
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
                              <SelectTrigger>
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
                                      createCategory({ variables: { input: { name: newCatName } } })
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
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
                <CardHeader>
                  <CardTitle className="text-lg">Pricing & Stock</CardTitle>
                  <CardDescription>Define how much you buy and sell this for.</CardDescription>
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
                          <FormDescription>Notify me when stock falls below this.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Saving...
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
                <Link href="/dashboard/products" className="w-full">
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
