import { H3Error } from "h3";
import { db, tables, eq } from "~~/server/utils/database";
import {
  processAndSaveImages,
  validateImageFormat,
} from "~~/server/utils/imageProcessor";
import { requireAuth } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const userId = parseInt(String(user.id), 10);
  if (isNaN(userId)) {
    throw new Error(`Invalid user ID: ${user.id} (type: ${typeof user.id})`);
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing plant id",
    });
  }

  // Handle multipart form data
  try {
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "No files provided",
      });
    }

    const marker = await db.query.marker.findFirst({
      where: eq(tables.marker.id, id),
    });

    if (!marker) {
      throw createError({
        statusCode: 404,
        statusMessage: "Marker not found",
      });
    }

    const results = [];

    for (const item of formData) {
      if (item.type && item.type.startsWith("image/")) {
        // Validate file size
        if (item.data && item.data.length > 5 * 1024 * 1024) {
          throw createError({
            statusCode: 413,
            statusMessage: "File is too large. Max 5MB",
          });
        }

        // Validate image format
        if (!validateImageFormat(item.type)) {
          throw createError({
            statusCode: 400,
            statusMessage: `Invalid image format. Accepts: JPG, PNG, GIF, WebP, BMP, TIFF`,
          });
        }

        // Process and save images
        const timestamp = Date.now().toString();
        const paths = await processAndSaveImages(item.data!, id, timestamp);
        console.log("USER: ", userId);
        console.log("thumbnailPath: ", paths.thumbnailPath);
        // Save to database
        const result = await db
          .insert(tables.markerImage)
          .values({
            userId: userId,
            markerId: marker.id,
            thumbnailPath: paths.thumbnailPath,
            mediumPath: paths.mediumPath,
            largePath: paths.largePath,
            desc: `Image of ${marker.id}`,
          })
          .returning();

        results.push(result[0]);
      }
    }

    return { success: true, result: results };
  } catch (error) {
    console.error("Upload error details:", error);

    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      console.error("Error cause:", (error as any).cause);
    }

    if (error instanceof H3Error) {
      throw error;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw createError({
        statusCode: 500,
        statusMessage: `Upload failed: ${errorMessage}`,
      });
    }
  }
});
