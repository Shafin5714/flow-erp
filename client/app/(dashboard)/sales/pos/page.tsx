"use client";

import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/products";
import { GET_CUSTOMERS, CREATE_CUSTOMER } from "@/lib/graphql/customers";
import { CREATE_SALE } from "@/lib/graphql/sales";
import { useReactToPrint } from "react-to-print";
import { Invoice } from "@/components/sales/invoice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  Printer,
  FileText,
  RotateCcw,
  Search,
  ShoppingCart,
  User,
  ChevronsUpDown,
  Check,
  Phone,
  UserPlus,
  Trash2,
  Minus,
  Plus,
  CreditCard,
  Receipt,
} from "lucide-react";
import { Product, Customer, ProductVariant, Sale } from "@/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Cart item type for POS
interface CartItem {
  cartId: string;
  productId: string;
  variantId?: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  total: number;
}

const generateCartId = (productId: string, variantId?: string) => {
  return `${productId}-${variantId || "base"}-${Date.now()}`;
};

export default function POSPage() {
  const router = useRouter();

  // Queries
  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS);
  const {
    data: customersData,
    loading: customersLoading,
    refetch: refetchCustomers,
  } = useQuery(GET_CUSTOMERS);

  // Mutations
  const [createSale, { loading: creatingSale }] = useMutation(CREATE_SALE);
  const [createCustomer, { loading: creatingCustomer }] = useMutation(CREATE_CUSTOMER);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<"CASH" | "DUE">("CASH");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
  });

  // Customer combobox state
  const [customerOpen, setCustomerOpen] = useState(false);

  // New customer dialog state
  const [newCustomerOpen, setNewCustomerOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  // Memos
  const products = useMemo<Product[]>(() => productsData?.products || [], [productsData]);
  const customers = useMemo<Customer[]>(() => customersData?.customers || [], [customersData]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId),
    [customers, selectedCustomerId]
  );

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Cart math
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);
  const total = Math.max(0, subtotal - discount);
  const dueAmount = Math.max(0, total - paidAmount);

  const handlePaymentModeSelect = (mode: "CASH" | "DUE") => {
    setPaymentMode(mode);
    if (mode === "CASH") {
      setPaidAmount(total);
    } else {
      setPaidAmount(0);
    }
  };

  const addToCart = (product: Product, variant?: ProductVariant) => {
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.id && item.variantId === variant?.id
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      newCart[existingIndex].total =
        newCart[existingIndex].quantity * newCart[existingIndex].unitPrice;
      setCart(newCart);
    } else {
      const price = variant ? variant.salePrice : product.salePrice;
      setCart([
        ...cart,
        {
          cartId: generateCartId(product.id, variant?.id),
          productId: product.id,
          variantId: variant?.id,
          product,
          variant,
          quantity: 1,
          unitPrice: price,
          total: price,
        },
      ]);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].total = newCart[index].quantity * newCart[index].unitPrice;
    }
    setCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const resetPOS = () => {
    setCart([]);
    setDiscount(0);
    setSelectedCustomerId("");
    setPaymentMode("CASH");
    setPaidAmount(0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty", {
        description: "Add at least one product before checking out.",
      });
      return;
    }

    // Require customer for DUE payments
    if (paymentMode === "DUE" && !selectedCustomerId) {
      toast.warning("Customer required for due payment", {
        description:
          "Please select a customer to track the due amount. Walk-in customers cannot have balances.",
      });
      return;
    }

    // Cap paidAmount at total
    const clampedPaidAmount = Math.min(paidAmount, total);

    try {
      const result = await createSale({
        variables: {
          input: {
            customerId: selectedCustomerId || null,
            items: cart.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
            discount,
            paymentMode,
            paidAmount: clampedPaidAmount,
          },
        },
      });

      toast.success("Sale completed!", {
        description: `Invoice ${result.data.createSale.invoiceNumber} — $${result.data.createSale.total.toLocaleString()}`,
      });

      // Set last sale and open invoice preview
      setLastSale(result.data.createSale);
      setInvoiceOpen(true);

      // Reset POS for the next customer instead of navigating away
      resetPOS();
    } catch (err) {
      toast.error("Failed to create sale", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const result = await createCustomer({
        variables: {
          input: {
            name: newCustomerName.trim(),
            phone: newCustomerPhone.trim() || null,
          },
        },
      });

      await refetchCustomers();
      setSelectedCustomerId(result.data.createCustomer.id);
      setNewCustomerOpen(false);
      setNewCustomerName("");
      setNewCustomerPhone("");

      toast.success("Customer created", {
        description: `${result.data.createCustomer.name} has been added.`,
      });
    } catch (err) {
      toast.error("Failed to create customer", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  return (
    <div className="flex h-screen -m-6 overflow-hidden">
      {/* LEFT PANE - PRODUCT CATALOG */}
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-base focus-visible:ring-primary shadow-inner"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/sales")}>
              Exit POS
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {productsLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((p) => (
                <Card
                  key={p.id}
                  className={cn(
                    "cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-md overflow-hidden group rounded-xl",
                    !p.hasVariants && p.stock <= 0 && "opacity-50 grayscale"
                  )}
                  onClick={() => {
                    if (p.hasVariants && p.variants && p.variants.length > 0) {
                      addToCart(p, p.variants[0]);
                    } else if (p.stock > 0) {
                      addToCart(p);
                    }
                  }}
                >
                  <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative">
                    {p.mainImage ? (
                      <Image
                        src={p.mainImage}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-zinc-400">
                        <ShoppingCart className="h-10 w-10 opacity-20" />
                      </div>
                    )}
                    {p.hasVariants && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {p.variants?.length} Options
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm line-clamp-2 leading-tight">{p.name}</p>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                      <span className="font-bold text-primary">
                        ${p.salePrice.toLocaleString()}
                      </span>
                      {!p.hasVariants && (
                        <Badge
                          variant={p.stock > 0 ? "secondary" : "destructive"}
                          className="text-[10px] px-1.5 py-0 h-4"
                        >
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE - CART & CHECKOUT */}
      <div className="w-[400px] flex flex-col bg-white dark:bg-zinc-900 shadow-2xl z-10">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <ShoppingCart className="h-5 w-5 text-primary" /> Current Order
          </h2>

          {/* Customer Combobox */}
          <div className="mt-4">
            <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={customerOpen}
                  className="w-full justify-between h-10 rounded-lg font-normal"
                >
                  <div className="flex items-center gap-2 truncate">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    {selectedCustomer ? (
                      <span className="truncate">{selectedCustomer.name}</span>
                    ) : (
                      <span className="text-muted-foreground">Walk-in Customer</span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[352px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search customers..." />
                  <CommandList>
                    <CommandEmpty>
                      <p className="text-muted-foreground">No customers found.</p>
                    </CommandEmpty>
                    <CommandGroup heading="Customers">
                      {/* Walk-in option */}
                      <CommandItem
                        value="walk-in-customer"
                        onSelect={() => {
                          setSelectedCustomerId("");
                          setCustomerOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !selectedCustomerId ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">Walk-in Customer</span>
                          <span className="text-xs text-muted-foreground">No customer record</span>
                        </div>
                      </CommandItem>

                      {/* Customer list */}
                      {!customersLoading &&
                        customers.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={`${c.name} ${c.phone || ""}`}
                            onSelect={() => {
                              setSelectedCustomerId(c.id);
                              setCustomerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCustomerId === c.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-medium truncate">{c.name}</span>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                {c.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {c.phone}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  Bal: ${c.balance.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          setCustomerOpen(false);
                          setNewCustomerOpen(true);
                        }}
                        className="text-primary"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span className="font-medium">Add New Customer</span>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Selected customer balance indicator */}
          {selectedCustomer && selectedCustomer.balance > 0 && (
            <div className="mt-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-center justify-between text-xs">
              <span className="font-medium text-amber-800 dark:text-amber-200">
                Outstanding Balance
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-300">
                ${selectedCustomer.balance.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={item.cartId}
                className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm leading-tight">{item.product.name}</p>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variant.name}</p>
                    )}
                    <p className="text-primary font-bold text-sm mt-1">
                      ${item.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 -mt-1 -mr-1"
                    onClick={() => removeFromCart(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <button
                      className="h-6 w-6 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => updateQuantity(idx, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button
                      className="h-6 w-6 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => updateQuantity(idx, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-bold">${item.total.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CHECKOUT PANEL */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between group">
              <span className="text-muted-foreground">Discount</span>
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                  $
                </span>
                <Input
                  type="number"
                  min="0"
                  className="h-8 pl-6 text-right font-medium rounded-md border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 focus:border-primary shadow-none bg-transparent hover:bg-white dark:hover:bg-zinc-900 transition-colors"
                  value={discount || ""}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-lg font-black pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
              <span>Total</span>
              <span className="text-primary">${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={paymentMode === "CASH" ? "default" : "outline"}
              className={cn(
                "h-12 w-full rounded-xl",
                paymentMode === "CASH" && "bg-emerald-600 hover:bg-emerald-700"
              )}
              onClick={() => handlePaymentModeSelect("CASH")}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Cash
            </Button>
            <Button
              variant={paymentMode === "DUE" ? "default" : "outline"}
              className={cn(
                "h-12 w-full rounded-xl",
                paymentMode === "DUE" && "bg-amber-600 hover:bg-amber-700"
              )}
              onClick={() => handlePaymentModeSelect("DUE")}
            >
              <Receipt className="mr-2 h-4 w-4" /> Due / Partial
            </Button>
          </div>

          {paymentMode === "DUE" && (
            <>
              {!selectedCustomerId && (
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-2.5 rounded-xl">
                  <User className="h-4 w-4 shrink-0" />
                  <span>Select a customer to track due balance</span>
                </div>
              )}
              <div className="flex justify-between items-center bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50">
                <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  Paid Amount
                </span>
                <div className="relative w-28">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-400 font-bold">
                    $
                  </span>
                  <Input
                    type="number"
                    min="0"
                    max={total}
                    className="h-9 pl-7 text-right font-bold text-amber-900 dark:text-amber-100 bg-white dark:bg-zinc-900 border-amber-300 dark:border-amber-700"
                    value={paidAmount || ""}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setPaidAmount(Math.min(val, total));
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
            </>
          )}

          {dueAmount > 0 && paymentMode === "DUE" && (
            <div className="flex justify-between text-sm text-destructive font-semibold px-1">
              <span>Remaining Due:</span>
              <span>${dueAmount.toLocaleString()}</span>
            </div>
          )}

          <Button
            className="w-full h-14 rounded-xl text-lg font-bold shadow-lg hover:scale-[1.02] transition-transform"
            size="lg"
            onClick={handleCheckout}
            disabled={cart.length === 0 || creatingSale}
          >
            {creatingSale ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </div>
            ) : (
              `Pay $${total.toLocaleString()}`
            )}
          </Button>
        </div>
      </div>

      {/* NEW CUSTOMER DIALOG */}
      <Dialog open={newCustomerOpen} onOpenChange={setNewCustomerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Quick Add Customer
            </DialogTitle>
            <DialogDescription>
              Create a new customer record. You can add more details later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="customer-name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customer-name"
                placeholder="Customer name"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                className="rounded-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCustomer();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone</Label>
              <Input
                id="customer-phone"
                placeholder="Phone number (optional)"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
                className="rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateCustomer();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewCustomerOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={creatingCustomer || !newCustomerName.trim()}
              className="rounded-lg"
            >
              {creatingCustomer ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </div>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" /> Add Customer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* INVOICE PREVIEW DIALOG */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold">Sale Invoice</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInvoiceOpen(false)}
                className="rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-100 dark:bg-zinc-900">
            {lastSale && (
              <div className="bg-white dark:bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none mx-auto border border-zinc-200 dark:border-zinc-100">
                <Invoice ref={invoiceRef} sale={lastSale} />
              </div>
            )}
          </div>

          <DialogFooter className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex sm:justify-between items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setInvoiceOpen(false);
                resetPOS();
              }}
              className="rounded-lg hidden sm:flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> New Sale
            </Button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none rounded-lg items-center gap-2 border-zinc-200 dark:border-zinc-800"
                onClick={() => {
                  // In a real app, we might navigate to a PDF view or download
                  toast.info("Downloading PDF...", { duration: 1000 });
                }}
              >
                <FileText className="h-4 w-4" /> Save PDF
              </Button>
              <Button
                className="flex-1 sm:flex-none rounded-lg items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-primary dark:hover:bg-primary/90 shadow-lg"
                onClick={() => handlePrint()}
              >
                <Printer className="h-4 w-4" /> Print Invoice
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
