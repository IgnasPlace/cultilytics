import { H3Error } from "h3";
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
    const { id, name, color, type, lng, lat } = await readValidatedBody(
      event,
      addMarkerSchema.parse
    );

    const { user } = await requireUserSession(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized. Please log in to create a marker.",
      });
    }

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

    console.log(result);

    return { success: true, result };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting marker.",
      });
    }
  }
});
