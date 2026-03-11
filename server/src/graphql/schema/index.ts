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
  brandTypeDefs,
  variantTypeDefs,
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
  brandResolvers,
  variantResolvers,
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
  brandTypeDefs,
  variantTypeDefs,
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
  brandResolvers,
  variantResolvers,
]);

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
