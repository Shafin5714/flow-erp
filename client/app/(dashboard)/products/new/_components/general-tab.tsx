"use client";

import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES, CREATE_CATEGORY, GET_BRANDS, CREATE_BRAND } from "@/lib/graphql/products";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
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
import { Package, Plus, Loader2, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ProductFormValues, units } from "./product-schema";

interface GeneralTabProps {
  form: UseFormReturn<ProductFormValues>;
}

export function GeneralTab({ form }: GeneralTabProps) {
  const [newCatName, setNewCatName] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newSubcatName, setNewSubcatName] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [subcatPopoverOpen, setSubcatPopoverOpen] = useState(false);
  const [brandPopoverOpen, setBrandPopoverOpen] = useState(false);

  const { data: catData, loading: catLoading } = useQuery<{
    categories: Category[];
  }>(GET_CATEGORIES, {
    fetchPolicy: "network-only",
  });
  const { data: brandData, loading: brandLoading } = useQuery<{
    brands: { id: string; name: string }[];
  }>(GET_BRANDS, {
    fetchPolicy: "network-only",
  });

  const categories = catData?.categories || [];
  const topLevelCategories = categories.filter((c: Category) => !c.parentId || c.parentId === "");
  const brands = brandData?.brands || [];

  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });
  const selectedCategory = categories.find((c: Category) => c.id === selectedCategoryId);
  const subcategories = categories.filter((c: Category) => c.parentId === selectedCategoryId);

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

  const [createSubcategory, { loading: subcatCreating }] = useMutation<
    { createCategory: Category },
    { input: { name: string; parentId: string } }
  >(CREATE_CATEGORY, {
    onCompleted: (data) => {
      toast.success("Subcategory created successfully");
      form.setValue("subcategoryId", data.createCategory.id);
      setNewSubcatName("");
      setSubcatPopoverOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create subcategory");
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

  return (
    <div className="space-y-6">
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      key={`${field.value}-${brands.length}`}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder={brandLoading ? "Loading..." : "Select brand"} />
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
                        <Button variant="outline" size="icon" className="shrink-0" type="button">
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
                              {brandCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
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
                  <Select onValueChange={field.onChange} value={field.value || "PCS"}>
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
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("subcategoryId", "");
                      }}
                      value={field.value || ""}
                      key={`${field.value}-${topLevelCategories.length}`}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue
                            placeholder={catLoading ? "Loading..." : "Select category"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topLevelCategories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0" type="button">
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
                              {catCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
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

          {selectedCategoryId && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subcategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subcategory (Optional)</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        key={`${field.value}-${subcategories.length}`}
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((sub: Category) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Popover open={subcatPopoverOpen} onOpenChange={setSubcatPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon" className="shrink-0" type="button">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">New Subcategory</h4>
                              <p className="text-sm text-muted-foreground">
                                Add a new subcategory under {selectedCategory?.name}.
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Subcategory Name"
                                value={newSubcatName}
                                onChange={(e) => setNewSubcatName(e.target.value)}
                                className="h-9"
                              />
                              <Button
                                size="sm"
                                className="h-9"
                                disabled={subcatCreating || !newSubcatName.trim()}
                                onClick={() =>
                                  createSubcategory({
                                    variables: {
                                      input: {
                                        name: newSubcatName,
                                        parentId: selectedCategoryId,
                                      },
                                    },
                                  })
                                }
                              >
                                {subcatCreating ? (
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
          )}
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
    </div>
  );
}
