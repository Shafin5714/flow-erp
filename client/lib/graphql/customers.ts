import { gql } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query GetCustomers {
    customers {
      id
      name
      email
      phone
      balance
      createdAt
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      name
      email
      phone
      address
      balance
      createdAt
      updatedAt
      sales {
        id
        invoiceNumber
        total
        paymentMode
        dueAmount
        createdAt
      }
      transactions {
        id
        type
        amount
        description
        reference
        createdAt
        account {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      id
      name
      email
      phone
      address
      balance
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      name
      email
      phone
      address
      balance
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      id
    }
  }
`;
