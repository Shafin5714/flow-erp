import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput) {
    products(filter: $filter) {
      id
      name
      sku
      unit
      costPrice
      salePrice
      stock
      lowStockThreshold
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      sku
    }
  }
`;
