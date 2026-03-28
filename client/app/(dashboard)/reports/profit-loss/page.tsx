/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_PROFIT_LOSS_REPORT } from "@/lib/graphql/reports";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportStatCard } from "@/components/reports/report-stat-card";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { endOfMonth, startOfYear } from "date-fns";
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";
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
  Legend,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProfitLossReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfYear(new Date()), // Default to full year for better charts
    to: endOfMonth(new Date()),
  });

  const { data, loading, error } = useQuery(GET_PROFIT_LOSS_REPORT, {
    variables: {
      startDate: dateRange?.from,
      endDate: dateRange?.to || dateRange?.from,
    },
    skip: !dateRange?.from,
  });

  const report = data?.profitLossReport;

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">Error loading report: {error.message}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Profit & Loss
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Comprehensive breakdown of income, COGS, expenses, and net profit
          </p>
        </div>
      </div>

      <ReportFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

      {loading ? (
        <div className="py-20 text-center animate-pulse text-zinc-500">
          Calculating financial metrics...
        </div>
      ) : report ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportStatCard
              title="Total Income"
              value={`$${report.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={DollarSign}
              description="Gross revenue from sales"
            />
            <ReportStatCard
              title="Cost of Goods Sold"
              value={`$${report.costOfGoodsSold.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={Receipt}
              description="Total item costs"
              trend={{
                value: -((report.costOfGoodsSold / (report.totalIncome || 1)) * 100),
                label: "% of Income",
              }}
            />
            <ReportStatCard
              title="Gross Profit"
              value={`$${report.grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={TrendingUp}
              description="Income - COGS"
              trend={{ value: report.grossMarginPercent, label: "Margin" }}
            />
            <ReportStatCard
              title="Net Profit"
              value={`$${report.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={report.netProfit >= 0 ? TrendingUp : TrendingDown}
              description="Final profit after expenses"
              trend={{ value: report.netMarginPercent, label: "Margin" }}
              className={report.netProfit < 0 ? "border-rose-500/50" : "border-emerald-500/50"}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Income vs Expenses Trend</CardTitle>
                <CardDescription>
                  Monthly progression of revenue compared to actual costs + expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={report.monthlyBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                    <XAxis
                      dataKey="month"
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
                      contentStyle={{ borderRadius: "8px", border: "none" }}
                      formatter={(value: any) =>
                        `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line
                      type="monotone"
                      dataKey="income"
                      name="Income"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cogs"
                      name="COGS"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Net Profit Analysis</CardTitle>
                <CardDescription>Monthly absolute earnings after all deductions</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={report.monthlyBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                    <XAxis
                      dataKey="month"
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
                      cursor={{ fill: "transparent" }}
                      contentStyle={{ borderRadius: "8px", border: "none" }}
                      formatter={(value: any) =>
                        `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Bar name="Net Profit" dataKey="netProfit" radius={[4, 4, 0, 0]}>
                      {report.monthlyBreakdown.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.netProfit >= 0 ? "#10b981" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>Detailed tabular view of monthly earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">COGS</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.monthlyBreakdown.map((row: any) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month}</TableCell>
                      <TableCell className="text-right">
                        ${row.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-amber-600">
                        ${row.cogs.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-rose-600">
                        ${row.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${row.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                      >
                        ${row.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                  {report.monthlyBreakdown.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-zinc-500">
                        No financial data available in this date range.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
