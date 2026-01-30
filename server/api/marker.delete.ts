import { H3Error } from "h3";
import { tables } from "~~/server/utils/database";
import { deleteMarkerFolder } from "~~/server/utils/fileStorage";

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event);

    const userData = await readBody(event);

    // Delete marker folder and all images first
    await deleteMarkerFolder(userData.id);

    // Then delete marker from database (cascade will delete markerImage records)
    await db.delete(tables.marker).where(eq(tables.marker.id, userData.id));

    return { msg: "Marker was deleted." };
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
