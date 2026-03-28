/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_SALES_REPORT } from "@/lib/graphql/reports";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportStatCard } from "@/components/reports/report-stat-card";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SalesReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const { data, loading, error } = useQuery(GET_SALES_REPORT, {
    variables: {
      filter: {
        startDate: dateRange?.from,
        endDate: dateRange?.to || dateRange?.from,
      },
    },
    skip: !dateRange?.from,
  });

  const report = data?.salesReport;

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">Error loading report: {error.message}</div>
    );
  }

  // Formatting date for charts
  const chartData =
    report?.dailyTrend.map((d: any) => ({
      ...d,
      dateValue: format(new Date(d.date), "MMM dd"),
    })) || [];

  const paymentData = report
    ? [
        { name: "Cash", value: report.paymentBreakdown.cash },
        { name: "Due", value: report.paymentBreakdown.due },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sales Report
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Detailed insights into sales performance and trends
          </p>
        </div>
      </div>

      <ReportFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {loading ? (
        <div className="py-20 text-center animate-pulse text-zinc-500">Loading metrics...</div>
      ) : report ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportStatCard
              title="Net Revenue"
              value={`$${report.netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              description={`From ${report.totalSalesCount} sales`}
            />
            <ReportStatCard
              title="Items Sold"
              value={report.totalItemsSold.toLocaleString()}
              icon={ShoppingCart}
              description="Total quantity of products"
            />
            <ReportStatCard
              title="Avg Order Value"
              value={`$${report.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
            />
            <ReportStatCard
              title="Total Refunds"
              value={`$${report.totalRefunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={CreditCard}
              description={`${report.refundCount} refunded invoices`}
              trend={{ value: -report.totalRefunds, label: "Refunds" }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Daily revenue across the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                    <XAxis
                      dataKey="dateValue"
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      cursor={{ stroke: "#a1a1aa", strokeWidth: 1 }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow:
                          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Payment Mode</CardTitle>
                <CardDescription>Cash vs Due distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip
                      formatter={(value: any) =>
                        `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>By total revenue generated</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.topProducts.map((p: any) => (
                      <TableRow key={p.productId}>
                        <TableCell>
                          <div className="font-medium text-zinc-900 dark:text-zinc-50">
                            {p.productName}
                          </div>
                          <div className="text-xs text-zinc-500">{p.sku}</div>
                        </TableCell>
                        <TableCell className="text-right">{p.quantitySold}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                    {report.topProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-zinc-500">
                          No product data available in this period
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={report.salesByCategory}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#e4e4e7"
                    />
                    <XAxis
                      type="number"
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis
                      dataKey="categoryName"
                      type="category"
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ borderRadius: "8px", border: "none" }}
                    />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
