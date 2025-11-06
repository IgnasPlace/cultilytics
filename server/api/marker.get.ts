export default defineEventHandler(async (event) => {
  const markers = await db.query.marker.findMany();

  if (!markers) {
    throw Error("No markers found.");
  }

  return markers;
});
