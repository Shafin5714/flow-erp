"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VENDORS } from "@/lib/graphql/vendors";
import { GET_PRODUCTS } from "@/lib/graphql/products";
import { CREATE_PURCHASE, GET_PURCHASES } from "@/lib/graphql/purchases";
import { GET_ACCOUNTS } from "@/lib/graphql/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save, ArrowLeft, ShoppingCart, DollarSign, Landmark } from "lucide-react";
import { Product, Vendor, ProductVariant } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PurchaseItemState {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export default function CreatePurchasePage() {
  const router = useRouter();
  const { data: vendorsData } = useQuery(GET_VENDORS);
  const { data: productsData } = useQuery(GET_PRODUCTS);
  const { data: accountsData } = useQuery(GET_ACCOUNTS);

  const [createPurchase, { loading: isSubmitting }] = useMutation(CREATE_PURCHASE, {
    onCompleted: () => {
      toast.success("Purchase order created successfully");
      router.push("/purchases");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create purchase order");
    },
    refetchQueries: [{ query: GET_PURCHASES }],
  });

  const [vendorId, setVendorId] = useState("");
  const [items, setItems] = useState<PurchaseItemState[]>([
    { productId: "", variantId: "", quantity: 1, unitPrice: 0 },
  ]);
  const [paidAmount, setPaidAmount] = useState(0);

  const vendors = vendorsData?.vendors || [];
  const products = productsData?.products || [];
  const accounts = accountsData?.accounts || [];

  const [selectedAccountId, setSelectedAccountId] = useState("");

  const addItem = () => {
    setItems([...items, { productId: "", variantId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, updates: Partial<PurchaseItemState>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };

    // If productId changed, reset variantId and unitPrice
    if (updates.productId) {
      const product = products.find((p: Product) => p.id === updates.productId);
      newItems[index].variantId = "";
      newItems[index].unitPrice = product?.costPrice || 0;
    }

    // If variantId changed, update unitPrice if variant has one
    if (updates.variantId) {
      const product = products.find((p: Product) => p.id === newItems[index].productId);
      const variant = product?.variants?.find((v: ProductVariant) => v.id === updates.variantId);
      if (variant) {
        newItems[index].unitPrice = variant.costPrice || product?.costPrice || 0;
      }
    }

    setItems(newItems);
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [items]);

  const total = subtotal;
  const dueAmount = total - paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorId) {
      toast.error("Please select a vendor");
      return;
    }

    const validItems = items.filter((item) => item.productId);
    if (validItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    const input = {
      vendorId,
      paidAmount: Number(paidAmount),
      accountId: selectedAccountId || undefined,
      items: validItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || undefined,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    };

    createPurchase({ variables: { input } });
  };

  return (
    <div className="space-y-6 w-full pb-10 animate-in fade-in duration-500 px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/purchases">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Purchase Order</h1>
          <p className="text-muted-foreground">Register a new purchase from your vendors.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-950">
            <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" /> Purchase Items
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add the products you are purchasing.
              </p>
            </div>
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-zinc-50/30 dark:bg-zinc-900/30">
                    <TableHead className="pl-6 py-4 text-[11px] uppercase tracking-widest font-bold">
                      Product
                    </TableHead>
                    <TableHead className="py-4 text-[11px] uppercase tracking-widest font-bold">
                      Variant
                    </TableHead>
                    <TableHead className="w-[120px] py-4 text-[11px] uppercase tracking-widest font-bold">
                      Quantity
                    </TableHead>
                    <TableHead className="w-[150px] py-4 text-[11px] uppercase tracking-widest font-bold">
                      Unit Price
                    </TableHead>
                    <TableHead className="w-[120px] py-4 text-[11px] uppercase tracking-widest font-bold">
                      Total
                    </TableHead>
                    <TableHead className="w-[50px] pr-6 py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => {
                    const selectedProduct = products.find((p: Product) => p.id === item.productId);
                    const hasVariants = selectedProduct?.hasVariants;

                    return (
                      <TableRow
                        key={index}
                        className="group border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
                      >
                        <TableCell className="pl-6 py-4">
                          <Select
                            value={item.productId}
                            onValueChange={(val) => updateItem(index, { productId: val })}
                          >
                            <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p: Product) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-4">
                          <Select
                            disabled={!hasVariants}
                            value={item.variantId}
                            onValueChange={(val) => updateItem(index, { variantId: val })}
                          >
                            <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary">
                              <SelectValue
                                placeholder={hasVariants ? "Select variant" : "No variants"}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProduct?.variants?.map((v: ProductVariant) => (
                                <SelectItem key={v.id} value={v.id}>
                                  {v.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-4">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, { quantity: Number(e.target.value) })
                            }
                            className="h-10 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm focus:ring-primary"
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                              $
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItem(index, { unitPrice: Number(e.target.value) })
                              }
                              className="h-10 pl-7 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm focus:ring-primary font-medium"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-bold text-sm">
                          $
                          {(item.quantity * item.unitPrice).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="pr-6 py-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            className="text-destructive hover:bg-destructive/10 rounded-xl h-9 w-9 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="p-4 bg-zinc-50/20 dark:bg-zinc-900/20 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full rounded-xl border-dashed border-2 h-12 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all group font-semibold"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-125 transition-transform" /> Add
                  Another Item
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Order Summary
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    Select Vendor
                  </label>
                  <Select value={vendorId} onValueChange={setVendorId}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary">
                      <SelectValue placeholder="Search vendors..." />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((v: Vendor) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    Paid Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      className="h-11 pl-7 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm focus:ring-primary font-bold text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
                    <Landmark className="h-3 w-3" /> Payment Account
                  </label>
                  <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <SelectTrigger className="w-full h-11 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary">
                      <SelectValue placeholder="Select account (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc: { id: string; name: string; type: string }) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} ({acc.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-emerald-600">-$0.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Tax</span>
                  <span>+$0.00</span>
                </div>
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-2xl font-black text-primary tracking-tight">
                      ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                    Due Amount
                  </span>
                  <span
                    className={cn(
                      "text-lg font-black tracking-tight",
                      dueAmount > 0 ? "text-destructive" : "text-emerald-600"
                    )}
                  >
                    ${dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/20 text-base font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" /> Create Purchase Order
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
