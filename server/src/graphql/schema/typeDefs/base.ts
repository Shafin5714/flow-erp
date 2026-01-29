import {gql} from "graphql-tag";

export const baseTypeDefs = gql`
  scalar DateTime

  enum Role {
    ADMIN
    MANAGER
    STAFF
  }

  enum PaymentMode {
    CASH
    DUE
  }

  enum TransactionType {
    INCOME
    EXPENSE
    CAPITAL
    LOAN
  }

  enum AccountType {
    CASH
    BANK
    CAPITAL
    LOAN
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
