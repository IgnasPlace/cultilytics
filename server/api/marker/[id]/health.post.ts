import { H3Error } from "h3";
import { z } from "zod";
import { db, tables, eq } from "~~/server/utils/database";
import { requireAuth } from "~~/server/utils/auth";

const healthRecordSchema = z.object({
  status: z.enum(["excellent", "good", "fair", "poor", "critical"]),
  recordedAt: z.number().optional(),
  notes: z.string().nullable().optional(),
});

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
        statusMessage: "Missing marker ID",
      });
    }

    const body = await readValidatedBody(event, healthRecordSchema.parse);

    const result = await db
      .insert(tables.plantHealthRecords)
      .values({
        markerId: markerId,
        status: body.status,
        recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
        notes: body.notes || null,
        recordedBy: userId,
      })
      .returning();

    return { success: true, record: result[0] };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    } else if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid data: ${error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`,
      });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create health record",
      });
    }
  }
});
