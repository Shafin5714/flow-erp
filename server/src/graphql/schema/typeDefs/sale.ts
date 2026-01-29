import gql from "graphql-tag";

export const saleTypeDefs = gql`
  type Sale {
    id: ID!
    invoiceNumber: String!
    customer: Customer
    items: [SaleItem!]!
    subtotal: Float!
    discount: Float!
    total: Float!
    paymentMode: PaymentMode!
    paidAmount: Float!
    dueAmount: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: User!
  }

  type SaleItem {
    id: ID!
    product: Product!
    quantity: Int!
    unitPrice: Float!
    total: Float!
  }

  input SaleItemInput {
    productId: String!
    quantity: Int!
    unitPrice: Float!
  }

  input CreateSaleInput {
    customerId: String
    items: [SaleItemInput!]!
    discount: Float
    paymentMode: PaymentMode!
    paidAmount: Float!
  }

  extend type Query {
    sales(startDate: DateTime, endDate: DateTime): [Sale!]!
    sale(id: ID!): Sale
  }

  extend type Mutation {
    createSale(input: CreateSaleInput!): Sale!
  }
`;
