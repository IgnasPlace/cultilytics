import { H3Error } from "h3";
import { tables } from "~~/server/utils/database";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing plant id",
    });
  }

  const { files } = await readBody(event);

  const marker = await db.query.marker.findFirst({
    where: eq(tables.marker.id, id),
  });

  if (marker) {
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          throw createError({
            statusCode: 413,
            statusMessage: "File is too large. Max 5MB",
          });
        }
        if (!file.type.startsWith("image/")) {
          throw createError({
            statusCode: 500,
            statusMessage: "File must be an image.",
          });
        }
        const fileName = `${id}-${Date.now()}`;
        await storeFileLocally(file, fileName);

        const nameSplit = file.name.split(".");
        const fullFileName = `${fileName}.${nameSplit[nameSplit.length - 1]}`;

        const result = await db
          .insert(tables.markerImage)
          .values({
            userId: +user.id,
            markerId: marker.id,
            photoPath: fullFileName,
            desc: `Image of ${marker.id}`,
          })
          .returning();
        console.log(result);
        return { success: true, result };
      }
    } catch (error) {
      if (error instanceof H3Error) {
        throw error;
      } else {
        throw createError({
          statusCode: 500,
          statusMessage: "Error uploading files",
        });
      }
    }
  }
});
