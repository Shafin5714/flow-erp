"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNTS, GET_TRANSACTIONS } from "@/lib/graphql/accounts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays, format, startOfDay, endOfDay, eachDayOfInterval } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Landmark,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Wallet,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

interface DashboardAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface DashboardTransaction {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
}

export default function AccountDashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: accountsData, loading: accountsLoading } = useQuery(GET_ACCOUNTS, {
    fetchPolicy: "network-only",
  });

  const {
    data: txData,
    loading: txLoading,
    refetch: refetchTx,
  } = useQuery(GET_TRANSACTIONS, {
    variables: {
      startDate: dateRange?.from ? startOfDay(dateRange.from).toISOString() : undefined,
      endDate: dateRange?.to ? endOfDay(dateRange.to).toISOString() : undefined,
    },
    fetchPolicy: "network-only",
  });

  const loading = accountsLoading || txLoading;

  const accounts = useMemo(() => accountsData?.accounts || [], [accountsData]);
  const transactions = useMemo(() => txData?.transactions || [], [txData]);

  const overviewStats = useMemo(() => {
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalCash = 0;
    let totalBank = 0;

    accounts.forEach((acc: DashboardAccount) => {
      if (acc.type === "CASH") {
        totalAssets += acc.balance;
        totalCash += acc.balance;
      }
      if (acc.type === "BANK") {
        totalAssets += acc.balance;
        totalBank += acc.balance;
      }
      if (acc.type === "LOAN") totalLiabilities += acc.balance;
    });

    let periodIncome = 0;
    let periodExpense = 0;

    transactions.forEach((tx: DashboardTransaction) => {
      if (tx.type === "INCOME") periodIncome += tx.amount;
      if (tx.type === "EXPENSE") periodExpense += tx.amount;
    });

    return { totalAssets, totalLiabilities, totalCash, totalBank, periodIncome, periodExpense };
  }, [accounts, transactions]);

  const barChartData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    // Initialize all days in the range to 0 to prevent gaps
    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    const dataMap = new Map();

    days.forEach((day) => {
      dataMap.set(format(day, "MMM dd"), { date: format(day, "MMM dd"), income: 0, expense: 0 });
    });

    transactions.forEach((tx: DashboardTransaction) => {
      const dateStr = format(new Date(tx.createdAt), "MMM dd");
      if (dataMap.has(dateStr)) {
        const item = dataMap.get(dateStr);
        if (tx.type === "INCOME") item.income += tx.amount;
        if (tx.type === "EXPENSE") item.expense += tx.amount;
      }
    });

    return Array.from(dataMap.values());
  }, [transactions, dateRange]);

  const pieChartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    accounts.forEach((acc: DashboardAccount) => {
      if ((acc.type === "CASH" || acc.type === "BANK") && acc.balance > 0) {
        dataMap.set(acc.name, (dataMap.get(acc.name) || 0) + acc.balance);
      }
    });
    return Array.from(dataMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 accounts
  }, [accounts]);

  return (
    <div className="w-full min-w-0 space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight truncate">Financial Dashboard</h1>
          <p className="text-muted-foreground truncate">
            Overview of your financial performance, assets, and liabilities.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <CalendarDateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetchTx()}
            disabled={loading}
            className="rounded-full shadow-sm shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {loading && accounts.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground">
                      Total Assets
                    </p>
                    <p className="text-2xl font-black mt-1 text-emerald-600 dark:text-emerald-400 truncate">
                      $
                      {overviewStats.totalAssets.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl shrink-0">
                    <Landmark className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground">
                      Total Liabilities
                    </p>
                    <p className="text-2xl font-black mt-1 text-amber-600 dark:text-amber-400 truncate">
                      $
                      {overviewStats.totalLiabilities.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-500/10 rounded-2xl shrink-0">
                    <CreditCard className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground">
                      Period Income
                    </p>
                    <p className="text-2xl font-black mt-1 text-blue-600 dark:text-blue-400 truncate">
                      $
                      {overviewStats.periodIncome.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl shrink-0">
                    <ArrowUpRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase font-bold text-muted-foreground">
                      Period Expenses
                    </p>
                    <p className="text-2xl font-black mt-1 text-destructive truncate">
                      $
                      {overviewStats.periodExpense.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-2xl shrink-0">
                    <ArrowDownRight className="h-6 w-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-6">
            <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl overflow-hidden flex flex-col">
              <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <CardTitle className="text-lg">Income vs Expenses</CardTitle>
                <CardDescription>
                  Daily financial performance over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 min-h-[350px]">
                {barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#71717a" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#71717a" }}
                        tickFormatter={(value) => `$${value}`}
                        width={60}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e4e4e7",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value: string | number | (string | number)[] | undefined) => [
                          `$${Number(value).toLocaleString()}`,
                          undefined,
                        ]}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar
                        dataKey="income"
                        name="Income"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      />
                      <Bar
                        dataKey="expense"
                        name="Expense"
                        fill="#f43f5e"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <Activity className="h-10 w-10 opacity-20" />
                    <p>No transactions found for this period.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 rounded-2xl overflow-hidden flex flex-col">
              <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <CardTitle className="text-lg">Asset Distribution</CardTitle>
                <CardDescription>Breakdown of top Cash & Bank balances</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 min-h-[350px]">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: string | number | (string | number)[] | undefined) => [
                          `$${Number(value).toLocaleString()}`,
                          undefined,
                        ]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e4e4e7",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend
                        layout="vertical"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: "20px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <Wallet className="h-10 w-10 opacity-20" />
                    <p>No active liquid assets found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
