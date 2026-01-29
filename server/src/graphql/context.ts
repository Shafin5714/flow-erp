import { Request } from "express";
import prisma from "../lib/db.js";
import jwt from "jsonwebtoken";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
}

export interface Context {
  prisma: typeof prisma;
  user: User | null;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

export async function createContext({ req }: { req: Request }): Promise<Context> {
  let user: User | null = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as User;
      user = decoded;
    } catch (error) {
      // Invalid token, user remains null
    }
  }

  return {
    prisma,
    user,
  };
}
