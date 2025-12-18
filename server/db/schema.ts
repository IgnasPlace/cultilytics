import { sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

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
  id: t.text("id").unique().primaryKey(),
  lat: t.integer({ mode: "number" }),
  lng: t.integer({ mode: "number" }),
  type: t.text().notNull(),
  color: t.text().notNull(),
  name: t.text().notNull(),
  nameLatin: t.text(),
  createdAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: t
    .integer({ mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
}));

export const markerImage = sqliteTable("markerImage", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  userId: t.integer("userId").references(() => user.id),
  markerId: t
    .text("markerId")
    .references(() => marker.id, { onDelete: "cascade" }),
  photoPath: t.text().notNull(),
  desc: t.text(),
  createdAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}));

export const markerRelations = relations(marker, ({ many }) => ({
  markerImage: many(markerImage),
}));

export const markerImageRelations = relations(markerImage, ({ one }) => ({
  owner: one(marker, {
    fields: [markerImage.markerId],
    references: [marker.id],
  }),
}));
