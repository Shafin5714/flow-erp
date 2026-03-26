import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#18181b", // zinc-900
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#18181b",
    paddingBottom: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#71717a", // zinc-500
    fontFamily: "Helvetica-Bold",
  },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0ea5e9", // primary blue
    marginBottom: 4,
    textAlign: "right",
  },
  companyDetails: {
    fontSize: 10,
    color: "#71717a",
    textAlign: "right",
    marginBottom: 2,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    width: "48%",
    backgroundColor: "#fafafa", // zinc-50
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4e4e7", // zinc-200
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#a1a1aa", // zinc-400
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 5,
    marginBottom: 10,
  },
  vendorName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  textRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  textLabel: {
    width: 80,
    fontSize: 9,
    color: "#a1a1aa",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },
  textValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  table: {
    width: "100%",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  thItem: {
    width: "40%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
    textTransform: "uppercase",
  },
  thVariant: {
    width: "20%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
    textTransform: "uppercase",
  },
  thQty: {
    width: "10%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
    textTransform: "uppercase",
    textAlign: "center",
  },
  thPrice: {
    width: "15%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
    textTransform: "uppercase",
    textAlign: "right",
  },
  thTotal: {
    width: "15%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#71717a",
    textTransform: "uppercase",
    textAlign: "right",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tdItem: { width: "40%", flexDirection: "column" },
  itemTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  itemSku: { fontSize: 8, color: "#a1a1aa", marginTop: 3 },
  tdVariant: { width: "20%", fontSize: 10, color: "#3f3f46" },
  tdQty: { width: "10%", fontSize: 10, fontFamily: "Helvetica-Bold", textAlign: "center" },
  tdPrice: { width: "15%", fontSize: 10, color: "#3f3f46", textAlign: "right" },
  tdTotal: { width: "15%", fontSize: 10, fontFamily: "Helvetica-Bold", textAlign: "right" },

  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  totalsBox: {
    width: 250,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 8,
    padding: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 10,
    color: "#71717a",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  totalValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  finalTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 10,
    marginTop: 2,
  },
  finalTotalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  finalTotalValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#0ea5e9" },

  paymentContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  paidLabel: {
    fontSize: 9,
    color: "#16a34a",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  paidValue: { fontSize: 10, color: "#16a34a", fontFamily: "Helvetica-Bold" },
  dueLabel: {
    fontSize: 9,
    color: "#ef4444",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  dueValue: { fontSize: 10, color: "#ef4444", fontFamily: "Helvetica-Bold" },

  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 2,
    borderTopColor: "#f4f4f5",
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerSection: { width: "45%" },
  footerTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#a1a1aa",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  footerText: { fontSize: 9, color: "#71717a", lineHeight: 1.4 },
  signatureTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#a1a1aa",
    textTransform: "uppercase",
    marginBottom: 5,
    textAlign: "right",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d8",
    marginTop: 30,
    marginBottom: 5,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InvoicePDF = ({ purchase }: { purchase: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>Purchase Order</Text>
            <Text style={styles.subtitle}>#{purchase.id.slice(-8).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.companyName}>Flow-ERP</Text>
            <Text style={styles.companyDetails}>123 Flow Street, Business District, 10001</Text>
            <Text style={styles.companyDetails}>contact@flow-erp.local | flow-erp.com</Text>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.grid}>
          {/* Supplier Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Supplier Information</Text>
            <Text style={styles.vendorName}>{purchase.vendor.name}</Text>
            {purchase.vendor.address && (
              <Text style={{ fontSize: 10, color: "#52525b", marginBottom: 4 }}>
                {purchase.vendor.address}
              </Text>
            )}
            {purchase.vendor.email && (
              <Text style={{ fontSize: 10, color: "#52525b", marginBottom: 2 }}>
                E: {purchase.vendor.email}
              </Text>
            )}
            {purchase.vendor.phone && (
              <Text style={{ fontSize: 10, color: "#52525b" }}>P: {purchase.vendor.phone}</Text>
            )}
          </View>

          {/* Order Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Details</Text>

            <View style={styles.textRow}>
              <Text style={styles.textLabel}>Order Date</Text>
              <Text style={styles.textValue}>
                {format(new Date(parseInt(purchase.createdAt)), "MMM d, yyyy")}
              </Text>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.textLabel}>Status</Text>
              <Text style={styles.textValue}>
                {purchase.dueAmount === 0 ? "PAID" : purchase.paidAmount > 0 ? "PARTIAL" : "UNPAID"}
              </Text>
            </View>

            <View style={styles.textRow}>
              <Text style={styles.textLabel}>Total Items</Text>
              <Text style={styles.textValue}>{purchase.items.length} unique entries</Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thItem}>Item Description</Text>
            <Text style={styles.thVariant}>Variant</Text>
            <Text style={styles.thQty}>Qty</Text>
            <Text style={styles.thPrice}>Unit Price</Text>
            <Text style={styles.thTotal}>Amount</Text>
          </View>

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {purchase.items.map((item: any, i: number) => (
            <View
              style={[
                styles.tableRow,
                i === purchase.items.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
              key={item.id}
              wrap={false}
            >
              <View style={styles.tdItem}>
                <Text style={styles.itemTitle}>{item.product.name}</Text>
                {item.product.sku && <Text style={styles.itemSku}>SKU: {item.product.sku}</Text>}
              </View>
              <Text style={styles.tdVariant}>{item.variant ? item.variant.name : "-"}</Text>
              <Text style={styles.tdQty}>{item.quantity}</Text>
              <Text style={styles.tdPrice}>
                ${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.tdTotal}>
                ${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer} wrap={false}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                ${purchase.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>$0.00</Text>
            </View>
            <View style={styles.finalTotalRow}>
              <Text style={styles.finalTotalLabel}>Total</Text>
              <Text style={styles.finalTotalValue}>
                ${purchase.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>

            {(purchase.paidAmount > 0 || purchase.dueAmount > 0) && (
              <View style={styles.paymentContainer}>
                <View style={styles.paymentRow}>
                  <Text style={styles.paidLabel}>Amount Paid</Text>
                  <Text style={styles.paidValue}>
                    ${purchase.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.paymentRow}>
                  <Text style={styles.dueLabel}>Amount Due</Text>
                  <Text style={styles.dueValue}>
                    ${purchase.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerSection}>
            <Text style={styles.footerTitle}>Terms & Conditions</Text>
            <Text style={styles.footerText}>
              Please deliver all goods as described in the purchase order. All discrepancies must be
              reported within 48 hours of receipt. Payment will be processed according to agreed net
              terms.
            </Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.signatureTitle}>Signatures</Text>
            <View style={styles.signatureLine}></View>
            <Text style={{ fontSize: 9, color: "#71717a", textAlign: "right" }}>
              Authorized Signature
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
