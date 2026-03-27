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

export const GET_ACCOUNT = gql`
  query GetAccount($id: ID!) {
    account(id: $id) {
      id
      name
      type
      balance
      createdAt
      updatedAt
      transactions {
        id
        type
        amount
        description
        reference
        createdAt
        customer {
          id
          name
        }
        vendor {
          id
          name
        }
      }
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($accountId: ID, $startDate: DateTime, $endDate: DateTime) {
    transactions(accountId: $accountId, startDate: $startDate, endDate: $endDate) {
      id
      type
      amount
      description
      reference
      createdAt
      account {
        id
        name
        type
      }
      customer {
        id
        name
      }
      vendor {
        id
        name
      }
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      type
      balance
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: ID!, $input: UpdateAccountInput!) {
    updateAccount(id: $id, input: $input) {
      id
      name
      type
      balance
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($id: ID!) {
    deleteAccount(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      account {
        id
        name
        balance
      }
      type
      amount
      description
      reference
      customer {
        id
      }
      vendor {
        id
      }
      createdAt
    }
  }
`;
