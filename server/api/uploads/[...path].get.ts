import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { resolve } from "path";

export default defineEventHandler(async (event) => {
  const pathParam = getRouterParam(event, "path");
  if (!pathParam) {
    throw createError({ statusCode: 400, statusMessage: "Path required" });
  }

  // Sanitize and resolve path
  const filePath = resolve("/app/public/uploads", pathParam);
  const uploadsDir = resolve("/app/public/uploads");

  // Security: ensure path is within uploads directory
  if (!filePath.startsWith(uploadsDir)) {
    throw createError({ statusCode: 403, statusMessage: "Access denied" });
  }

  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      throw createError({ statusCode: 404, statusMessage: "Not found" });
    }

    // Set appropriate content type based on extension
    const ext = filePath.split(".").pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      webp: "image/webp",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
    };

    setResponseHeader(
      event,
      "Content-Type",
      contentTypes[ext || ""] || "application/octet-stream"
    );
    setResponseHeader(event, "Cache-Control", "public, max-age=31536000"); // 1 year cache

    return sendStream(event, createReadStream(filePath));
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Not found" });
  }
});
