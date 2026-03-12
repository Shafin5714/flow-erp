import { gql } from "graphql-tag";

export const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    sku: String!
    barcode: String
    brandId: String
    categoryId: String!
    brand: Brand
    category: Category!
    unit: String!
    weight: Float
    dimensionL: Float
    dimensionW: Float
    dimensionH: Float
    costPrice: Float!
    salePrice: Float!
    discountPrice: Float
    taxRate: Float
    stock: Int!
    lowStockThreshold: Int!
    isActive: Boolean!
    hasVariants: Boolean!
    variants: [ProductVariant!]!
    expiryDate: DateTime
    warrantyPeriod: String
    tags: [String!]!
    mainImage: String
    supportingImages: [String!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateProductInput {
    name: String!
    description: String
    sku: String!
    barcode: String
    brandId: String
    categoryId: String!
    unit: String!
    weight: Float
    dimensionL: Float
    dimensionW: Float
    dimensionH: Float
    costPrice: Float!
    salePrice: Float!
    discountPrice: Float
    taxRate: Float
    stock: Int
    lowStockThreshold: Int
    isActive: Boolean
    hasVariants: Boolean
    variants: [CreateVariantInput!]
    expiryDate: DateTime
    warrantyPeriod: String
    tags: [String!]
    mainImage: String
    supportingImages: [String!]
  }

  input UpdateVariantInput {
    id: ID
    name: String
    sku: String
    barcode: String
    costPrice: Float
    salePrice: Float
    discountPrice: Float
    stock: Int
    isActive: Boolean
  }

  input UpdateProductInput {
    name: String
    description: String
    sku: String
    barcode: String
    brandId: String
    categoryId: String
    unit: String
    weight: Float
    dimensionL: Float
    dimensionW: Float
    dimensionH: Float
    costPrice: Float
    salePrice: Float
    discountPrice: Float
    taxRate: Float
    stock: Int
    lowStockThreshold: Int
    isActive: Boolean
    hasVariants: Boolean
    variants: [UpdateVariantInput!]
    expiryDate: DateTime
    warrantyPeriod: String
    tags: [String!]
    mainImage: String
    supportingImages: [String!]
  }

  input ProductFilterInput {
    search: String
    categoryId: String
    lowStockOnly: Boolean
  }

  extend type Query {
    products(filter: ProductFilterInput): [Product!]!
    product(id: ID!): Product
    lowStockProducts: [Product!]!
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Product!
    adjustStock(id: ID!, quantity: Int!): Product!
  }
`;
