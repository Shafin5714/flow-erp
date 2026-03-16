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
      categoryId
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
      hasVariants
      variants {
        id
        name
        sku
        barcode
        costPrice
        salePrice
        discountPrice
        stock
        isActive
      }
      expiryDate
      warrantyPeriod
      tags
      mainImage
      supportingImages
      category {
        id
        name
        parentId
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      sku
      barcode
      brandId
      categoryId
      brand {
        id
        name
      }
      category {
        id
        name
        parentId
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
      hasVariants
      variants {
        id
        name
        sku
        barcode
        costPrice
        salePrice
        discountPrice
        stock
        isActive
      }
      expiryDate
      warrantyPeriod
      tags
      mainImage
      supportingImages
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
      parentId
      children {
        id
        name
      }
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
      hasVariants
      variants {
        id
        name
        sku
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      sku
      mainImage
      supportingImages
      hasVariants
      variants {
        id
        name
        sku
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      parentId
      children {
        id
        name
      }
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

export const DELETE_BRAND = gql`
  mutation DeleteBrand($id: ID!) {
    deleteBrand(id: $id) {
      id
      name
    }
  }
`;
