"use client";

import { usePOS } from "./_components/use-pos";
import { ProductCatalog } from "./_components/ProductCatalog";
import { CartSidebar } from "./_components/CartSidebar";
import { NewCustomerDialog } from "./_components/NewCustomerDialog";
import { InvoicePreviewDialog } from "./_components/InvoicePreviewDialog";

export default function POSPage() {
  const pos = usePOS();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <ProductCatalog
        searchTerm={pos.searchTerm}
        setSearchTerm={pos.setSearchTerm}
        productsLoading={pos.productsLoading}
        filteredProducts={pos.filteredProducts}
        addToCart={pos.addToCart}
      />

      <CartSidebar
        cart={pos.cart}
        customers={pos.customers}
        customersLoading={pos.customersLoading}
        selectedCustomer={pos.selectedCustomer}
        selectedCustomerId={pos.selectedCustomerId}
        setSelectedCustomerId={pos.setSelectedCustomerId}
        customerOpen={pos.customerOpen}
        setCustomerOpen={pos.setCustomerOpen}
        setNewCustomerOpen={pos.setNewCustomerOpen}
        removeFromCart={pos.removeFromCart}
        updateQuantity={pos.updateQuantity}
        subtotal={pos.subtotal}
        discount={pos.discount}
        setDiscount={pos.setDiscount}
        total={pos.total}
        paymentMode={pos.paymentMode}
        handlePaymentModeSelect={pos.handlePaymentModeSelect}
        paidAmount={pos.paidAmount}
        setPaidAmount={pos.setPaidAmount}
        dueAmount={pos.dueAmount}
        creatingSale={pos.creatingSale}
        handleCheckout={pos.handleCheckout}
        accounts={pos.accounts}
        selectedAccountId={pos.selectedAccountId}
        setSelectedAccountId={pos.setSelectedAccountId}
      />

      <NewCustomerDialog
        open={pos.newCustomerOpen}
        onOpenChange={pos.setNewCustomerOpen}
        name={pos.newCustomerName}
        setName={pos.setNewCustomerName}
        phone={pos.newCustomerPhone}
        setPhone={pos.setNewCustomerPhone}
        loading={pos.creatingCustomer}
        onSubmit={pos.handleCreateCustomer}
      />

      <InvoicePreviewDialog
        open={pos.invoiceOpen}
        onOpenChange={pos.setInvoiceOpen}
        sale={pos.lastSale}
        onNewSale={() => {
          pos.setInvoiceOpen(false);
          pos.resetPOS();
        }}
      />
    </div>
  );
}
