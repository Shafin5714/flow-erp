"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MonthlyStat {
  month: string;
  sales: number;
  purchases: number;
}

interface OverviewProps {
  monthlyStats: MonthlyStat[];
  loading: boolean;
}

export function Overview({ monthlyStats, loading }: OverviewProps) {
  const { theme } = useTheme();

  return (
    <Card className="col-span-4 border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Sales vs Purchases</CardTitle>
          <CardDescription>Monthly overview (last 12 months)</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <Skeleton className="h-[300px] w-full mx-6" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={theme === "dark" ? "#333" : "#e5e5e5"}
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#0a0a0a" : "#fff",
                  borderRadius: "8px",
                  border: theme === "dark" ? "1px solid #333" : "1px solid #e5e5e5",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number | undefined) => [
                  `$${(value ?? 0).toLocaleString()}`,
                  undefined,
                ]}
                itemStyle={{ fontSize: "12px", fontWeight: 500 }}
                labelStyle={{
                  fontSize: "12px",
                  color: "#888888",
                  marginBottom: "4px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm font-medium ml-1 text-slate-600 dark:text-slate-300">
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="sales" name="Sales" fill="#0d7ff2" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar
                dataKey="purchases"
                name="Purchases"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
