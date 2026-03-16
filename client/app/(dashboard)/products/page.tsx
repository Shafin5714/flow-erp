"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS, DELETE_PRODUCT } from "@/lib/graphql/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Package,
  RefreshCw,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  DollarSign,
  Search,
} from "lucide-react";
import { Product } from "@/lib/types";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success("Product deleted successfully");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete product");
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct({ variables: { id } });
    }
  };

  const products = useMemo<Product[]>(() => data?.products || [], [data?.products]);

  const stats = useMemo(() => {
    const total = products.length;
    const low = products.filter(
      (p: Product) => p.stock <= p.lowStockThreshold && p.stock > 0
    ).length;
    const out = products.filter((p: Product) => p.stock === 0).length;
    const value = products.reduce((acc: number, p: Product) => acc + p.stock * p.salePrice, 0);
    return { total, low, out, value };
  }, [products]);

  const {
    total: totalProducts,
    low: lowStockItems,
    out: outOfStockItems,
    value: totalInventoryValue,
  } = stats;

  // Extract unique categories and brands for filters
  const categories: string[] = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.name).filter(Boolean) as string[]);
    return Array.from(cats);
  }, [products]);

  const brands: string[] = useMemo(() => {
    const brnds = new Set(products.map((p) => p.brand?.name).filter(Boolean) as string[]);
    return Array.from(brnds);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return products.filter((product) => {
      const { name, sku, category, brand, isActive, stock, lowStockThreshold } = product;

      const matchesSearch =
        name.toLowerCase().includes(searchLower) || sku.toLowerCase().includes(searchLower);

      const matchesCategory = categoryFilter === "all" || category?.name === categoryFilter;
      const matchesBrand = brandFilter === "all" || brand?.name === brandFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && stock > lowStockThreshold) ||
        (stockFilter === "low_stock" && stock <= lowStockThreshold && stock > 0) ||
        (stockFilter === "out_of_stock" && stock === 0);

      return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesStock;
    });
  }, [products, searchTerm, categoryFilter, brandFilter, statusFilter, stockFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory and product listings with ease.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={loading}
            className="rounded-full h-11 w-11 shadow-sm transition-all hover:rotate-180 duration-500"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/products/new" className="flex-1 md:flex-initial">
            <Button
              size="lg"
              className="rounded-full shadow-lg px-6 h-11 w-full bg-primary hover:scale-105 transition-transform duration-200"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "blue",
            accent: "bg-blue-500",
            lightBg: "bg-blue-500/10",
            darkBg: "dark:bg-blue-500/20",
          },
          {
            title: "Inventory Value",
            value: `$${totalInventoryValue.toLocaleString()}`,
            icon: DollarSign,
            color: "emerald",
            accent: "bg-emerald-500",
            lightBg: "bg-emerald-500/10",
            darkBg: "dark:bg-emerald-500/20",
          },
          {
            title: "Low Stock",
            value: lowStockItems,
            icon: AlertTriangle,
            color: "amber",
            accent: "bg-amber-500",
            lightBg: "bg-amber-500/10",
            darkBg: "dark:bg-amber-500/20",
            valueColor: "text-amber-500",
          },
          {
            title: "Out of Stock",
            value: outOfStockItems,
            icon: AlertCircle,
            color: "destructive",
            accent: "bg-destructive",
            lightBg: "bg-destructive/10",
            darkBg: "dark:bg-destructive/20",
            valueColor: "text-destructive",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div
              className={cn(
                "absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                stat.accent
              )}
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
                    {stat.title}
                  </p>
                  <p
                    className={cn(
                      "text-xl font-black mt-0.5 tracking-tight transition-colors duration-300",
                      stat.valueColor || "text-foreground"
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                    stat.lightBg,
                    stat.darkBg
                  )}
                >
                  <stat.icon
                    className={cn(
                      "h-5 w-5",
                      stat.color === "destructive" ? "text-destructive" : `text-${stat.color}-500`
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-none shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
        <div className="p-4 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-4">
          <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4">
            <div className="relative w-full xl:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] h-10 rounded-full bg-white dark:bg-zinc-900">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-[140px] h-10 rounded-full bg-white dark:bg-zinc-900">
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-10 rounded-full bg-white dark:bg-zinc-900">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[140px] h-10 rounded-full bg-white dark:bg-zinc-900">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {(searchTerm ||
              categoryFilter !== "all" ||
              brandFilter !== "all" ||
              statusFilter !== "all" ||
              stockFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setBrandFilter("all");
                  setStatusFilter("all");
                  setStockFilter("all");
                }}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Package className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Loading product inventory...
              </p>
            </div>
          ) : error ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-6 text-center px-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
              </div>
              <div className="max-w-xs">
                <p className="text-xl font-bold text-destructive">Connection Error</p>
                <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline" className="rounded-full px-8">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-6 text-center px-4">
              <div className="h-24 w-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Search className="h-12 w-12" />
              </div>
              <div className="max-w-xs">
                <p className="text-xl font-bold">No products found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b">
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 w-[300px]">
                      Product
                    </th>
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      Brand
                    </th>
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 w-[150px]">
                      Stock Status
                    </th>
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      Sale Price
                    </th>
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      Inventory Value
                    </th>
                    <th className="px-6 py-3 font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 font-semibold text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredProducts.map((product) => {
                    const isLowStock =
                      product.stock <= product.lowStockThreshold && product.stock > 0;
                    const isOutOfStock = product.stock === 0;

                    return (
                      <tr
                        key={product.id}
                        className="group transition-all hover:bg-zinc-50/80 dark:hover:bg-zinc-900/80"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 min-w-10 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-300">
                              <AvatarImage
                                src={product.mainImage}
                                alt={product.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl">
                                <Package className="h-6 w-6" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                                {product.name}
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className="text-xs text-muted-foreground font-mono">
                                  {product.sku}
                                </span>
                                {product.tags?.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-[10px] px-1.5 h-4 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {(product.tags?.length || 0) > 2 && (
                                  <span className="text-[10px] text-muted-foreground">
                                    +{(product.tags?.length || 0) - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm text-muted-foreground italic whitespace-nowrap">
                            {product.brand?.name || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <Badge
                            variant="secondary"
                            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none px-3 py-1 whitespace-nowrap"
                          >
                            {product.category?.name || "General"}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          <Badge
                            variant={product.isActive ? "default" : "outline"}
                            className={cn(
                              "px-3 py-1 border-none whitespace-nowrap",
                              product.isActive
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                            )}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2.5 w-2.5 rounded-full ${
                                  isOutOfStock
                                    ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                    : isLowStock
                                      ? "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                                      : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                }`}
                              />
                              <span
                                className={`font-bold text-sm whitespace-nowrap ${
                                  isOutOfStock
                                    ? "text-destructive"
                                    : isLowStock
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-emerald-600 dark:text-emerald-400"
                                }`}
                              >
                                {isOutOfStock
                                  ? "Out of Stock"
                                  : isLowStock
                                    ? "Low Stock"
                                    : "In Stock"}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {product.stock} {product.unit} available
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                            $
                            {product.salePrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm font-medium text-zinc-500 whitespace-nowrap">
                            $
                            {(product.stock * product.salePrice).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(product.updatedAt), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-9 w-9 p-0 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 p-2 rounded-xl shadow-2xl border-zinc-200 dark:border-zinc-800"
                            >
                              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Options
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="my-1" />
                              <Link href={`/products/${product.id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer rounded-lg gap-3 py-2 text-sm font-medium">
                                  <Edit className="h-4 w-4 text-zinc-500" /> Edit Product
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg gap-3 py-2 text-sm font-medium"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="h-4 w-4" /> Delete Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
