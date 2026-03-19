"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/products";
import { GET_CUSTOMERS } from "@/lib/graphql/customers";
import { CREATE_SALE } from "@/lib/graphql/sales";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus, Trash2, ShoppingCart, User, CreditCard, Receipt } from "lucide-react";
import { Product, Customer, ProductVariant } from "@/lib/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Note: Type definition for CartItem specifically for POS
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
  const { data: customersData, loading: customersLoading } = useQuery(GET_CUSTOMERS);

  // Mutation
  const [createSale, { loading: creatingSale }] = useMutation(CREATE_SALE, {
    onCompleted: (data) => {
      alert(`Sale completed successfully! Invoice: ${data.createSale.invoiceNumber}`);
      router.push("/sales");
    },
    onError: (err) => {
      alert(`Error creating sale: ${err.message}`);
    },
  });

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<"CASH" | "DUE">("CASH");
  const [paidAmount, setPaidAmount] = useState<number>(0);

  // Memos
  const products = useMemo<Product[]>(() => productsData?.products || [], [productsData]);
  const customers = useMemo<Customer[]>(() => customersData?.customers || [], [customersData]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Derived state for cart math
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);
  const total = Math.max(0, subtotal - discount);
  const dueAmount = Math.max(0, total - paidAmount);

  // Sync paidAmount with total if paying entirely in CASH and paidAmount wasn't manually touched (optional heuristic)
  // For simplicity, we just leave it to the user or an effect. If CASH, default paying full.
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

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      await createSale({
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
            paidAmount,
          },
        },
      });
    } catch (e) {
      console.error(e);
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
                      // In a real app, open a modal to select variant. For now, pick first variant.
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

          <div className="mt-4 flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground mr-1" />
            <select
              className="flex h-10 w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:border-zinc-800 dark:bg-zinc-950"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Walk-in Customer</option>
              {!customersLoading &&
                customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
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
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
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
    </div>
  );
}
