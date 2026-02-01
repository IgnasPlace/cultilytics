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

    if (!body.category || !body.amount) {
      throw createError({
        statusCode: 400,
        statusMessage: "Category and amount are required",
      });
    }

    const [expense] = await db
      .insert(tables.plantExpenses)
      .values({
        markerId,
        category: body.category,
        amount: parseInt(body.amount),
        date: body.date ? new Date(body.date) : new Date(),
        description: body.description || null,
        recordedBy: userId,
      })
      .returning();

    return expense;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to create expense",
    });
  }
});
