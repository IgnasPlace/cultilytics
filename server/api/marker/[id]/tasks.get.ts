import { H3Error } from "h3";
import { db, tables, eq, desc, and, isNull } from "~~/server/utils/database";
import { requireAuth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event);

    const markerId = getRouterParam(event, "id");
    if (!markerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing marker ID",
      });
    }

    const records = await db.query.plantTasks.findMany({
      where: eq(tables.plantTasks.markerId, markerId),
      orderBy: desc(tables.plantTasks.dueDate),
      with: {
        createdByUser: true,
      },
    });

    return records;
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch tasks",
      });
    }
  }
});
