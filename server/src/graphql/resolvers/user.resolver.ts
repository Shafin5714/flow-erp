import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "../context.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const userResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user) return null;
      return prisma.user.findUnique({ where: { id: user.id } });
    },
    users: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
      return prisma.user.findMany();
    },
    user: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      if (!user) throw new Error("Unauthorized");
      return prisma.user.findUnique({ where: { id } });
    },
  },
  Mutation: {
    login: async (
      _: unknown,
      { input }: { input: { email: string; password: string } },
      { prisma }: Context
    ) => {
      const user = await prisma.user.findUnique({ where: { email: input.email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const validPassword = await bcrypt.compare(input.password, user.password);
      if (!validPassword) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
      );

      return { token, user };
    },
    register: async (
      _: unknown,
      { input }: { input: { email: string; name: string; password: string; role?: string } },
      { prisma, user }: Context
    ) => {
      // Only admins can register new users
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newUser = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
          role: (input.role as "ADMIN" | "MANAGER" | "STAFF") || "STAFF",
        },
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
        JWT_SECRET as jwt.Secret,
        { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
      );

      return { token, user: newUser };
    },
  },
};
