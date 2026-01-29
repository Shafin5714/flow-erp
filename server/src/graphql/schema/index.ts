import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import {
  baseTypeDefs,
  userTypeDefs,
  categoryTypeDefs,
  productTypeDefs,
  customerTypeDefs,
  vendorTypeDefs,
  saleTypeDefs,
  purchaseTypeDefs,
  accountTypeDefs,
  dashboardTypeDefs,
} from "./typeDefs/index.js";
import {
  dateTimeResolver,
  userResolvers,
  categoryResolvers,
  productResolvers,
  customerResolvers,
  vendorResolvers,
  saleResolvers,
  purchaseResolvers,
  accountResolvers,
  dashboardResolvers,
} from "../resolvers/index.js";

const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  userTypeDefs,
  categoryTypeDefs,
  productTypeDefs,
  customerTypeDefs,
  vendorTypeDefs,
  saleTypeDefs,
  purchaseTypeDefs,
  accountTypeDefs,
  dashboardTypeDefs,
]);

const resolvers = mergeResolvers([
  dateTimeResolver,
  userResolvers,
  categoryResolvers,
  productResolvers,
  customerResolvers,
  vendorResolvers,
  saleResolvers,
  purchaseResolvers,
  accountResolvers,
  dashboardResolvers,
]);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
