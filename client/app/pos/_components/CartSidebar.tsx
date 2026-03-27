import { CartItem } from "./use-pos";
import { Customer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ShoppingCart,
  User,
  ChevronsUpDown,
  Check,
  Phone,
  DollarSign,
  UserPlus,
  Trash2,
  Minus,
  Plus,
  CreditCard,
  Receipt,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
  cart: CartItem[];
  customers: Customer[];
  customersLoading: boolean;
  selectedCustomer: Customer | undefined;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  customerOpen: boolean;
  setCustomerOpen: (open: boolean) => void;
  setNewCustomerOpen: (open: boolean) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  subtotal: number;
  discount: number;
  setDiscount: (discount: number) => void;
  total: number;
  paymentMode: "CASH" | "DUE";
  handlePaymentModeSelect: (mode: "CASH" | "DUE") => void;
  paidAmount: number;
  setPaidAmount: (amount: number) => void;
  dueAmount: number;
  creatingSale: boolean;
  handleCheckout: () => void;
  accounts: { id: string; name: string; type: string }[];
  selectedAccountId: string;
  setSelectedAccountId: (id: string) => void;
}

export function CartSidebar({
  cart,
  customers,
  customersLoading,
  selectedCustomer,
  selectedCustomerId,
  setSelectedCustomerId,
  customerOpen,
  setCustomerOpen,
  setNewCustomerOpen,
  removeFromCart,
  updateQuantity,
  subtotal,
  discount,
  setDiscount,
  total,
  paymentMode,
  handlePaymentModeSelect,
  paidAmount,
  setPaidAmount,
  dueAmount,
  creatingSale,
  handleCheckout,
  accounts,
  selectedAccountId,
  setSelectedAccountId,
}: CartSidebarProps) {
  return (
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

        {/* Account Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1">
            <Landmark className="h-3 w-3" /> Payment Account
          </label>
          <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
            <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary">
              <SelectValue placeholder="Select account (optional)" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name} ({acc.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={paymentMode === "CASH" ? "default" : "outline"}
            className={cn(
              "h-12 w-full rounded-xl",
              paymentMode === "CASH" && "bg-emerald-600 hover:bg-emerald-700 text-white"
            )}
            onClick={() => handlePaymentModeSelect("CASH")}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Cash
          </Button>
          <Button
            variant={paymentMode === "DUE" ? "default" : "outline"}
            className={cn(
              "h-12 w-full rounded-xl",
              paymentMode === "DUE" && "bg-amber-600 hover:bg-amber-700 text-white"
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
  );
}
