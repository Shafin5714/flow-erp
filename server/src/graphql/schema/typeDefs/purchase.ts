import { gql } from "graphql-tag";

export const purchaseTypeDefs = gql`
  type Purchase {
    id: ID!
    vendor: Vendor!
    items: [PurchaseItem!]!
    subtotal: Float!
    total: Float!
    paidAmount: Float!
    dueAmount: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PurchaseItem {
    id: ID!
    product: Product!
    quantity: Int!
    unitPrice: Float!
    total: Float!
  }

  input PurchaseItemInput {
    productId: String!
    quantity: Int!
    unitPrice: Float!
  }

  input CreatePurchaseInput {
    vendorId: String!
    items: [PurchaseItemInput!]!
    paidAmount: Float!
  }

  extend type Query {
    purchases(startDate: DateTime, endDate: DateTime): [Purchase!]!
    purchase(id: ID!): Purchase
  }

  extend type Mutation {
    createPurchase(input: CreatePurchaseInput!): Purchase!
  }
`;
