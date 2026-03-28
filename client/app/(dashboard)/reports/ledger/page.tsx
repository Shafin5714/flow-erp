/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@apollo/client";
import { GET_LEDGER_REPORT } from "@/lib/graphql/reports";
import { ReportStatCard } from "@/components/reports/report-stat-card";
import { Users, Truck, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function LedgerReportPage() {
  const { data, loading, error } = useQuery(GET_LEDGER_REPORT);

  const report = data?.ledgerReport;

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
            Customer & Vendor Ledger
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Track outstanding balances, transaction history, and payment status
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-zinc-500">Loading ledger data...</div>
      ) : report ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <ReportStatCard
              title="Total Cust. Outstanding"
              value={`$${report.totalCustomerOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={Users}
              description="Unpaid customer balances"
              className={report.totalCustomerOutstanding > 0 ? "border-amber-500/50" : ""}
            />
            <ReportStatCard
              title="Total Ven. Outstanding"
              value={`$${report.totalVendorOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={Truck}
              description="Payable to vendors"
              className={report.totalVendorOutstanding > 0 ? "border-rose-500/50" : ""}
            />
            <ReportStatCard
              title="Active Customers"
              value={report.customers.length.toLocaleString()}
              icon={Users}
              description="Total customer profiles"
            />
            <ReportStatCard
              title="Active Vendors"
              value={report.vendors.length.toLocaleString()}
              icon={Truck}
              description="Total vendor profiles"
            />
          </div>

          <Tabs defaultValue="customers" className="space-y-4">
            <TabsList className="bg-zinc-100 dark:bg-zinc-900">
              <TabsTrigger
                value="customers"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950"
              >
                Customer Ledger
              </TabsTrigger>
              <TabsTrigger
                value="vendors"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950"
              >
                Vendor Ledger
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customers" className="space-y-4">
              <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Customer Outstanding Balances</CardTitle>
                  <CardDescription>Accounts receivable track record</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Total Purchases</TableHead>
                        <TableHead className="text-right">Total Paid</TableHead>
                        <TableHead className="text-right">Due Balance</TableHead>
                        <TableHead className="text-right">Last Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.customers.map((c: any) => (
                        <TableRow key={c.customerId}>
                          <TableCell>
                            <div className="font-medium text-zinc-900 dark:text-zinc-50">
                              {c.customerName}
                            </div>
                            <div className="text-xs text-zinc-500">{c.saleCount} invoices</div>
                          </TableCell>
                          <TableCell className="text-zinc-500">{c.phone}</TableCell>
                          <TableCell className="text-right">
                            $
                            {c.totalPurchases.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-right text-emerald-600">
                            ${c.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {c.outstandingBalance > 0 ? (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-600 bg-amber-50 dark:bg-amber-950 ml-2"
                              >
                                $
                                {c.outstandingBalance.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </Badge>
                            ) : (
                              <span className="text-zinc-500">Settled</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-zinc-500 whitespace-nowrap">
                            {c.lastPurchaseDate ? (
                              <div className="flex items-center justify-end gap-1 text-xs">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(c.lastPurchaseDate), "MMM d, yyyy")}
                              </div>
                            ) : (
                              "Never"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {report.customers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-zinc-500">
                            No customer records found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vendors" className="space-y-4">
              <Card className="shadow-sm border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>Vendor Outstanding Balances</CardTitle>
                  <CardDescription>Accounts payable track record</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Total Purchases</TableHead>
                        <TableHead className="text-right">Total Paid</TableHead>
                        <TableHead className="text-right">Due Balance</TableHead>
                        <TableHead className="text-right">Last Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.vendors.map((v: any) => (
                        <TableRow key={v.vendorId}>
                          <TableCell>
                            <div className="font-medium text-zinc-900 dark:text-zinc-50">
                              {v.vendorName}
                            </div>
                            <div className="text-xs text-zinc-500">{v.purchaseCount} POs</div>
                          </TableCell>
                          <TableCell className="text-zinc-500">{v.phone}</TableCell>
                          <TableCell className="text-right">
                            $
                            {v.totalPurchases.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-right text-emerald-600">
                            ${v.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {v.outstandingBalance > 0 ? (
                              <Badge
                                variant="outline"
                                className="text-rose-600 border-rose-600 bg-rose-50 dark:bg-rose-950 ml-2"
                              >
                                $
                                {v.outstandingBalance.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </Badge>
                            ) : (
                              <span className="text-zinc-500">Settled</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-zinc-500 whitespace-nowrap">
                            {v.lastPurchaseDate ? (
                              <div className="flex items-center justify-end gap-1 text-xs">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(v.lastPurchaseDate), "MMM d, yyyy")}
                              </div>
                            ) : (
                              "Never"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {report.vendors.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-zinc-500">
                            No vendor records found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}
