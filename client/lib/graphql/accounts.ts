import { gql } from "@apollo/client";

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      name
      type
      balance
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      accountId
      type
      amount
      description
      reference
      customerId
      vendorId
      createdAt
    }
  }
`;
