import { gql } from "graphql-tag";

export const customerTypeDefs = gql`
  type Customer {
    id: ID!
    name: String!
    email: String
    phone: String
    address: String
    balance: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
    sales: [Sale!]!
    transactions: [Transaction!]!
  }

  input CreateCustomerInput {
    name: String!
    email: String
    phone: String
    address: String
  }

  input UpdateCustomerInput {
    name: String
    email: String
    phone: String
    address: String
  }

  extend type Query {
    customers: [Customer!]!
    customer(id: ID!): Customer
  }

  extend type Mutation {
    createCustomer(input: CreateCustomerInput!): Customer!
    updateCustomer(id: ID!, input: UpdateCustomerInput!): Customer!
    deleteCustomer(id: ID!): Customer!
  }
`;
