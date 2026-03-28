/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_INVENTORY_REPORT } from "@/lib/graphql/reports";
import { ReportFilters } from "@/components/reports/report-filters";
import { ReportStatCard } from "@/components/reports/report-stat-card";
import { BarChart2, PackageSearch, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
import { Badge } from "@/components/ui/badge";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function InventoryReportPage() {
  const { data, loading, error } = useQuery(GET_INVENTORY_REPORT, {
    variables: {
      categoryId: null,
      brandId: null,
    },
  });

  const report = data?.inventoryReport;

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
            Inventory Valuation
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time snapshot of stock value, retail potential, and alerts
          </p>
        </div>
      </div>

      <ReportFilters showDateRange={false} />

      {loading ? (
        <div className="py-20 text-center animate-pulse text-zinc-500">
          Loading inventory data...
        </div>
      ) : report ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportStatCard
              title="Total Cost Value"
              value={`$${report.totalCostValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={PackageSearch}
              description={`${report.totalStock} total items in stock`}
            />
            <ReportStatCard
              title="Total Retail Value"
              value={`$${report.totalRetailValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={BarChart2}
              description="Expected revenue if all sold"
            />
            <ReportStatCard
              title="Potential Profit"
              value={`$${report.totalPotentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={ArrowUpRight}
              description="Estimated gross margin"
              trend={{
                value:
                  report.totalCostValue > 0
                    ? Number(
                        ((report.totalPotentialProfit / report.totalCostValue) * 100).toFixed(1)
                      )
                    : 0,
                label: "ROI",
              }}
            />
            <ReportStatCard
              title="Low Stock Alerts"
              value={report.lowStockCount.toLocaleString()}
              icon={AlertTriangle}
              description={`${report.outOfStockCount} items completely out of stock`}
              className={report.lowStockCount > 0 ? "border-amber-500/50" : ""}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Valuation by Category</CardTitle>
                <CardDescription>Cost vs Retail Value across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={report.categoryBreakdown}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                    <XAxis
                      dataKey="categoryName"
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
                      formatter={(value: number) =>
                        `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar
                      name="Cost Value"
                      dataKey="totalCostValue"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      name="Retail Value"
                      dataKey="totalRetailValue"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle>Stock Distribution</CardTitle>
                <CardDescription>Number of items heavily stocked by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={report.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="totalStock"
                      nameKey="categoryName"
                    >
                      {report.categoryBreakdown.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} items`} />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle>Critical Inventory Items</CardTitle>
              <CardDescription>Items that are low on stock or have high valuation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Cost Price</TableHead>
                    <TableHead className="text-right">Retail Value</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.items.map((item: any) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">
                          {item.productName}
                        </div>
                        <div className="text-xs text-zinc-500">{item.sku}</div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right font-medium">{item.stock}</TableCell>
                      <TableCell className="text-right">
                        ${item.costPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">
                        ${item.retailValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.stock === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : item.isLowStock ? (
                          <Badge
                            variant="outline"
                            className="text-amber-600 border-amber-600 bg-amber-50 dark:bg-amber-950"
                          >
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                            Healthy
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {report.items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-zinc-500">
                        No inventory data available
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
