import { gql } from "graphql-tag";

export const vendorTypeDefs = gql`
  type Vendor {
    id: ID!
    name: String!
    email: String
    phone: String
    address: String
    balance: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
    purchases: [Purchase!]!
    transactions: [Transaction!]!
  }

  input CreateVendorInput {
    name: String!
    email: String
    phone: String
    address: String
  }

  input UpdateVendorInput {
    name: String
    email: String
    phone: String
    address: String
  }

  extend type Query {
    vendors: [Vendor!]!
    vendor(id: ID!): Vendor
  }

  extend type Mutation {
    createVendor(input: CreateVendorInput!): Vendor!
    updateVendor(id: ID!, input: UpdateVendorInput!): Vendor!
    deleteVendor(id: ID!): Vendor!
  }
`;
