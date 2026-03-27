"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfDay } from "date-fns";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { GET_DASHBOARD_STATS } from "@/lib/graphql/dashboard";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  });

  const { data, loading } = useQuery(GET_DASHBOARD_STATS, {
    variables: {
      startDate: dateRange?.from?.toISOString() || new Date().toISOString(),
      endDate: dateRange?.to?.toISOString() || new Date().toISOString(),
    },
    fetchPolicy: "cache-and-network",
  });

  const stats = data?.dashboardStats;

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>
      <StatsCards
        totalSales={stats?.totalSales ?? 0}
        netProfit={stats?.netProfit ?? 0}
        lowStockCount={stats?.lowStockProducts?.length ?? 0}
        pendingOrders={stats?.pendingOrders ?? 0}
        totalProducts={stats?.totalProducts ?? 0}
        totalCustomers={stats?.totalCustomers ?? 0}
        loading={loading}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Overview monthlyStats={stats?.monthlyStats ?? []} loading={loading} />
        <RecentSales
          recentSales={stats?.recentSales ?? []}
          salesCount={stats?.salesCount ?? 0}
          loading={loading}
        />
      </div>
      <LowStockAlerts lowStockProducts={stats?.lowStockProducts ?? []} loading={loading} />
    </div>
  );
}
