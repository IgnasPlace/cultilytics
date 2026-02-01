import { H3Error } from "h3";
import { z } from "zod";
import { tables } from "~~/server/utils/database";
import { requireAuth } from "~~/server/utils/auth";

const addMarkerSchema = z.object({
  id: z.string().min(1, "ID is required").max(255),
  name: z.string().min(1, "Name is required").max(255),
  color: z.string(),
  type: z.string(),
  lng: z.number(),
  lat: z.number(),
});

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);
    const userId = parseInt(String(user.id), 10);
    if (isNaN(userId)) {
      throw new Error(`Invalid user ID: ${user.id} (type: ${typeof user.id})`);
    }

    const { id, name, color, type, lng, lat } = await readValidatedBody(
      event,
      addMarkerSchema.parse
    );

    const result = await db
      .insert(tables.marker)
      .values({
        id: id,
        userId: userId,
        name: name,
        color: color,
        type: type,
        lng: lng,
        lat: lat,
      })
      .returning();

    return { success: true, result };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Error creating marker.",
      });
    }
  }
});
