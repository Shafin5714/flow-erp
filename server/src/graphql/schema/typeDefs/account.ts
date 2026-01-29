import gql from "graphql-tag";

export const accountTypeDefs = gql`
  type Account {
    id: ID!
    name: String!
    type: AccountType!
    balance: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
    transactions: [Transaction!]!
  }

  type Transaction {
    id: ID!
    account: Account!
    type: TransactionType!
    amount: Float!
    description: String
    reference: String
    customer: Customer
    vendor: Vendor
    createdAt: DateTime!
  }

  input CreateAccountInput {
    name: String!
    type: AccountType!
    balance: Float
  }

  input UpdateAccountInput {
    name: String
    type: AccountType
  }

  input CreateTransactionInput {
    accountId: String!
    type: TransactionType!
    amount: Float!
    description: String
    reference: String
    customerId: String
    vendorId: String
  }

  extend type Query {
    accounts: [Account!]!
    account(id: ID!): Account
    transactions(accountId: ID, startDate: DateTime, endDate: DateTime): [Transaction!]!
  }

  extend type Mutation {
    createAccount(input: CreateAccountInput!): Account!
    updateAccount(id: ID!, input: UpdateAccountInput!): Account!
    deleteAccount(id: ID!): Account!
    createTransaction(input: CreateTransactionInput!): Transaction!
  }
`;
