import { H3Error } from "h3";
import { z } from "zod";
import { db, tables, eq } from "~~/server/utils/database";
import { requireAuth } from "~~/server/utils/auth";

const updateTaskSchema = z.object({
  completed: z.boolean().optional(),
  notes: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.number().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event);
    
    const markerId = getRouterParam(event, "id");
    const taskId = getRouterParam(event, "taskId");
    
    if (!markerId || !taskId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing marker ID or task ID",
      });
    }

    const taskIdNum = parseInt(taskId, 10);
    if (isNaN(taskIdNum)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid task ID",
      });
    }

    const body = await readValidatedBody(event, updateTaskSchema.parse);

    const updateData: any = {};
    
    if (body.completed !== undefined) {
      updateData.completedAt = body.completed ? new Date() : null;
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }
    if (body.priority !== undefined) {
      updateData.priority = body.priority;
    }
    if (body.dueDate !== undefined) {
      updateData.dueDate = new Date(body.dueDate);
    }

    const result = await db
      .update(tables.plantTasks)
      .set(updateData)
      .where(eq(tables.plantTasks.id, taskIdNum))
      .returning();

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Task not found",
      });
    }

    return { success: true, record: result[0] };
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    } else if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid data: ${error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`,
      });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to update task",
      });
    }
  }
});
