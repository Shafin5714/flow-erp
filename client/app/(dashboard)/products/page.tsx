"use client";

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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct({ variables: { id } });
    }
  };

  const products = data?.products || [];

  // Calculate stats
  const totalProducts = products.length;
  const lowStockItems = products.filter(
    (p: Product) => p.stock <= p.lowStockThreshold && p.stock > 0
  ).length;
  const outOfStockItems = products.filter((p: Product) => p.stock === 0).length;
  const totalInventoryValue = products.reduce(
    (acc: number, p: Product) => acc + p.stock * p.salePrice,
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
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
        <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold mt-1">{totalProducts}</p>
              </div>
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold mt-1">${totalInventoryValue.toLocaleString()}</p>
              </div>
              <div className="bg-emerald-500/10 p-2.5 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold mt-1 text-amber-500">{lowStockItems}</p>
              </div>
              <div className="bg-amber-500/10 p-2.5 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold mt-1 text-destructive">{outOfStockItems}</p>
              </div>
              <div className="bg-destructive/10 p-2.5 rounded-xl">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
        <div className="p-6 border-b bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 h-10 rounded-full border-zinc-200 dark:border-zinc-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">
              Showing {products.length} products
            </span>
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
          ) : products.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-6 text-center px-4">
              <div className="h-24 w-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Package className="h-12 w-12" />
              </div>
              <div className="max-w-xs">
                <p className="text-xl font-bold">No products yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start building your inventory by adding your first product.
                </p>
              </div>
              <Link href="/products/new">
                <Button variant="default" className="rounded-full px-8 h-11 shadow-lg">
                  <Plus className="mr-2 h-5 w-5" /> Add First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b">
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Product
                    </th>
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Brand
                    </th>
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Category
                    </th>
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Stock Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Sale Price
                    </th>
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Inventory Value
                    </th>
                    <th className="px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Last Updated
                    </th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {products.map((product: Product) => {
                    const isLowStock =
                      product.stock <= product.lowStockThreshold && product.stock > 0;
                    const isOutOfStock = product.stock === 0;

                    return (
                      <tr
                        key={product.id}
                        className="group transition-all hover:bg-zinc-50/80 dark:hover:bg-zinc-900/80"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-300">
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
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground italic">
                            {product.brand || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none px-3 py-1"
                          >
                            {product.category?.name || "General"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={product.isActive ? "default" : "outline"}
                            className={cn(
                              "px-3 py-1 border-none",
                              product.isActive
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                            )}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
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
                                className={`font-bold text-sm ${
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
                            <span className="text-xs text-muted-foreground ml-4">
                              {product.stock} {product.unit} available
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">
                            $
                            {product.salePrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-zinc-500">
                            $
                            {(product.stock * product.salePrice).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(product.updatedAt), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 text-right">
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
