"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const data = [
  { name: "Jan", sales: 4000, inventory: 2400 },
  { name: "Feb", sales: 3000, inventory: 1398 },
  { name: "Mar", sales: 2000, inventory: 9800 },
  { name: "Apr", sales: 2780, inventory: 3908 },
  { name: "May", sales: 1890, inventory: 4800 },
  { name: "Jun", sales: 2390, inventory: 3800 },
  { name: "Jul", sales: 3490, inventory: 4300 },
  { name: "Aug", sales: 5000, inventory: 2400 },
  { name: "Sep", sales: 6500, inventory: 1398 },
  { name: "Oct", sales: 8000, inventory: 9800 },
  { name: "Nov", sales: 9500, inventory: 3908 },
  { name: "Dec", sales: 11000, inventory: 4800 },
];

export function Overview() {
  const { theme } = useTheme();

  return (
    <Card className="col-span-4 border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Inventory vs Sales Volume</CardTitle>
          <CardDescription>Monthly performance overview</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
          Last 30 Days <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
        </Button>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d7ff2" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d7ff2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme === "dark" ? "#333" : "#e5e5e5"}
            />
            <XAxis
              dataKey="name"
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
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#000" : "#fff",
                borderRadius: "8px",
                border: theme === "dark" ? "1px solid #333" : "1px solid #e5e5e5",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{
                fontSize: "12px",
                fontWeight: 500,
              }}
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

            <Line
              type="monotone"
              dataKey="inventory"
              name="Inventory Level"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6, fill: "#94a3b8", strokeWidth: 0 }}
            />

            <Line
              type="monotone"
              dataKey="sales"
              name="Sales Volume"
              stroke="#0d7ff2"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, fill: "#0d7ff2", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
