"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CUSTOMER, DELETE_CUSTOMER } from "@/lib/graphql/customers";
import { GET_ACCOUNTS, CREATE_TRANSACTION } from "@/lib/graphql/accounts";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  AlertCircle,
  RefreshCw,
  Wallet,
  ReceiptText,
  CreditCard,
  Building,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, Account } from "@/lib/types";
import { format } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    accountId: "",
    amount: "",
    reference: "",
    description: "Customer Payment",
  });

  const { data, loading, error, refetch } = useQuery<{ customer: Customer }>(GET_CUSTOMER, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const { data: accountsData } = useQuery<{ accounts: Account[] }>(GET_ACCOUNTS, {
    fetchPolicy: "cache-first",
  });

  const [deleteCustomer, { loading: deleting }] = useMutation(DELETE_CUSTOMER, {
    onCompleted: () => {
      toast.success("Customer deleted successfully");
      router.push("/customers");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete customer");
    },
  });

  const [createTransaction, { loading: paying }] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Payment recorded successfully");
      setPaymentDialogOpen(false);
      setPaymentForm({
        accountId: "",
        amount: "",
        reference: "",
        description: "Customer Payment",
      });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record payment");
    },
  });

  if (loading && !data) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading customer details...</p>
      </div>
    );
  }

  if (error || !data?.customer) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-destructive">Customer Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            {error?.message ||
              "The customer you are looking for does not exist or has been removed."}
          </p>
        </div>
        <Button onClick={() => router.push("/customers")} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </Button>
      </div>
    );
  }

  const customer = data.customer;
  const sales = customer.sales || [];
  const transactions = customer.transactions || [];
  const accounts = accountsData?.accounts || [];

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPaid = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);
  const totalDue = customer.balance;

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${customer.name}? This action cannot be undone.`
      )
    ) {
      deleteCustomer({ variables: { id: customer.id } });
    }
  };

  const handleRecordPayment = () => {
    if (!paymentForm.accountId || !paymentForm.amount) {
      toast.error("Account and amount are required");
      return;
    }

    const amount = parseFloat(paymentForm.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    createTransaction({
      variables: {
        input: {
          accountId: paymentForm.accountId,
          type: "INCOME",
          amount,
          description: paymentForm.description,
          reference: paymentForm.reference || null,
          customerId: customer.id,
        },
      },
    });
  };

  // Sort by newest first
  const sortedSales = [...sales].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/customers")}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {totalDue > 0 && (
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CreditCard className="mr-2 h-4 w-4" /> Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record Payment for {customer.name}</DialogTitle>
                  <DialogDescription>
                    Current outstanding balance is{" "}
                    <span className="font-semibold text-emerald-600">${totalDue.toFixed(2)}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="account">
                      Deposit To Account <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={paymentForm.accountId}
                      onValueChange={(val) => setPaymentForm({ ...paymentForm, accountId: val })}
                    >
                      <SelectTrigger id="account">
                        <SelectValue placeholder="Select an account" />
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
                    <Label htmlFor="amount">
                      Amount <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      placeholder={`0.00 (Max: ${totalDue.toFixed(2)})`}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reference">Reference / Check #</Label>
                    <Input
                      id="reference"
                      value={paymentForm.reference}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, reference: e.target.value })
                      }
                      placeholder="Optional reference"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Memo)</Label>
                    <Input
                      id="description"
                      value={paymentForm.description}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRecordPayment}
                    disabled={paying || !paymentForm.accountId || !paymentForm.amount}
                  >
                    {paying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete Customer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" /> Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Email
                </p>
                <p className="truncate text-zinc-900 dark:text-zinc-100">
                  {customer.email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Phone
                </p>
                <p className="text-zinc-900 dark:text-zinc-100">
                  {customer.phone || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Address
                </p>
                <p className="text-zinc-900 dark:text-zinc-100 leading-tight">
                  {customer.address || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Customer Since
                </p>
                <p className="text-zinc-900 dark:text-zinc-100">
                  {format(new Date(customer.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="border-emerald-200 dark:border-emerald-900/50 shadow-sm relative overflow-hidden bg-linear-to-br from-white to-emerald-50/50 dark:from-zinc-950 dark:to-emerald-950/20">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Wallet className="h-16 w-16 text-emerald-600" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-500">
                Outstanding Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                ${totalDue.toFixed(2)}
              </div>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1">
                Amount to be collected
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900/50 shadow-sm relative overflow-hidden bg-linear-to-br from-white to-blue-50/50 dark:from-zinc-950 dark:to-blue-950/20">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <ReceiptText className="h-16 w-16 text-blue-600" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-500">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                ${totalSales.toFixed(2)}
              </div>
              <p className="text-xs text-blue-600/80 dark:text-blue-500/80 mt-1">
                From {sales.length} invoices
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 dark:border-indigo-900/50 shadow-sm relative overflow-hidden bg-linear-to-br from-white to-indigo-50/50 dark:from-zinc-950 dark:to-indigo-950/20">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <CreditCard className="h-16 w-16 text-indigo-600" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-indigo-600 dark:text-indigo-500">
                Total Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                ${totalPaid.toFixed(2)}
              </div>
              <p className="text-xs text-indigo-600/80 dark:text-indigo-500/80 mt-1">
                Payments received
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Log</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 py-4">
              <CardTitle className="text-lg">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sortedSales.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <ReceiptText className="h-10 w-10 mb-3 opacity-20" />
                  <p>No sales history found for this customer.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <div className="hidden md:flex items-center px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50/30 dark:bg-zinc-900/30">
                    <div className="w-[20%]">Date</div>
                    <div className="w-[20%]">Invoice #</div>
                    <div className="w-[15%]">Mode</div>
                    <div className="w-[15%] text-right">Total</div>
                    <div className="w-[15%] text-right">Paid</div>
                    <div className="w-[15%] text-right">Status</div>
                  </div>
                  {sortedSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="w-full md:w-[20%] flex items-center gap-2 mb-1 md:mb-0 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0 opacity-70" />
                        {format(new Date(sale.createdAt), "MMM d, yyyy")}
                      </div>
                      <div
                        className="w-full md:w-[20%] font-medium mb-1 md:mb-0 cursor-pointer hover:underline text-primary"
                        onClick={() => router.push(`/sales/${sale.id}`)}
                      >
                        {sale.invoiceNumber}
                      </div>
                      <div className="w-full md:w-[15%] mb-2 md:mb-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300`}
                        >
                          {sale.paymentMode}
                        </span>
                      </div>
                      <div className="w-full md:w-[15%] md:text-right font-medium text-zinc-900 dark:text-zinc-100 mb-1 md:mb-0 flex justify-between md:block">
                        <span className="md:hidden text-muted-foreground">Total:</span>$
                        {sale.total.toFixed(2)}
                      </div>
                      <div className="w-full md:w-[15%] md:text-right text-muted-foreground flex justify-between md:block mb-1 md:mb-0">
                        <span className="md:hidden">Paid:</span>${sale.paidAmount.toFixed(2)}
                      </div>
                      <div className="w-full md:w-[15%] md:text-right flex justify-between md:block">
                        <span className="md:hidden text-muted-foreground">Status:</span>
                        {sale.dueAmount > 0 ? (
                          <span className="inline-flex items-center text-sm font-medium text-destructive">
                            <XCircle className="mr-1 h-3.5 w-3.5" /> Due: $
                            {sale.dueAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500">
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Paid
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 py-4">
              <CardTitle className="text-lg">Transaction Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sortedTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Wallet className="h-10 w-10 mb-3 opacity-20" />
                  <p>No financial transactions recorded.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <div className="hidden md:flex items-center px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50/30 dark:bg-zinc-900/30">
                    <div className="w-[15%]">Date</div>
                    <div className="w-[10%]">Type</div>
                    <div className="w-[25%]">Description</div>
                    <div className="w-[20%]">Account</div>
                    <div className="w-[15%]">Reference</div>
                    <div className="w-[15%] text-right">Amount</div>
                  </div>
                  {sortedTransactions.map((trx) => (
                    <div
                      key={trx.id}
                      className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="w-full md:w-[15%] flex items-center gap-2 mb-1 md:mb-0 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0 opacity-70" />
                        {format(new Date(trx.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="w-full md:w-[10%] mb-1 md:mb-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            trx.type === "INCOME"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {trx.type}
                        </span>
                      </div>
                      <div className="w-full md:w-[25%] text-sm mb-1 md:mb-0">
                        {trx.description || (
                          <span className="text-muted-foreground/50 italic">No description</span>
                        )}
                      </div>
                      <div className="w-full md:w-[20%] text-sm mb-1 md:mb-0 text-muted-foreground">
                        {trx.account?.name || "Unknown Account"}
                      </div>
                      <div className="w-full md:w-[15%] text-sm font-mono text-muted-foreground mb-1 md:mb-0">
                        {trx.reference || "-"}
                      </div>
                      <div
                        className={`w-full md:w-[15%] md:text-right font-semibold flex justify-between md:block ${
                          trx.type === "INCOME"
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        <span className="md:hidden font-normal text-muted-foreground">Amount:</span>
                        {trx.type === "INCOME" ? "+" : ""}${trx.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
