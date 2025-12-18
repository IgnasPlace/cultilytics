import { tables } from "~~/server/utils/database";

export default defineEventHandler(async () => {
  const markers = await db.query.marker.findMany({
    with: {
      markerImage: true,
    },
  });

  if (!markers) {
    throw Error("No markers found.");
  }

  return markers;
});
