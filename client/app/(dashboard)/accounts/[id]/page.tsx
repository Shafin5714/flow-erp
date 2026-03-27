"use client";

import { useState, useMemo, use } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ACCOUNT, CREATE_TRANSACTION } from "@/lib/graphql/accounts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Landmark,
  Plus,
  RefreshCw,
  AlertCircle,
  FileText,
  Calendar,
  Printer,
} from "lucide-react";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  reference: string;
  createdAt: string;
  customer?: { id: string; name: string };
  vendor?: { id: string; name: string };
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  createdAt: string;
  transactions: Transaction[];
}

export default function AccountLedgerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const accountId = resolvedParams.id;
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery(GET_ACCOUNT, {
    variables: { id: accountId },
    fetchPolicy: "network-only",
  });

  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Transaction recorded successfully");
      setIsDialogOpen(false);
      setNewTransaction({ type: "EXPENSE", amount: 0, description: "", reference: "" });
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to record transaction");
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "EXPENSE",
    amount: 0,
    description: "",
    reference: "",
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const account = useMemo<Account | null>(() => data?.account || null, [data?.account]);

  // Filter by date and sort descending
  const filteredAndSortedTransactions = useMemo(() => {
    if (!account?.transactions) return [];
    let filtered = account.transactions;

    if (dateRange?.from) {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.createdAt);
        if (dateRange.to) {
          return txDate >= startOfDay(dateRange.from!) && txDate <= endOfDay(dateRange.to);
        }
        return txDate >= startOfDay(dateRange.from!);
      });
    }

    return filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [account, dateRange]);

  // Aggregate stats from filtered transactions
  const stats = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;

    filteredAndSortedTransactions.forEach((tx) => {
      if (["INCOME", "CAPITAL", "LOAN"].includes(tx.type)) {
        totalIn += tx.amount;
      } else {
        totalOut += tx.amount;
      }
    });

    return { totalIn, totalOut, count: filteredAndSortedTransactions.length };
  }, [filteredAndSortedTransactions]);

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.type || newTransaction.amount <= 0) {
      toast.error("Please provide a valid amount and type");
      return;
    }
    createTransaction({
      variables: {
        input: {
          accountId,
          type: newTransaction.type,
          amount: Number(newTransaction.amount),
          description: newTransaction.description,
          reference: newTransaction.reference,
        },
      },
    });
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "INCOME":
      case "CAPITAL":
      case "LOAN":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "EXPENSE":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  if (loading && !account) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="font-semibold text-destructive">{error?.message || "Account not found."}</p>
        <Button variant="outline" onClick={() => router.push("/accounts")}>
          Back to Accounts
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6 animate-in fade-in duration-500 pb-10 print:p-0 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
        <div className="min-w-0 flex-1 space-y-2">
          <Link
            href="/accounts"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors print:hidden"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight truncate">{account.name} Statement</h1>
            <Badge
              variant="outline"
              className="h-6 px-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border-none print:border-solid"
            >
              {account.type}
            </Badge>
          </div>
          <p className="text-muted-foreground truncate print:hidden">
            View transaction history and add manual entries for this account.
          </p>
          <p className="hidden print:block text-sm text-muted-foreground">
            Statement Period: {dateRange?.from ? format(dateRange.from, "PPP") : "Beginning"} -{" "}
            {dateRange?.to ? format(dateRange.to, "PPP") : "Present"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0 print:hidden">
          <Button
            variant="outline"
            className="shadow-sm transition-all"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={loading}
            className="rounded-full h-11 w-11 shadow-sm transition-all hover:rotate-180 duration-500 shrink-0"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="rounded-full shadow-lg px-6 h-11 w-full sm:w-auto bg-primary hover:scale-105 transition-transform duration-200"
              >
                <Plus className="mr-2 h-5 w-5 shrink-0" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription>
                  Manually record a transaction for {account.name}.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTransaction} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Transaction Type <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(val) => setNewTransaction({ ...newTransaction, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* For CASH/BANK typically it's INCOME/EXPENSE. LOAN/CAPITAL has other meanings. */}
                      <SelectItem value="INCOME">Income / Money In</SelectItem>
                      <SelectItem value="EXPENSE">Expense / Money Out</SelectItem>
                      <SelectItem value="CAPITAL">Capital Injection</SelectItem>
                      <SelectItem value="LOAN">Loan Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={newTransaction.amount || ""}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reference" className="text-sm font-medium">
                    Reference / Receipt No.
                  </label>
                  <Input
                    id="reference"
                    placeholder="e.g. REC-2023-001"
                    value={newTransaction.reference}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, reference: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="What was this transaction for?"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, description: e.target.value })
                    }
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? "Saving..." : "Save Transaction"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {[
          {
            title: "Current Balance",
            value: `$${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: Landmark,
            color: account.balance < 0 ? "destructive" : "emerald",
            accent: account.balance < 0 ? "bg-destructive" : "bg-emerald-500",
            lightBg: account.balance < 0 ? "bg-destructive/10" : "bg-emerald-500/10",
            darkBg: account.balance < 0 ? "dark:bg-destructive/20" : "dark:bg-emerald-500/20",
          },
          {
            title: "Total In (All Time)",
            value: `$${stats.totalIn.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: ArrowDownToLine,
            color: "blue",
            accent: "bg-blue-500",
            lightBg: "bg-blue-500/10",
            darkBg: "dark:bg-blue-500/20",
          },
          {
            title: "Total Out (All Time)",
            value: `$${stats.totalOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: ArrowUpFromLine,
            color: "amber",
            accent: "bg-amber-500",
            lightBg: "bg-amber-500/10",
            darkBg: "dark:bg-amber-500/20",
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
              <div className="flex items-center justify-between gap-2 overflow-hidden">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 truncate">
                    {stat.title}
                  </p>
                  <p
                    className={cn(
                      "text-xl font-black mt-0.5 tracking-tight truncate",
                      stat.color === "destructive" ? "text-destructive" : "text-foreground"
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm shrink-0",
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

      <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-950 w-full mt-6 print:border-none print:shadow-none print:mt-2">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col md:flex-row justify-between md:items-center gap-4 print:bg-transparent print:px-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground print:hidden" />
            Transaction Ledger
          </h2>
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <CalendarDateRangePicker date={dateRange} onDateChange={setDateRange} />
            <Badge variant="secondary" className="w-fit">
              {stats.count} Transactions
            </Badge>
          </div>
        </div>

        <div className="p-0">
          {filteredAndSortedTransactions.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <FileText className="h-8 w-8 text-zinc-400" />
              </div>
              <p className="text-muted-foreground px-4 text-center">
                No transactions recorded yet.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                <thead className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-zinc-500 w-[30%]">
                      Details
                    </th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                      Entity
                    </th>
                    <th className="px-6 py-4 text-[11px] uppercase tracking-widest font-bold text-zinc-500 text-right whitespace-nowrap">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredAndSortedTransactions.map((tx) => {
                    const isIn = ["INCOME", "CAPITAL", "LOAN"].includes(tx.type);
                    return (
                      <tr
                        key={tx.id}
                        className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{format(new Date(tx.createdAt), "MMM d, yyyy h:mm a")}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={cn("text-xs px-2.5 py-0.5", getTransactionColor(tx.type))}
                          >
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight min-w-[200px]">
                              {tx.description || "—"}
                            </span>
                            {tx.reference && (
                              <span className="text-xs font-mono text-muted-foreground">
                                Ref: {tx.reference}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tx.customer ? (
                            <span className="text-sm font-medium">
                              Customer: {tx.customer.name}
                            </span>
                          ) : tx.vendor ? (
                            <span className="text-sm font-medium">Vendor: {tx.vendor.name}</span>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={cn(
                              "font-bold text-base",
                              isIn ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                            )}
                          >
                            {isIn ? "+" : "-"}$
                            {Math.abs(tx.amount).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
