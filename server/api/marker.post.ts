import { z } from "zod";
import { tables } from "~~/server/utils/database";

const addMarkerSchema = z.object({
  id: z.string().min(1, "ID is required").max(255),
  name: z.string().min(1, "Name is required").max(255),
  // latin_name: z.string().max(255),
  color: z.string(),
  type: z.string(),
  lng: z.number(),
  lat: z.number(),
});

export default defineEventHandler(async (event) => {
  try {
    // const userData = await readBody(event);

    const { id, name, color, type, lng, lat } = await readValidatedBody(
      event,
      addMarkerSchema.parse
    );

    const result = await db
      .insert(tables.marker)
      .values({
        id: id,
        name: name,
        color: color,
        type: type,
        lng: lng,
        lat: lat,
      })
      .returning();

    // const db = useDatabase("myDB");

    // await db.sql`CREATE TABLE IF NOT EXISTS marker
    // (
    //   id TEXT UNIQUE,
    //   lat INT,
    //   lng INT,
    //   type TEXT,
    //   color TEXT,
    //   name TEXT
    //   )
    //   `;

    // const result = await db.sql`INSERT INTO marker
    //   (id,lat,lng,type,color,name)
    //   VALUES
    //   (${userData.id},${userData.lat},${userData.lng},${userData.type},${userData.color},${userData.name})`;

    return { success: true, result };
  } catch (err) {
    return err;
  }
});
