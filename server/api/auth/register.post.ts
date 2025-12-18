import { z } from "zod";
import { tables } from "~~/server/utils/database";

const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(1, "Name is required").max(255),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export default defineEventHandler(async (event) => {
  try {
    const { email, name, password } = await readValidatedBody(
      event,
      registerSchema.parse
    );

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(tables.user)
      .values({
        name: name,
        role: "user",
        email: email,
        passwordHash: hashedPassword,
      })
      .returning();

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
      statusMessage: "Failed to register new user.",
    });
  }
});
