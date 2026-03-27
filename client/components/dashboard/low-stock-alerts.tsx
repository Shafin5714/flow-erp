import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Package } from "lucide-react";

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  mainImage?: string | null;
}

interface LowStockAlertsProps {
  lowStockProducts: LowStockProduct[];
  loading: boolean;
}

export function LowStockAlerts({ lowStockProducts, loading }: LowStockAlertsProps) {
  if (!loading && lowStockProducts.length === 0) return null;

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <div className="space-y-1">
          <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
          <CardDescription>Products that need restocking</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {lowStockProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isOutOfStock
                      ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10"
                      : "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-900/10"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isOutOfStock
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                    }`}
                  >
                    <Package
                      className={`h-5 w-5 ${
                        isOutOfStock
                          ? "text-red-600 dark:text-red-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-xs ${
                      isOutOfStock
                        ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                        : "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                    }`}
                  >
                    {product.stock}/{product.lowStockThreshold}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
