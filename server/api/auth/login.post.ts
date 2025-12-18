import { z } from "zod";
import { tables } from "~~/server/utils/database";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readValidatedBody(
      event,
      loginSchema.parse
    );

    const [user] = await db
      .select()
      .from(tables.user)
      .where(eq(tables.user.email, email));

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const result = await verifyPassword(user.passwordHash, password);

    if (!result) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
      },
      lastLoggedIn: new Date(),
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
});
