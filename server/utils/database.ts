import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

config({ path: ".env" });

export const db: ReturnType<typeof drizzle<typeof schema>> = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema,
});
export const tables = schema;

export { and, eq, or, desc, asc, isNull, isNotNull, sql } from "drizzle-orm";
