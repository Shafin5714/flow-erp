import { gql } from "@apollo/client";

export const GET_VENDORS = gql`
  query GetVendors {
    vendors {
      id
      name
      email
      phone
      address
      balance
      createdAt
      updatedAt
    }
  }
`;

export const GET_VENDOR = gql`
  query GetVendor($id: ID!) {
    vendor(id: $id) {
      id
      name
      email
      phone
      address
      balance
      createdAt
      updatedAt
      purchases {
        id
        subtotal
        total
        paidAmount
        dueAmount
        createdAt
        updatedAt
      }
      transactions {
        id
        amount
        type
        date
      }
    }
  }
`;

export const CREATE_VENDOR = gql`
  mutation CreateVendor($input: CreateVendorInput!) {
    createVendor(input: $input) {
      id
      name
      email
      phone
      address
      balance
    }
  }
`;

export const UPDATE_VENDOR = gql`
  mutation UpdateVendor($id: ID!, $input: UpdateVendorInput!) {
    updateVendor(id: $id, input: $input) {
      id
      name
      email
      phone
      address
      balance
    }
  }
`;

export const DELETE_VENDOR = gql`
  mutation DeleteVendor($id: ID!) {
    deleteVendor(id: $id) {
      id
      name
    }
  }
`;
