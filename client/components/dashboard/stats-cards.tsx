import {
  CreditCard,
  DollarSign,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">$45,231.89</div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium flex items-center gap-0.5 mr-1">
              <ArrowUpRight className="h-3 w-3" /> +20.1%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Subscriptions</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">+2350</div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium flex items-center gap-0.5 mr-1">
              <ArrowUpRight className="h-3 w-3" /> +180.1%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Sales</CardTitle>
          <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">+12,234</div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium flex items-center gap-0.5 mr-1">
              <ArrowUpRight className="h-3 w-3" /> +19%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
          <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <Activity className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">+573</div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium flex items-center gap-0.5 mr-1">
              <ArrowUpRight className="h-3 w-3" /> +201
            </span>
            since last hour
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
