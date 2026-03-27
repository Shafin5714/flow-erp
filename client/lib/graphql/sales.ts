import { gql } from "@apollo/client";

export const GET_SALES = gql`
  query GetSales($startDate: DateTime, $endDate: DateTime) {
    sales(startDate: $startDate, endDate: $endDate) {
      id
      invoiceNumber
      customer {
        id
        name
      }
      subtotal
      discount
      total
      paymentMode
      paidAmount
      dueAmount
      isRefunded
      createdAt
    }
  }
`;

export const GET_SALE = gql`
  query GetSale($id: ID!) {
    sale(id: $id) {
      id
      invoiceNumber
      customer {
        id
        name
        email
        phone
        address
      }
      items {
        id
        product {
          id
          name
        }
        variant {
          id
          name
        }
        quantity
        unitPrice
        total
      }
      subtotal
      discount
      total
      paymentMode
      paidAmount
      dueAmount
      isRefunded
      createdAt
      updatedAt
      createdBy {
        id
        name
      }
    }
  }
`;

export const CREATE_SALE = gql`
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      id
      invoiceNumber
      customer {
        id
        name
        email
        phone
        address
      }
      items {
        id
        product {
          id
          name
        }
        variant {
          id
          name
        }
        quantity
        unitPrice
        total
      }
      subtotal
      discount
      total
      paymentMode
      paidAmount
      dueAmount
      isRefunded
      createdAt
      updatedAt
      createdBy {
        id
        name
      }
    }
  }
`;

export const REFUND_SALE = gql`
  mutation RefundSale($id: ID!, $accountId: String) {
    refundSale(id: $id, accountId: $accountId) {
      id
      invoiceNumber
      subtotal
      discount
      total
      paymentMode
      paidAmount
      dueAmount
      isRefunded
      updatedAt
    }
  }
`;
