"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_SALES } from "@/lib/graphql/sales";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RefreshCw,
  AlertCircle,
  MoreHorizontal,
  Search,
  ShoppingCart,
  DollarSign,
  Eye,
} from "lucide-react";
import { Sale } from "@/lib/types";
import Link from "next/link";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SalesPage() {
  const { data, loading, error, refetch } = useQuery(GET_SALES, {
    fetchPolicy: "network-only",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const sales = useMemo<Sale[]>(() => data?.sales || [], [data?.sales]);

  const stats = useMemo(() => {
    const totalCount = sales.length;
    const totalAmount = sales.reduce((acc, p) => acc + p.total, 0);
    const totalPaid = sales.reduce((acc, p) => acc + p.paidAmount, 0);
    const totalDue = sales.reduce((acc, p) => acc + p.dueAmount, 0);
    return { totalCount, totalAmount, totalPaid, totalDue };
  }, [sales]);

  const filteredSales = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return sales.filter(
      (s) =>
        (s.customer?.name || "Walk-in Customer").toLowerCase().includes(searchLower) ||
        s.invoiceNumber.toLowerCase().includes(searchLower)
    );
  }, [sales, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales History</h1>
          <p className="text-muted-foreground">
            View and manage your sales orders and customer transactions.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={loading}
            className="rounded-full h-11 w-11 shadow-sm transition-all hover:rotate-180 duration-500"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/sales/pos" className="flex-1 md:flex-initial">
            <Button
              size="lg"
              className="rounded-full shadow-lg px-6 h-11 w-full bg-primary hover:scale-105 transition-transform duration-200"
            >
              <Plus className="mr-2 h-5 w-5" /> Open POS
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Sales",
            value: stats.totalCount,
            icon: ShoppingCart,
            color: "blue",
            accent: "bg-blue-500",
            lightBg: "bg-blue-500/10",
            darkBg: "dark:bg-blue-500/20",
          },
          {
            title: "Total Revenue",
            value: `$${stats.totalAmount.toLocaleString()}`,
            icon: DollarSign,
            color: "emerald",
            accent: "bg-emerald-500",
            lightBg: "bg-emerald-500/10",
            darkBg: "dark:bg-emerald-500/20",
          },
          {
            title: "Paid Amount",
            value: `$${stats.totalPaid.toLocaleString()}`,
            icon: DollarSign,
            color: "sky",
            accent: "bg-sky-500",
            lightBg: "bg-sky-500/10",
            darkBg: "dark:bg-sky-500/20",
          },
          {
            title: "Due Amount",
            value: `$${stats.totalDue.toLocaleString()}`,
            icon: AlertCircle,
            color: "destructive",
            accent: "bg-destructive",
            lightBg: "bg-destructive/10",
            darkBg: "dark:bg-destructive/20",
            valueColor: "text-destructive",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="group relative overflow-hidden border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-2xl"
          >
            <div
              className={cn(
                "absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                stat.accent
              )}
            />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
                    {stat.title}
                  </p>
                  <p
                    className={cn(
                      "text-xl font-black mt-0.5 tracking-tight transition-colors duration-300",
                      stat.valueColor || "text-foreground"
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm",
                    stat.lightBg,
                    stat.darkBg
                  )}
                >
                  <stat.icon
                    className={cn(
                      "h-5 w-5",
                      stat.color === "destructive" ? "text-destructive" : `text-${stat.color}-500`
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-950">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-shadow hover:ring-1 hover:ring-zinc-300 dark:hover:ring-zinc-700 focus-visible:ring-primary text-sm"
            />
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Loading sales...
              </p>
            </div>
          ) : error ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-6 text-center px-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <div className="max-w-xs">
                <p className="text-xl font-bold text-destructive">Connection Error</p>
                <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline" className="rounded-full px-8">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-6 text-center px-4">
              <div className="h-24 w-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Search className="h-12 w-12" />
              </div>
              <div className="max-w-xs">
                <p className="text-xl font-bold">No sales found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search to find what you&apos;re looking for.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[1000px]">
                <thead className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                      Date & Invoice
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                      Total
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                      Due
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                  {filteredSales.map((s) => (
                    <tr
                      key={s.id}
                      className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {format(new Date(s.createdAt), "MMM d, yyyy")}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            {s.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {s.customer ? s.customer.name : "Walk-in Customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          ${s.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">
                        ${s.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "font-medium",
                            s.dueAmount > 0 ? "text-destructive" : "text-muted-foreground"
                          )}
                        >
                          ${s.dueAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={cn(
                            "px-2.5 py-0.5 rounded-md border-none whitespace-nowrap text-xs font-medium",
                            s.dueAmount === 0
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : s.paidAmount > 0
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {s.dueAmount === 0 ? "Paid" : s.paidAmount > 0 ? "Partial" : "Unpaid"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <Link href={`/sales/${s.id}`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
