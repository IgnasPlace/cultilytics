import { H3Error } from "h3";
import { db, tables, eq } from "~~/server/utils/database";
import { deleteFile } from "~~/server/utils/fileStorage";
import { requireAuth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);
    const userId = parseInt(String(user.id), 10);
    if (isNaN(userId)) {
      throw new Error(`Invalid user ID: ${user.id} (type: ${typeof user.id})`);
    }

    const imageId = getRouterParam(event, "id");
    if (!imageId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing image ID",
      });
    }

    const imageIdNum = parseInt(imageId, 10);
    if (isNaN(imageIdNum)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid image ID",
      });
    }

    const image = await db.query.markerImage.findFirst({
      where: eq(tables.markerImage.id, imageIdNum),
      with: {
        owner: true,
      },
    });

    if (!image) {
      throw createError({
        statusCode: 404,
        statusMessage: "Image not found",
      });
    }

    const canDelete = userId === image.userId || userId === image.owner?.userId;

    if (!canDelete) {
      throw createError({
        statusCode: 403,
        statusMessage: "You don't have permission to delete this image",
      });
    }

    await deleteFile(image.thumbnailPath);
    await deleteFile(image.mediumPath);
    await deleteFile(image.largePath);

    await db
      .delete(tables.markerImage)
      .where(eq(tables.markerImage.id, imageIdNum));

    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Delete image error:", error);

    if (error instanceof H3Error) {
      throw error;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to delete image: ${errorMessage}`,
      });
    }
  }
});
