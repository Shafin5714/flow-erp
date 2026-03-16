import { gql } from "@apollo/client";

export const GET_PURCHASES = gql`
  query GetPurchases($startDate: DateTime, $endDate: DateTime) {
    purchases(startDate: $startDate, endDate: $endDate) {
      id
      vendor {
        id
        name
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
      total
      paidAmount
      dueAmount
      createdAt
      updatedAt
    }
  }
`;

export const GET_PURCHASE = gql`
  query GetPurchase($id: ID!) {
    purchase(id: $id) {
      id
      vendor {
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
          sku
        }
        variant {
          id
          name
          sku
        }
        quantity
        unitPrice
        total
      }
      subtotal
      total
      paidAmount
      dueAmount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PURCHASE = gql`
  mutation CreatePurchase($input: CreatePurchaseInput!) {
    createPurchase(input: $input) {
      id
      vendor {
        id
        name
      }
      subtotal
      total
      paidAmount
      dueAmount
      createdAt
      updatedAt
    }
  }
`;
export const UPDATE_PURCHASE = gql`
  mutation UpdatePurchase($id: ID!, $input: UpdatePurchaseInput!) {
    updatePurchase(id: $id, input: $input) {
      id
      vendor {
        id
        name
      }
      subtotal
      total
      paidAmount
      dueAmount
      createdAt
      updatedAt
    }
  }
`;
