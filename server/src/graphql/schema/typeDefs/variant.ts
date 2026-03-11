import { gql } from "graphql-tag";

export const variantTypeDefs = gql`
  type ProductVariant {
    id: ID!
    productId: ID!
    name: String!
    sku: String!
    barcode: String
    costPrice: Float!
    salePrice: Float!
    discountPrice: Float
    stock: Int!
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    product: Product!
  }

  input CreateVariantInput {
    name: String!
    sku: String!
    barcode: String
    costPrice: Float!
    salePrice: Float!
    discountPrice: Float
    stock: Int
    isActive: Boolean
  }

  input UpdateVariantInput {
    name: String
    sku: String
    barcode: String
    costPrice: Float
    salePrice: Float
    discountPrice: Float
    stock: Int
    isActive: Boolean
  }

  extend type Query {
    productVariants(productId: ID!): [ProductVariant!]!
  }

  extend type Mutation {
    createVariant(productId: ID!, input: CreateVariantInput!): ProductVariant!
    updateVariant(id: ID!, input: UpdateVariantInput!): ProductVariant!
    deleteVariant(id: ID!): ProductVariant!
  }
`;
