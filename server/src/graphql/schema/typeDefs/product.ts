import { gql } from "graphql-tag";

export const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    sku: String!
    barcode: String
    brandId: String
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
    expiryDate: DateTime
    warrantyPeriod: String
    tags: [String!]
    mainImage: String
    supportingImages: [String!]
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
