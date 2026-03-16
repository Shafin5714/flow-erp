"use client";

import { useQuery } from "@apollo/client";
import { GET_PURCHASE } from "@/lib/graphql/purchases";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PurchaseItem } from "@/lib/types";

export default function PurchaseDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, loading, error } = useQuery(GET_PURCHASE, {
    variables: { id },
  });

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading purchase details...
        </p>
      </div>
    );
  }

  if (error || !data?.purchase) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <ArrowLeft className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Purchase Not Found</h2>
          <p className="text-muted-foreground mt-1">
            {error?.message || "The requested purchase could not be found."}
          </p>
        </div>
        <Link href="/purchases">
          <Button variant="outline" className="rounded-full px-8">
            Back to Purchases
          </Button>
        </Link>
      </div>
    );
  }

  const { purchase } = data;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500 pb-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <Link href="/purchases">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight uppercase">
                PO-#{purchase.id.slice(-8)}
              </h1>
              <Badge
                className={cn(
                  "px-3 py-1 rounded-full border-none text-[10px] font-bold uppercase tracking-wider",
                  purchase.dueAmount === 0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : purchase.paidAmount > 0
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      : "bg-destructive/10 text-destructive"
                )}
              >
                {purchase.dueAmount === 0
                  ? "Fully Paid"
                  : purchase.paidAmount > 0
                    ? "Partial"
                    : "Unpaid"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Created on {format(new Date(purchase.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link href={`/purchases/${id}/edit`} className="flex-1 md:flex-initial">
            <Button
              variant="outline"
              className="rounded-full h-11 px-6 shadow-sm w-full font-bold group"
            >
              <Edit className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" /> Edit
              Order
            </Button>
          </Link>
          <Button className="rounded-full h-11 px-8 shadow-lg font-bold">Print Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {/* Left Column: Vendor & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Information Card */}
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Vendor Details</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                  Supplier Information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 leading-none">
                      Name
                    </p>
                    <p className="text-sm font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                      {purchase.vendor.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 leading-none">
                      Email
                    </p>
                    <p className="text-sm font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                      {purchase.vendor.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 leading-none">
                      Phone
                    </p>
                    <p className="text-sm font-bold mt-1 text-zinc-900 dark:text-zinc-100">
                      {purchase.vendor.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70 leading-none">
                      Address
                    </p>
                    <p className="text-sm font-bold mt-1 text-zinc-900 dark:text-zinc-100 max-w-[200px]">
                      {purchase.vendor.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items List Table */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-sm transition-all duration-300">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest">Ordered Items</h3>
              <Badge
                variant="outline"
                className="ml-auto rounded-md bg-white dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-wider h-6"
              >
                {purchase.items.length} {purchase.items.length === 1 ? "Entry" : "Entries"}
              </Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                  <TableHead className="pl-6 py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Product Details
                  </TableHead>
                  <TableHead className="py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">
                    Variant
                  </TableHead>
                  <TableHead className="py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-center">
                    Qty
                  </TableHead>
                  <TableHead className="py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-right">
                    Unit Price
                  </TableHead>
                  <TableHead className="pr-6 py-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-right">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchase.items.map((item: PurchaseItem) => (
                  <TableRow
                    key={item.id}
                    className="group border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform duration-300">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                            SKU: {item.product.sku || "N/A"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {item.variant ? (
                        <Badge
                          variant="outline"
                          className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg py-0.5 font-medium text-[11px]"
                        >
                          {item.variant.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium italic">
                          Standard
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-center font-bold text-sm">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="py-4 text-right font-medium text-zinc-600 dark:text-zinc-400">
                      ${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right font-black text-zinc-900 dark:text-zinc-100">
                      ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-full w-24 bg-primary/5 -skew-x-12 translate-x-12 group-hover:bg-primary/10 transition-all duration-500" />
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Financial Summary</h3>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-bold text-muted-foreground/80 uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="text-sm font-bold">
                  ${purchase.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-bold text-muted-foreground/80 uppercase tracking-widest">
                  Tax (0%)
                </span>
                <span className="text-sm font-bold">$0.00</span>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-black uppercase tracking-tighter">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-primary tracking-tighter transition-all group-hover:scale-105">
                    ${purchase.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-600 mb-1">
                    Paid
                  </p>
                  <p className="text-lg font-black text-emerald-600 tracking-tight">
                    ${purchase.paidAmount.toLocaleString()}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-4 rounded-2xl text-center border transition-all duration-300",
                    purchase.dueAmount > 0
                      ? "bg-destructive/5 border-destructive/10 text-destructive animate-pulse-subtle"
                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-muted-foreground"
                  )}
                >
                  <p className="text-[10px] uppercase tracking-widest font-black mb-1">Due</p>
                  <p className="text-lg font-black tracking-tight">
                    ${purchase.dueAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 leading-none">
                  Status
                </p>
                <p className="text-sm font-bold mt-1 uppercase tracking-tighter">
                  {purchase.dueAmount === 0 ? "Completed" : "Action Required"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
