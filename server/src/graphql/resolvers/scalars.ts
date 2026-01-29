import { GraphQLScalarType, Kind } from "graphql";

export const dateTimeResolver = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "DateTime custom scalar type",
    serialize(value: unknown): string {
      if (value instanceof Date) {
        return value.toISOString();
      }
      throw new Error("DateTime cannot represent non-Date type");
    },
    parseValue(value: unknown): Date {
      if (typeof value === "string" || typeof value === "number") {
        return new Date(value);
      }
      throw new Error("DateTime cannot represent non-string/number type");
    },
    parseLiteral(ast): Date | null {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),
};
