"use client";

import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_STATS } from "@/lib/graphql/dashboard";
import { ReportStatCard } from "@/components/reports/report-stat-card";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  BarChart2,
  PackageSearch,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const REPORT_CARDS = [
  {
    title: "Sales Report",
    description: "Revenue, payments, top products, and daily trends",
    href: "/reports/sales",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Purchase Report",
    description: "Vendor spend, purchase quantities, and dues",
    href: "/reports/purchases",
    icon: ShoppingCart,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Inventory Valuation",
    description: "Stock value, retail potential, and low stock list",
    href: "/reports/inventory",
    icon: PackageSearch,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Profit & Loss",
    description: "Income, COGS, expenses, and net profit margins",
    href: "/reports/profit-loss",
    icon: BarChart2,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Customer & Vendor Ledger",
    description: "Outstanding balances and transaction history",
    href: "/reports/ledger",
    icon: Users,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

export default function ReportsOverviewPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const { data, loading } = useQuery(GET_DASHBOARD_STATS, {
    variables: {
      startDate: dateRange?.from,
      endDate: dateRange?.to || dateRange?.from,
    },
    skip: !dateRange?.from,
  });

  const stats = data?.dashboardStats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Reports
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Overview of key metrics and access to detailed reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ReportStatCard
          title="Total Revenue"
          value={
            loading
              ? "..."
              : `$${stats?.totalSales?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`
          }
          icon={DollarSign}
        />
        <ReportStatCard
          title="Total Purchases"
          value={
            loading
              ? "..."
              : `$${stats?.totalPurchases?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`
          }
          icon={ShoppingCart}
        />
        <ReportStatCard
          title="Gross Profit"
          value={
            loading
              ? "..."
              : `$${stats?.grossProfit?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}`
          }
          icon={TrendingUp}
        />
        <ReportStatCard
          title="Total Due (Pending)"
          value={loading ? "..." : stats?.pendingOrders?.toLocaleString() || "0"}
          icon={CreditCard}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4 mt-8">
          Detailed Reports
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REPORT_CARDS.map((card) => (
            <Link key={card.title} href={card.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}
                    >
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
