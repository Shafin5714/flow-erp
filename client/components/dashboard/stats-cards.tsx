import { DollarSign, Wallet, AlertTriangle, ClipboardList, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  totalSales: number;
  netProfit: number;
  lowStockCount: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  loading: boolean;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function StatsCards({
  totalSales,
  netProfit,
  lowStockCount,
  pendingOrders,
  totalProducts,
  totalCustomers,
  loading,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalSales),
      icon: DollarSign,
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Net Profit",
      value: formatCurrency(netProfit),
      icon: Wallet,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Low Stock Items",
      value: lowStockCount.toString(),
      icon: AlertTriangle,
      iconBg: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: ClipboardList,
      iconBg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      iconBg: "bg-violet-50 dark:bg-violet-900/20",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
      iconBg: "bg-sky-50 dark:bg-sky-900/20",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`h-9 w-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {card.value}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
