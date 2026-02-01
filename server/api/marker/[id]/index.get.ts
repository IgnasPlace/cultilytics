import { db, tables, eq, desc } from "~~/server/utils/database";
import { requireAuth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);

    const markerId = getRouterParam(event, "id");
    if (!markerId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Marker ID is required",
      });
    }

    const marker = await db.query.marker.findFirst({
      where: eq(tables.marker.id, markerId),
      with: {
        markerImage: true,
        healthRecords: {
          orderBy: desc(tables.plantHealthRecords.recordedAt),
          limit: 5,
        },
        growthRecords: {
          orderBy: desc(tables.plantGrowthRecords.measuredAt),
          limit: 5,
        },
        tasks: {
          orderBy: desc(tables.plantTasks.dueDate),
          limit: 10,
        },
        treatments: {
          orderBy: desc(tables.plantTreatments.date),
          limit: 10,
        },
        yieldRecords: {
          orderBy: desc(tables.plantYieldRecords.harvestDate),
          limit: 10,
        },
        expenses: {
          orderBy: desc(tables.plantExpenses.date),
          limit: 10,
        },
      },
    });

    if (!marker) {
      throw createError({
        statusCode: 404,
        statusMessage: "Marker not found",
      });
    }

    return marker;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch marker",
    });
  }
});
