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

export const userRelations = relations(user, ({ many }) => ({
  markers: many(marker),
  healthRecords: many(plantHealthRecords),
  treatments: many(plantTreatments),
  growthRecords: many(plantGrowthRecords),
  tasks: many(plantTasks),
  yieldRecords: many(plantYieldRecords),
  expenses: many(plantExpenses),
}));

export const marker = sqliteTable("marker", (t) => ({
  id: t.text("id").unique().primaryKey(),
  userId: t.integer("userId").references(() => user.id),
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
  thumbnailPath: t.text("thumbnailPath").notNull(),
  mediumPath: t.text("mediumPath").notNull(),
  largePath: t.text("largePath").notNull(),
  desc: t.text(),
  createdAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}));

export const plantHealthRecords = sqliteTable("plantHealthRecords", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  markerId: t
    .text("markerId")
    .references(() => marker.id, { onDelete: "cascade" })
    .notNull(),
  status: t.text({ enum: ["excellent", "good", "fair", "poor", "critical"] }).notNull(),
  notes: t.text(),
  recordedAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  recordedBy: t.integer("recordedBy").references(() => user.id),
}));

export const plantTreatments = sqliteTable("plantTreatments", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  markerId: t
    .text("markerId")
    .references(() => marker.id, { onDelete: "cascade" })
    .notNull(),
  type: t.text({
    enum: ["pruning", "fertilizing", "watering", "pest_control", "mulching", "other"],
  }).notNull(),
  date: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  notes: t.text(),
  products: t.text(),
  performedBy: t.integer("performedBy").references(() => user.id),
  cost: t.integer(),
}));

export const plantGrowthRecords = sqliteTable("plantGrowthRecords", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  markerId: t
    .text("markerId")
    .references(() => marker.id, { onDelete: "cascade" })
    .notNull(),
  height: t.integer().notNull(),
  measuredAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  measuredBy: t.integer("measuredBy").references(() => user.id),
  notes: t.text(),
}));

export const plantTasks = sqliteTable("plantTasks", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  markerId: t
    .text("markerId")
    .references(() => marker.id, { onDelete: "cascade" })
    .notNull(),
  taskType: t.text({
    enum: ["water", "fertilize", "prune", "inspect", "harvest", "other"],
  }).notNull(),
  dueDate: t.integer({ mode: "timestamp_ms" }).notNull(),
  completedAt: t.integer({ mode: "timestamp_ms" }),
  priority: t.text({ enum: ["low", "medium", "high"] }).$defaultFn(() => "medium"),
  notes: t.text(),
  createdBy: t.integer("createdBy").references(() => user.id),
  createdAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}));

export const plantYieldRecords = sqliteTable("plantYieldRecords", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  markerId: t
    .text("markerId")
    .references(() => marker.id, { onDelete: "cascade" })
    .notNull(),
  harvestDate: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  quantity: t.integer().notNull(),
  unit: t.text({ enum: ["kg", "g", "lbs", "units", "baskets"] }).notNull(),
  quality: t.text({ enum: ["excellent", "good", "average", "poor"] }),
  notes: t.text(),
  recordedBy: t.integer("recordedBy").references(() => user.id),
  createdAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}));

export const plantExpenses = sqliteTable("plantExpenses", (t) => ({
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  markerId: t
    .text("markerId")
    .references(() => marker.id, { onDelete: "cascade" })
    .notNull(),
  category: t.text({
    enum: ["seeds", "fertilizer", "tools", "water", "labor", "pest_control", "other"],
  }).notNull(),
  amount: t.integer().notNull(),
  date: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  description: t.text(),
  recordedBy: t.integer("recordedBy").references(() => user.id),
  createdAt: t.integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}));

export const markerRelations = relations(marker, ({ one, many }) => ({
  user: one(user, {
    fields: [marker.userId],
    references: [user.id],
  }),
  markerImage: many(markerImage),
  healthRecords: many(plantHealthRecords),
  treatments: many(plantTreatments),
  growthRecords: many(plantGrowthRecords),
  tasks: many(plantTasks),
  yieldRecords: many(plantYieldRecords),
  expenses: many(plantExpenses),
}));

export const markerImageRelations = relations(markerImage, ({ one }) => ({
  owner: one(marker, {
    fields: [markerImage.markerId],
    references: [marker.id],
  }),
}));

export const plantHealthRecordsRelations = relations(plantHealthRecords, ({ one }) => ({
  marker: one(marker, {
    fields: [plantHealthRecords.markerId],
    references: [marker.id],
  }),
  recordedByUser: one(user, {
    fields: [plantHealthRecords.recordedBy],
    references: [user.id],
  }),
}));

export const plantTreatmentsRelations = relations(plantTreatments, ({ one }) => ({
  marker: one(marker, {
    fields: [plantTreatments.markerId],
    references: [marker.id],
  }),
  performedByUser: one(user, {
    fields: [plantTreatments.performedBy],
    references: [user.id],
  }),
}));

export const plantGrowthRecordsRelations = relations(plantGrowthRecords, ({ one }) => ({
  marker: one(marker, {
    fields: [plantGrowthRecords.markerId],
    references: [marker.id],
  }),
  measuredByUser: one(user, {
    fields: [plantGrowthRecords.measuredBy],
    references: [user.id],
  }),
}));

export const plantTasksRelations = relations(plantTasks, ({ one }) => ({
  marker: one(marker, {
    fields: [plantTasks.markerId],
    references: [marker.id],
  }),
  createdByUser: one(user, {
    fields: [plantTasks.createdBy],
    references: [user.id],
  }),
}));

export const plantYieldRecordsRelations = relations(plantYieldRecords, ({ one }) => ({
  marker: one(marker, {
    fields: [plantYieldRecords.markerId],
    references: [marker.id],
  }),
  recordedByUser: one(user, {
    fields: [plantYieldRecords.recordedBy],
    references: [user.id],
  }),
}));

export const plantExpensesRelations = relations(plantExpenses, ({ one }) => ({
  marker: one(marker, {
    fields: [plantExpenses.markerId],
    references: [marker.id],
  }),
  recordedByUser: one(user, {
    fields: [plantExpenses.recordedBy],
    references: [user.id],
  }),
}));
