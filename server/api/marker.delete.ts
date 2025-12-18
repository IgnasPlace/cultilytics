import { H3Error } from "h3";
import { tables } from "~~/server/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const userData = await readBody(event);
    const { user } = await requireUserSession(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized. Please log in to delete the marker.",
      });
    }

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
