import { sqliteTable } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  name: t.text().notNull(),
  role: t.text().notNull(),
  email: t.text().notNull().unique(),
  passwordHash: t.text().notNull(),
  createdAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: t
    .integer({ mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
}));

export const marker = sqliteTable("marker", (t) => ({
  id: t.text("id").unique(),
  lat: t.integer({ mode: "number" }),
  lng: t.integer({ mode: "number" }),
  type: t.text().notNull(),
  color: t.text().notNull(),
  name: t.text().notNull(),
  name_latin: t.text(),
}));
