import { tables, desc } from "~~/server/utils/database";

export default defineEventHandler(async () => {
  const markers = await db.query.marker.findMany({
    with: {
      markerImage: true,
      healthRecords: {
        orderBy: desc(tables.plantHealthRecords.recordedAt),
        limit: 1,
      },
      growthRecords: {
        orderBy: desc(tables.plantGrowthRecords.measuredAt),
        limit: 1,
      },
      tasks: {
        where: (tasks, { isNull }) => isNull(tasks.completedAt),
        orderBy: desc(tables.plantTasks.dueDate),
        limit: 3,
      },
      treatments: {
        orderBy: desc(tables.plantTreatments.date),
        limit: 3,
      },
      yieldRecords: {
        orderBy: desc(tables.plantYieldRecords.harvestDate),
        limit: 5,
      },
      expenses: {
        orderBy: desc(tables.plantExpenses.date),
        limit: 5,
      },
    },
  });

  if (!markers) {
    throw Error("No markers found.");
  }

  return markers;
});
