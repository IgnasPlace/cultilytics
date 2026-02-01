import { db, tables, desc } from "~~/server/utils/database";

export default defineEventHandler(async (event) => {
  const markerId = getRouterParam(event, "id");
  
  if (!markerId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Marker ID is required",
    });
  }

  try {
    const records = await db.query.plantYieldRecords.findMany({
      where: (records, { eq }) => eq(records.markerId, markerId),
      orderBy: [desc(tables.plantYieldRecords.harvestDate)],
      with: {
        recordedByUser: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    return records;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch yield records",
    });
  }
});
