import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { SqliteDialect } from "drizzle-orm/sqlite";

config({ path: ".env" });

export default defineConfig({
  dialect: "turso",
  out: "./migrations",
  schema: "./server/db/schema.ts",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
