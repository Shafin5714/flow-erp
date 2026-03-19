import React from "react";
import { Sale } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface InvoiceProps {
  sale: Sale;
}

const BUSINESS_DETAILS = {
  name: "Flow-ERP",
  address: "123 Business Road, Suite 100",
  city: "Dhaka, Bangladesh",
  phone: "+880 1234-567890",
  email: "contact@flow-erp.com",
  website: "www.flow-erp.com",
};

export const Invoice = React.forwardRef<HTMLDivElement, InvoiceProps>(({ sale }, ref) => {
  return (
    <div
      ref={ref}
      className="p-8 bg-white text-zinc-900 w-full max-w-[800px] mx-auto print:p-4 print:shadow-none"
      id="printable-invoice"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary mb-1 tracking-tight">
            {BUSINESS_DETAILS.name}
          </h1>
          <div className="text-sm text-zinc-500 space-y-0.5 font-medium">
            <p>{BUSINESS_DETAILS.address}</p>
            <p>{BUSINESS_DETAILS.city}</p>
            <p>Phone: {BUSINESS_DETAILS.phone}</p>
            <p>Email: {BUSINESS_DETAILS.email}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black text-zinc-200 uppercase tracking-tighter mb-2">
            Invoice
          </h2>
          <div className="text-sm font-bold bg-zinc-100 px-3 py-1 rounded-lg inline-block">
            # {sale.invoiceNumber}
          </div>
          <p className="text-xs text-zinc-500 mt-2 font-medium">
            Date: {format(new Date(sale.createdAt), "PPP p")}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
            Bill To
          </h3>
          {sale.customer ? (
            <div className="space-y-1">
              <p className="font-bold text-lg">{sale.customer.name}</p>
              {sale.customer.phone && (
                <p className="text-sm text-zinc-600 font-medium">Phone: {sale.customer.phone}</p>
              )}
              {sale.customer.address && (
                <p className="text-sm text-zinc-600 font-medium whitespace-pre-wrap">
                  {sale.customer.address}
                </p>
              )}
            </div>
          ) : (
            <p className="font-bold text-lg">Walk-in Customer</p>
          )}
        </div>
        <div className="text-right">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
            Payment Status
          </h3>
          <div className="space-y-1">
            <p className="font-bold text-lg">
              {sale.paymentMode === "CASH" ? "Paid (Cash)" : "Partial/Due"}
            </p>
            <p className="text-sm text-zinc-600 font-medium">Method: {sale.paymentMode}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-zinc-900/10">
              <th className="py-3 text-left font-black uppercase tracking-wider text-zinc-400 text-[10px]">
                Description
              </th>
              <th className="py-3 text-center font-black uppercase tracking-wider text-zinc-400 text-[10px] w-16">
                Qty
              </th>
              <th className="py-3 text-right font-black uppercase tracking-wider text-zinc-400 text-[10px] w-24">
                Price
              </th>
              <th className="py-3 text-right font-black uppercase tracking-wider text-zinc-400 text-[10px] w-24">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b border-zinc-100">
                <td className="py-4">
                  <p className="font-bold text-zinc-800">{item.product.name}</p>
                  {item.variant && (
                    <p className="text-xs text-zinc-500 font-medium">{item.variant.name}</p>
                  )}
                </td>
                <td className="py-4 text-center font-semibold">{item.quantity}</td>
                <td className="py-4 text-right font-semibold">
                  ${item.unitPrice.toLocaleString()}
                </td>
                <td className="py-4 text-right font-bold text-zinc-900">
                  ${item.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-[280px] space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 font-bold uppercase tracking-tight">Subtotal</span>
            <span className="font-bold">${sale.subtotal.toLocaleString()}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span className="font-bold uppercase tracking-tight">Discount</span>
              <span className="font-bold">- ${sale.discount.toLocaleString()}</span>
            </div>
          )}
          <Separator className="bg-zinc-900/10" />
          <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl">
            <span className="text-base font-black uppercase tracking-tight">Total</span>
            <span className="text-xl font-black text-primary">${sale.total.toLocaleString()}</span>
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-400 uppercase">Paid Amount</span>
              <span>${sale.paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-zinc-400 uppercase">Balance Due</span>
              <span className={sale.dueAmount > 0 ? "text-red-500" : ""}>
                ${sale.dueAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-dashed border-zinc-200 text-center">
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-1">
          Thank you for your business!
        </p>
        <p className="text-zinc-400 text-[10px] font-medium">
          This is a computer generated invoice and does not require a signature.
        </p>
      </div>
    </div>
  );
});

Invoice.displayName = "Invoice";
