"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ACCOUNTS, CREATE_ACCOUNT } from "@/lib/graphql/accounts";
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
  Plus,
  Landmark,
  RefreshCw,
  Search,
  Wallet,
  PiggyBank,
  Building,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  createdAt: string;
}

export default function AccountsPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_ACCOUNTS, {
    fetchPolicy: "network-only",
  });

  const [createAccount, { loading: creating }] = useMutation(CREATE_ACCOUNT, {
    onCompleted: () => {
      toast.success("Account created successfully");
      setIsDialogOpen(false);
      setNewAccount({ name: "", type: "CASH", balance: 0 });
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create account");
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "CASH",
    balance: 0,
  });

  const accounts = useMemo<Account[]>(() => data?.accounts || [], [data?.accounts]);

  const stats = useMemo(() => {
    let totalBalance = 0;
    let cashBalance = 0;
    let bankBalance = 0;

    accounts.forEach((acc) => {
      if (acc.type === "CASH" || acc.type === "BANK") {
        totalBalance += acc.balance;
        if (acc.type === "CASH") cashBalance += acc.balance;
        if (acc.type === "BANK") bankBalance += acc.balance;
      } else if (acc.type === "LOAN") {
        // Loans might be liabilities depending on context, keeping simple
        totalBalance -= acc.balance;
      }
    });

    return { totalAccounts: accounts.length, cashBalance, bankBalance, totalBalance };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || acc.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [accounts, searchTerm, typeFilter]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name || !newAccount.type) {
      toast.error("Please fill in all required fields");
      return;
    }
    createAccount({
      variables: {
        input: {
          name: newAccount.name,
          type: newAccount.type,
          balance: Number(newAccount.balance),
        },
      },
    });
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <Wallet className="h-5 w-5" />;
      case "BANK":
        return <Building className="h-5 w-5" />;
      case "CAPITAL":
        return <PiggyBank className="h-5 w-5" />;
      case "LOAN":
        return <CreditCard className="h-5 w-5" />;
      default:
        return <Landmark className="h-5 w-5" />;
    }
  };

  const getAccountColor = (type: string) => {
    switch (type) {
      case "CASH":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "BANK":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "CAPITAL":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
      case "LOAN":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      default:
        return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight truncate">Chart of Accounts</h1>
          <p className="text-muted-foreground truncate">
            Manage your financial accounts and check their current balances.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
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
                <Plus className="mr-2 h-5 w-5 shrink-0" /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>
                  Add a new financial account to track your business transactions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAccount} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Account Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g. Main Cash, City Bank Checking"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Account Type <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={newAccount.type}
                    onValueChange={(val) => setNewAccount({ ...newAccount, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="BANK">Bank</SelectItem>
                      <SelectItem value="CAPITAL">Capital / Equity</SelectItem>
                      <SelectItem value="LOAN">Loan / Liability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="balance" className="text-sm font-medium">
                    Opening Balance
                  </label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newAccount.balance || ""}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Initial balance at the time of account creation.
                  </p>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Save Account"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[
          {
            title: "Total Liquid Assets",
            value: `$${stats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: Landmark,
            color: "blue",
            accent: "bg-blue-500",
            lightBg: "bg-blue-500/10",
            darkBg: "dark:bg-blue-500/20",
          },
          {
            title: "Cash Balance",
            value: `$${stats.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: Wallet,
            color: "emerald",
            accent: "bg-emerald-500",
            lightBg: "bg-emerald-500/10",
            darkBg: "dark:bg-emerald-500/20",
          },
          {
            title: "Bank Balance",
            value: `$${stats.bankBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: Building,
            color: "blue",
            accent: "bg-blue-500",
            lightBg: "bg-blue-500/10",
            darkBg: "dark:bg-blue-500/20",
          },
          {
            title: "Total Accounts",
            value: stats.totalAccounts,
            icon: PiggyBank,
            color: "purple",
            accent: "bg-purple-500",
            lightBg: "bg-purple-500/10",
            darkBg: "dark:bg-purple-500/20",
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
                  <p className="text-xl font-black mt-0.5 tracking-tight text-foreground truncate">
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
                  <stat.icon className={cn("h-5 w-5", `text-${stat.color}-500`)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-950 w-full">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-white dark:bg-zinc-900 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="max-w-[180px] w-full sm:w-[180px] h-10 rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="BANK">Bank</SelectItem>
                  <SelectItem value="CAPITAL">Capital</SelectItem>
                  <SelectItem value="LOAN">Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="font-semibold text-destructive">Error loading accounts</p>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Landmark className="h-8 w-8 text-zinc-400" />
              </div>
              <p className="text-muted-foreground px-4 text-center">No accounts found.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                <thead className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                      Type
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 whitespace-nowrap">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hidden md:table-cell whitespace-nowrap">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer"
                      onClick={() => router.push(`/accounts/${account.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-10 w-10 flex shrink-0 items-center justify-center rounded-xl",
                              getAccountColor(account.type)
                            )}
                          >
                            {getAccountIcon(account.type)}
                          </div>
                          <span className="font-semibold text-sm">{account.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className={cn("border-none px-2 py-1", getAccountColor(account.type))}
                        >
                          {account.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "font-bold text-sm",
                            account.balance < 0 ? "text-destructive" : ""
                          )}
                        >
                          ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell whitespace-nowrap">
                        <span className="text-muted-foreground text-[13px]">
                          {format(new Date(account.createdAt), "MMM d, yyyy")}
                        </span>
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
