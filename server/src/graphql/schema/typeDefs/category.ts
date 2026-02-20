import { gql } from "graphql-tag";

export const categoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [Product!]!
  }

  input CreateCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Category!
  }
`;
