import {
  DollarSign,
  Wallet,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            $12,450
          </div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-0.5 mr-1">
              <TrendingUp className="h-3 w-3" /> +12%
            </span>
            from last week
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
          <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            $8,200
          </div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-0.5 mr-1">
              <TrendingUp className="h-3 w-3" /> +5%
            </span>
            from last week
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </CardTitle>
          <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            24
          </div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-0.5 mr-1">
              <TrendingDown className="h-3 w-3" /> -2%
            </span>
            stock value
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pending Orders
          </CardTitle>
          <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            8
          </div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-neutral-500 font-medium flex items-center gap-0.5 mr-1">
              <Minus className="h-3 w-3" /> Same
            </span>
            as yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
