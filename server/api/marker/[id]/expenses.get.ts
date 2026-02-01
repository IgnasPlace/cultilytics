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
    const expenses = await db.query.plantExpenses.findMany({
      where: (expenses, { eq }) => eq(expenses.markerId, markerId),
      orderBy: [desc(tables.plantExpenses.date)],
      with: {
        recordedByUser: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });

    return expenses;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || "Failed to fetch expenses",
    });
  }
});
