import { gql } from "graphql-tag";

export const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    category: Category!
    unit: String!
    costPrice: Float!
    salePrice: Float!
    stock: Int!
    lowStockThreshold: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateProductInput {
    name: String!
    sku: String!
    categoryId: String!
    unit: String!
    costPrice: Float!
    salePrice: Float!
    stock: Int
    lowStockThreshold: Int
  }

  input UpdateProductInput {
    name: String
    sku: String
    categoryId: String
    unit: String
    costPrice: Float
    salePrice: Float
    stock: Int
    lowStockThreshold: Int
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
