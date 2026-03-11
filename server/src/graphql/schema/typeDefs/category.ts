import { gql } from "graphql-tag";

export const categoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    parentId: String
    parent: Category
    children: [Category!]!
    createdAt: DateTime!
    updatedAt: DateTime!
    products: [Product!]!
  }

  input CreateCategoryInput {
    name: String!
    parentId: String
  }

  input UpdateCategoryInput {
    name: String
    parentId: String
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
