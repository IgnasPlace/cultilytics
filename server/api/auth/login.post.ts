import { z } from "zod";
import { tables } from "~~/server/utils/database";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, loginSchema.parse);

  const user = await db.query.user.findFirst({
    where: eq(tables.user.email, email),
  });

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

  // throw createError({
  //   statusCode: 401,
  //   message: "Bad credentials",
  // });
});
