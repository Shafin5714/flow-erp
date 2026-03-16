"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PURCHASE, UPDATE_PURCHASE } from "@/lib/graphql/purchases";
import { GET_VENDORS } from "@/lib/graphql/vendors";
import { GET_PRODUCTS } from "@/lib/graphql/products";
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
import { Plus, Trash2, Save, ArrowLeft, ShoppingCart, DollarSign } from "lucide-react";
import { Product, Vendor, ProductVariant, PurchaseItem } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PurchaseItemFormValue {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export default function EditPurchasePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: purchaseData, loading: loadingPurchase } = useQuery(GET_PURCHASE, {
    variables: { id },
  });
  const { data: vendorsData } = useQuery(GET_VENDORS);
  const { data: productsData } = useQuery(GET_PRODUCTS);

  const [vendorId, setVendorId] = useState<string>("");
  const [items, setItems] = useState<PurchaseItemFormValue[]>([]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (purchaseData?.purchase && !isInitialized.current) {
      const p = purchaseData.purchase;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVendorId(p.vendor.id);

      setPaidAmount(p.paidAmount);

      setItems(
        p.items.map((item: PurchaseItem) => ({
          productId: item.product.id,
          variantId: item.variant?.id || "",
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }))
      );
      isInitialized.current = true;
    }
  }, [purchaseData]);

  const [updatePurchase, { loading: isSubmitting }] = useMutation(UPDATE_PURCHASE, {
    onCompleted: () => {
      toast.success("Purchase order updated successfully");
      router.push(`/purchases/${id}`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update purchase order");
    },
  });

  const vendors = useMemo(() => vendorsData?.vendors || [], [vendorsData]);
  const products = useMemo(() => productsData?.products || [], [productsData]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [items]);

  const total = subtotal; // Can add tax logic here later
  const dueAmount = Math.max(0, total - paidAmount);

  const addItem = () => {
    setItems([...items, { productId: "", variantId: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<PurchaseItemFormValue>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };

    // If productId changed, reset variantId and update unitPrice to costPrice
    if (updates.productId) {
      const product = products.find((p: Product) => p.id === updates.productId);
      newItems[index].variantId = "";
      newItems[index].unitPrice = product?.costPrice || 0;
    }

    // If variantId changed, update unitPrice if variant has one
    if (updates.variantId) {
      const product = products.find((p: Product) => p.id === newItems[index].productId);
      const variant = product?.variants?.find((v: ProductVariant) => v.id === updates.variantId);
      if (variant?.costPrice) {
        newItems[index].unitPrice = variant.costPrice;
      }
    }

    setItems(newItems);
  };

  const handleSave = async () => {
    if (!vendorId) {
      toast.error("Please select a vendor");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    if (items.some((item) => !item.productId)) {
      toast.error("Please select a product for all rows");
      return;
    }

    await updatePurchase({
      variables: {
        id,
        input: {
          vendorId,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          paidAmount,
        },
      },
    });
  };

  if (loadingPurchase) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading purchase data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10 animate-in fade-in duration-500 px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href={`/purchases/${id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">
            Edit Order PO-#{id.toString().slice(-8)}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Update purchase order details and items.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-0 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" /> Purchase Items
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add or modify products in this purchase.
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
                            disabled={!item.productId || !hasVariants}
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
                        <TableCell className="py-4 text-center">
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
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
                <Button
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

        {/* Summary & Vendor Section */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" /> Order Summary
            </h3>

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
                      className="h-11 pl-7 rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm focus:ring-primary font-bold text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-muted-foreground/70 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold font-mono tracking-tighter">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-muted-foreground/70 uppercase tracking-widest">
                    Tax (0%)
                  </span>
                  <span className="text-sm font-bold font-mono tracking-tighter">$0.00</span>
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
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl shadow-lg shadow-primary/20 font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-5 w-5" /> Save Changes
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
