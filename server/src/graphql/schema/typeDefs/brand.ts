import { gql } from "graphql-tag";

export const brandTypeDefs = gql`
  type Brand {
    id: ID!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [Product!]!
  }

  input CreateBrandInput {
    name: String!
  }

  input UpdateBrandInput {
    name: String
  }

  extend type Query {
    brands: [Brand!]!
    brand(id: ID!): Brand
  }

  extend type Mutation {
    createBrand(input: CreateBrandInput!): Brand!
    updateBrand(id: ID!, input: UpdateBrandInput!): Brand!
    deleteBrand(id: ID!): Brand!
  }
`;
