import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput) {
    products(filter: $filter) {
      id
      name
      description
      sku
      barcode
      brandId
      brand {
        id
        name
      }
      unit
      weight
      dimensionL
      dimensionW
      dimensionH
      costPrice
      salePrice
      discountPrice
      taxRate
      stock
      lowStockThreshold
      isActive
      expiryDate
      warrantyPeriod
      tags
      mainImage
      supportingImages
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
      mainImage
      supportingImages
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
      name
    }
  }
`;
export const GET_BRANDS = gql`
  query GetBrands {
    brands {
      id
      name
    }
  }
`;

export const CREATE_BRAND = gql`
  mutation CreateBrand($input: CreateBrandInput!) {
    createBrand(input: $input) {
      id
      name
    }
  }
`;
