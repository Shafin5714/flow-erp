"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_VENDOR } from "@/lib/graphql/vendors";
import { GET_ACCOUNTS, CREATE_TRANSACTION } from "@/lib/graphql/accounts";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  ArrowLeft,
  Truck,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  AlertCircle,
  CreditCard,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type definitions for this page
interface Purchase {
  id: string;
  subtotal: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
}

interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number;
  createdAt: string;
  purchases: Purchase[];
  transactions: Transaction[];
}

interface Account {
  id: string;
  name: string;
  balance: number;
}

export default function VendorDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"purchases" | "transactions">("purchases");
  const [paymentOpen, setPaymentOpen] = useState(false);

  // Payment Form State
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [reference, setReference] = useState("");

  const { data, loading, error, refetch } = useQuery<{ vendor: Vendor }>(GET_VENDOR, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const { data: accountsData } = useQuery<{ accounts: Account[] }>(GET_ACCOUNTS, {
    fetchPolicy: "cache-first",
  });

  const [createTransaction, { loading: paying }] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Payment recorded successfully");
      setPaymentOpen(false);
      setAmount("");
      setAccountId("");
      setReference("");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to record payment");
    },
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.vendor) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="font-semibold text-destructive">Failed to load vendor</p>
        <Button onClick={() => router.push("/purchases/vendors")} variant="outline">
          Back to Vendors
        </Button>
      </div>
    );
  }

  const vendor = data.vendor;
  const accounts = accountsData?.accounts || [];

  const handlePayment = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!accountId) {
      toast.error("Select an account to pay from");
      return;
    }

    createTransaction({
      variables: {
        input: {
          accountId,
          type: "EXPENSE", // Payment to vendor is an expense from our account
          amount: Number(amount),
          description: `Payment to ${vendor.name}`,
          reference,
          vendorId: vendor.id,
        },
      },
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Truck className="h-4 w-4" /> Vendor Details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Vendor Info Card */}
        <div className="col-span-1 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-6 shadow-sm flex flex-col h-full space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{vendor.name}</h2>
              <p className="text-sm text-muted-foreground">ID: {vendor.id.slice(0, 8)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-zinc-200 dark:border-zinc-800 pb-2">
              Contact Information
            </h3>
            <div className="flex items-start gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className={vendor.email ? "" : "text-muted-foreground italic"}>
                {vendor.email || "No email provided"}
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className={vendor.phone ? "" : "text-muted-foreground italic"}>
                {vendor.phone || "No phone provided"}
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className={vendor.address ? "" : "text-muted-foreground italic"}>
                {vendor.address || "No address provided"}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 flex items-center justify-between border border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Outstanding Balance</p>
                <p
                  className={`text-2xl font-bold ${vendor.balance > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-500"}`}
                >
                  ${vendor.balance.toFixed(2)}
                </p>
              </div>

              <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                <DialogTrigger asChild>
                  <Button className="shrink-0" disabled={vendor.balance <= 0}>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                      Record a payment made to {vendor.name}. This will decrease their outstanding
                      balance.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        max={vendor.balance}
                      />
                      <p className="text-xs text-muted-foreground">
                        Max due: ${vendor.balance.toFixed(2)}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="account">Pay From Account</Label>
                      <Select value={accountId} onValueChange={setAccountId}>
                        <SelectTrigger id="account">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((acc) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.name} (${acc.balance.toFixed(2)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reference">Reference (Optional)</Label>
                      <Input
                        id="reference"
                        placeholder="Cheque #, Transaction ID, etc."
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPaymentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handlePayment} disabled={paying}>
                      {paying && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Payment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* History Tabs */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab("purchases")}
              className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === "purchases" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <FileText className="inline-block mr-2 h-4 w-4 mb-0.5" />
              Purchase History
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === "transactions" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <DollarSign className="inline-block mr-2 h-4 w-4 mb-0.5" />
              Payment History
            </button>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
            {activeTab === "purchases" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Total</th>
                      <th className="px-6 py-3 text-right">Paid</th>
                      <th className="px-6 py-3 text-right">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {vendor.purchases.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          No purchases recorded for this vendor.
                        </td>
                      </tr>
                    ) : (
                      vendor.purchases.map((purchase) => (
                        <tr
                          key={purchase.id}
                          className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                        >
                          <td className="px-6 py-3">
                            <Link
                              href={`/purchases/${purchase.id}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {purchase.id.slice(0, 8).toUpperCase()}
                            </Link>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />
                              {format(new Date(parseInt(purchase.createdAt)), "MMM d, yyyy")}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-right font-medium">
                            ${purchase.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-3 text-right text-emerald-600 dark:text-emerald-500">
                            ${purchase.paidAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-3 text-right text-destructive">
                            ${purchase.dueAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-6 py-3">Ref/ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {!vendor.transactions || vendor.transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                          No payment transactions recorded for this vendor.
                        </td>
                      </tr>
                    ) : (
                      vendor.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                          <td className="px-6 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                            {tx.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />
                              {tx.createdAt
                                ? format(new Date(parseInt(tx.createdAt)), "MMM d, yyyy")
                                : "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === "INCOME" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`}
                            >
                              {tx.type === "INCOME" ? "Refund" : "Payment"}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right font-medium">
                            ${tx.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
