import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentSale {
  id: string;
  invoiceNumber: string;
  total: number;
  paymentMode: string;
  dueAmount: number;
  isRefunded: boolean;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email?: string;
  } | null;
}

interface RecentSalesProps {
  recentSales: RecentSale[];
  salesCount: number;
  loading: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
];

function getStatusBadge(sale: RecentSale) {
  if (sale.isRefunded) {
    return (
      <Badge
        variant="outline"
        className="mt-1 text-[10px] bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      >
        Refunded
      </Badge>
    );
  }
  if (sale.dueAmount > 0) {
    return (
      <Badge
        variant="outline"
        className="mt-1 text-[10px] bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      >
        Due
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="mt-1 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
    >
      Paid
    </Badge>
  );
}

export function RecentSales({ recentSales, salesCount, loading }: RecentSalesProps) {
  return (
    <Card className="col-span-3 border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          {loading ? (
            <Skeleton className="h-4 w-40" />
          ) : (
            `${salesCount} sale${salesCount !== 1 ? "s" : ""} in this period.`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))
            : recentSales.map((sale, index) => {
                const customerName = sale.customer?.name || "Walk-in Customer";
                return (
                  <div
                    key={sale.id}
                    className="flex items-center group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 p-2 rounded-lg transition-colors -mx-2"
                  >
                    <Avatar className="h-9 w-9 border-2 border-white dark:border-black shadow-sm">
                      <AvatarFallback className={avatarColors[index % avatarColors.length]}>
                        {getInitials(customerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors truncate">
                        {customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">{sale.invoiceNumber}</p>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <div className="font-medium">
                        ${sale.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      {getStatusBadge(sale)}
                    </div>
                  </div>
                );
              })}
          {!loading && recentSales.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No sales found in this period.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
