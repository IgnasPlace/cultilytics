import { tables } from "~~/server/utils/database";

export default defineEventHandler(async (event) => {
  const userData = await readBody(event);

  await db.delete(tables.marker).where(eq(tables.marker.id, userData.id));

  return { msg: "Marker was deleted." };
});
