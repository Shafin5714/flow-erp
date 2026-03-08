"use client";

import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Plus, Package, RefreshCw, AlertCircle } from "lucide-react";
import { Product } from "@/lib/types";
import Link from "next/link";
import { format } from "date-fns";

export default function ProductsPage() {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
  });

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your inventory and product listings.</p>
        </div>
        <Link href="/products/new">
          <Button size="lg" className="rounded-full shadow-md">
            <Plus className="mr-2 h-5 w-5" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-zinc-500" />
            <CardTitle className="text-lg">Product Inventory</CardTitle>
          </div>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="h-8 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-destructive">Failed to load products</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 text-zinc-400">
                <Package className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Get started by adding your first product to the inventory.
                </p>
              </div>
              <Link href="/products/new">
                <Button variant="outline">Add First Product</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">SKU</th>
                    <th className="px-6 py-4 font-semibold">Product Name</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold">Cost Price</th>
                    <th className="px-6 py-4 font-semibold">Sale Price</th>
                    <th className="px-6 py-4 font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {products.map((product: Product) => (
                    <tr
                      key={product.id}
                      className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-900 dark:text-zinc-100">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            product.stock <= product.lowStockThreshold
                              ? "text-destructive"
                              : "text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                        ${product.costPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-primary font-medium">
                        ${product.salePrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">
                        {format(new Date(product.updatedAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
