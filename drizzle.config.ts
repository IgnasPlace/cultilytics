import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  out: "./server/db/drizzle",
  schema: "./server/db/schema.ts",
  dbCredentials: {
    url: "file:./.data/db.sqlite",
  },
});
