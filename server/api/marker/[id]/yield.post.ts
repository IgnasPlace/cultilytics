import { db, tables } from "~~/server/utils/database";
import { requireAuth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);
    const userId = parseInt(String(user.id), 10);
    if (isNaN(userId)) {
      throw new Error(`Invalid user ID: ${user.id}`);
    }

    const markerId = getRouterParam(event, "id");
    if (!markerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Marker ID is required",
      });
    }

    const body = await readBody(event);

    if (!body.quantity || !body.unit) {
      throw createError({
        statusCode: 400,
        statusMessage: "Quantity and unit are required",
      });
    }

    const [record] = await db
      .insert(tables.plantYieldRecords)
      .values({
        markerId,
        harvestDate: body.harvestDate ? new Date(body.harvestDate) : new Date(),
        quantity: parseInt(body.quantity),
        unit: body.unit,
        quality: body.quality || null,
        notes: body.notes || null,
        recordedBy: userId,
      })
      .returning();

    return record;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to create yield record",
    });
  }
});
