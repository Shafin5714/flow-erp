import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { schema } from "./graphql/schema/index.js";
import { createContext, Context } from "./graphql/context.js";

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = new ApolloServer<Context>({
    schema,
    introspection: true,
  });

  await server.start();

  app.use(
    cors<cors.CorsRequest>({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: createContext,
    })
  );

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
    console.log(`📊 Health check at http://localhost:${PORT}/health`);
  });
}

startServer().catch(console.error);
