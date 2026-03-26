import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/products";
import { GET_CUSTOMERS, CREATE_CUSTOMER } from "@/lib/graphql/customers";
import { CREATE_SALE } from "@/lib/graphql/sales";
import { Product, Customer, ProductVariant, Sale } from "@/lib/types";
import { toast } from "sonner";

export interface CartItem {
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

export function usePOS() {
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

    if (paymentMode === "DUE" && !selectedCustomerId) {
      toast.warning("Customer required for due payment", {
        description:
          "Please select a customer to track the due amount. Walk-in customers cannot have balances.",
      });
      return;
    }

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

      setLastSale(result.data.createSale);
      setInvoiceOpen(true);
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

  return {
    // Data & Loading states
    productsLoading,
    customersLoading,
    creatingSale,
    creatingCustomer,
    filteredProducts,
    customers,

    // Cart state
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    resetPOS,

    // Checkout math
    subtotal,
    discount,
    setDiscount,
    total,
    paidAmount,
    setPaidAmount,
    dueAmount,
    paymentMode,
    handlePaymentModeSelect,
    handleCheckout,

    // Customer selection
    selectedCustomerId,
    setSelectedCustomerId,
    selectedCustomer,
    customerOpen,
    setCustomerOpen,

    // New customer dialog
    newCustomerOpen,
    setNewCustomerOpen,
    newCustomerName,
    setNewCustomerName,
    newCustomerPhone,
    setNewCustomerPhone,
    handleCreateCustomer,

    // UI state
    searchTerm,
    setSearchTerm,
    invoiceOpen,
    setInvoiceOpen,
    lastSale,
  };
}
