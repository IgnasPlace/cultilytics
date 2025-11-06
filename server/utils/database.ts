import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

export const db = drizzle("file:./.data/db.sqlite", { schema });
export const tables = schema;

export { and, eq, or } from "drizzle-orm";
